import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { quests as initialQuests } from '../data/quests'
import { roles as initialRoles, characters as initialCharacters } from '../data/characters'
import { events as initialEvents } from '../data/events'

const ContentContext = createContext()

export const useContent = () => useContext(ContentContext)

export const ContentProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)

    // States with Local fallbacks
    const [quests, setQuests] = useState(initialQuests)
    const [roles, setRoles] = useState(initialRoles)
    const [characters, setCharacters] = useState(initialCharacters)
    const [events, setEvents] = useState(initialEvents)
    const [announcement, setAnnouncement] = useState({
        title: 'Welcome to DreamWorld! 🌟',
        date: 'January 18, 2026',
        content: "We're thrilled to launch DreamWorld—a space for learning, creating, and growing together.",
        linkText: "View This Week's Quests",
        linkTo: '/quests'
    })

    // --- Supabase Data Fetch ---
    const fetchData = async () => {
        try {
            setLoading(true)

            // 1. Fetch Quests
            const { data: qData } = await supabase.from('quests').select('*').order('created_at', { ascending: false })
            if (qData) {
                setQuests(qData.map(q => ({
                    ...q,
                    amountNeeded: q.amount_needed || '0',
                    amountRaised: q.amount_raised || '0',
                    fundingStatus: q.funding_status || 'not-funded',
                    galleryImages: Array.isArray(q.gallery_images) ? q.gallery_images : [],
                    completionImages: Array.isArray(q.completion_images) ? q.completion_images : [],
                    completionNote: q.completion_note || '',
                    dateCompleted: q.date_completed || '',
                    steps: typeof q.steps === 'string' ? q.steps.split('\n').filter(s => s.trim()) : []
                })))
            }

            // 2. Fetch Roles
            const { data: rData } = await supabase.from('roles').select('*').order('created_at', { ascending: true })
            if (rData) {
                setRoles(rData.map(r => ({
                    ...r,
                    traits: typeof r.traits === 'string' ? r.traits.split('\n').filter(t => t.trim()) : []
                })))
            }

            // 3. Fetch Characters (Dreamers)
            const { data: cData } = await supabase.from('dreamers').select('*').order('created_at', { ascending: false })
            if (cData) {
                setCharacters(cData.map(c => ({
                    ...c,
                    coverImage: c.cover_image,
                    themes: typeof c.themes === 'string' ? c.themes.split(',').map(t => t.trim()).filter(Boolean) : [],
                    socials: { youtube: c.youtube, instagram: c.instagram, facebook: c.facebook, twitter: c.twitter }
                })))
            }

            // 4. Fetch Events
            const { data: eData } = await supabase.from('events').select('*').order('created_at', { ascending: false })
            if (eData) {
                setEvents(eData.map(e => ({
                    ...e,
                    amountNeeded: e.amount_needed || '0',
                    amountRaised: e.amount_raised || '0',
                    fundingStatus: e.funding_status || 'not-funded',
                    galleryImages: Array.isArray(e.gallery_images) ? e.gallery_images : [],
                    completionImages: Array.isArray(e.completion_images) ? e.completion_images : [],
                    completionNote: e.completion_note || '',
                    dateCompleted: e.date_completed || '',
                    registrationLink: e.registration_link || ''
                })))
            }

            // 5. Fetch Announcement
            const { data: aData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(1)
            if (aData && aData[0]) {
                setAnnouncement({
                    ...aData[0],
                    linkText: aData[0].link_text,
                    linkTo: aData[0].link_to
                })
            }

            setLoading(false)
        } catch (error) {
            console.error("Supabase Fetch Error:", error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // --- Helper Methods ---
    const saveToSupabase = async (table, data, isDelete = false, id = null) => {
        try {
            if (isDelete) {
                const { error } = await supabase.from(table).delete().eq('id', id)
                if (error) throw error
            } else {
                const { error } = await supabase.from(table).upsert(data)
                if (error) throw error
            }
            return true
        } catch (error) {
            console.error(`Supabase Error (${table}):`, error)
            alert(`Database Error: ${error.message}`)
            return false
        }
    }

    // --- Actions ---

    const addQuest = async (newQuest) => {
        const id = `quest-${Date.now()}`
        const payload = {
            id,
            title: newQuest.title,
            purpose: newQuest.purpose,
            difficulty: newQuest.difficulty,
            time_needed: newQuest.timeNeeded,
            steps: Array.isArray(newQuest.steps) ? newQuest.steps.join('\n') : newQuest.steps,
            impact: newQuest.impact,
            share_prompt: newQuest.sharePrompt,
            amount_needed: parseFloat(newQuest.amountNeeded || 0),
            funding_status: newQuest.needsFunding ? 'active' : 'not-funded'
        }
        if (await saveToSupabase('quests', payload)) fetchData()
    }

    const updateQuest = async (id, updated) => {
        const payload = {
            id,
            title: updated.title,
            purpose: updated.purpose,
            difficulty: updated.difficulty,
            time_needed: updated.timeNeeded,
            impact: updated.impact,
            share_prompt: updated.sharePrompt,
            amount_needed: updated.amountNeeded ? parseFloat(updated.amountNeeded) : 0,
            amount_raised: updated.amountRaised ? parseFloat(updated.amountRaised) : 0,
            funding_status: updated.fundingStatus,
            gallery_images: updated.galleryImages || [],
            completion_images: updated.completionImages || [],
            completion_note: updated.completionNote || '',
            date_completed: updated.dateCompleted || '',
            steps: Array.isArray(updated.steps) ? updated.steps.join('\n') : (updated.steps || '')
        }

        if (await saveToSupabase('quests', payload)) fetchData()
    }

    const deleteQuest = async (id) => {
        if (await saveToSupabase('quests', null, true, id)) fetchData()
    }

    const addRole = async (newRole) => {
        const id = newRole.id || `role-${Date.now()}`
        const payload = {
            id,
            name: newRole.name,
            singular: newRole.singular,
            description: newRole.description,
            color: newRole.color,
            traits: Array.isArray(newRole.traits) ? newRole.traits.join('\n') : newRole.traits,
            philosophy: newRole.philosophy
        }
        if (await saveToSupabase('roles', payload)) fetchData()
    }

    const updateRole = async (id, updated) => {
        const payload = {
            id,
            name: updated.name,
            singular: updated.singular,
            description: updated.description,
            color: updated.color,
            traits: Array.isArray(updated.traits) ? updated.traits.join('\n') : updated.traits,
            philosophy: updated.philosophy
        }
        if (await saveToSupabase('roles', payload)) fetchData()
    }

    const deleteRole = async (id) => {
        if (await saveToSupabase('roles', null, true, id)) fetchData()
    }

    const addCharacter = async (newChar) => {
        const id = newChar.id || `mem-${Date.now()}`
        const payload = {
            id,
            name: newChar.name,
            role: newChar.role,
            title: newChar.title,
            avatar: newChar.avatar,
            cover_image: newChar.coverImage,
            bio: newChar.bio,
            themes: Array.isArray(newChar.themes) ? newChar.themes.join(',') : newChar.themes,
            joined_date: new Date().toISOString().split('T')[0],
            youtube: newChar.socials?.youtube || '',
            instagram: newChar.socials?.instagram || '',
            facebook: newChar.socials?.facebook || '',
            twitter: newChar.socials?.twitter || ''
        }
        if (await saveToSupabase('dreamers', payload)) fetchData()
    }

    const updateCharacter = async (id, updated) => {
        const payload = {
            id,
            name: updated.name,
            role: updated.role,
            title: updated.title,
            avatar: updated.avatar,
            cover_image: updated.coverImage,
            bio: updated.bio,
            themes: Array.isArray(updated.themes) ? updated.themes.join(',') : updated.themes,
            youtube: updated.socials?.youtube || updated.youtube || '',
            instagram: updated.socials?.instagram || updated.instagram || '',
            facebook: updated.socials?.facebook || updated.facebook || '',
            twitter: updated.socials?.twitter || updated.twitter || ''
        }

        if (await saveToSupabase('dreamers', payload)) fetchData()
    }

    const deleteCharacter = async (id) => {
        if (await saveToSupabase('dreamers', null, true, id)) fetchData()
    }

    const addEvent = async (newEvent) => {
        const id = `ev-${Date.now()}`
        const payload = {
            id,
            title: newEvent.title,
            host: newEvent.host,
            type: newEvent.type,
            date: newEvent.date,
            location: newEvent.location,
            description: newEvent.description,
            registration_link: newEvent.registrationLink,
            amount_needed: parseFloat(newEvent.amountNeeded || 0),
            funding_status: newEvent.needsFunding ? 'active' : 'not-funded'
        }
        if (await saveToSupabase('events', payload)) fetchData()
    }

    const updateEvent = async (id, updated) => {
        const payload = {
            id,
            title: updated.title,
            host: updated.host,
            type: updated.type,
            date: updated.date,
            location: updated.location,
            description: updated.description,
            registration_link: updated.registrationLink,
            amount_needed: updated.amountNeeded ? parseFloat(updated.amountNeeded) : 0,
            amount_raised: updated.amountRaised ? parseFloat(updated.amountRaised) : 0,
            funding_status: updated.fundingStatus,
            gallery_images: updated.galleryImages || [],
            completion_images: updated.completionImages || [],
            completion_note: updated.completionNote || '',
            date_completed: updated.dateCompleted || ''
        }

        if (await saveToSupabase('events', payload)) fetchData()
    }

    const deleteEvent = async (id) => {
        if (await saveToSupabase('events', null, true, id)) fetchData()
    }

    const updateAnnouncement = async (form) => {
        const payload = {
            title: form.title,
            date: form.date,
            content: form.content,
            link_text: form.linkText,
            link_to: form.linkTo
        }
        if (await saveToSupabase('announcements', payload)) fetchData()
    }

    const submitDreamerApplication = async (formData) => {
        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            whydream: formData.reason,
            whyrole: formData.roleReason,
            otherrole: formData.otherRole,
            age: formData.age,
            gender: formData.gender
        }
        await saveToSupabase('joindream', payload)
    }

    const submitDonation = async (donationData) => {
        const payload = {
            name: donationData.name,
            email: donationData.email,
            amount: parseFloat(donationData.amount),
            type: donationData.type,
            message: donationData.message,
            date: new Date().toISOString().split('T')[0],
            status: donationData.status || 'success',
            payment_method: donationData.paymentMethod || '',
            transaction_id: donationData.transactionId || '',
            sponsorship_type: donationData.sponsorshipType || 'general',
            sponsorship_id: donationData.sponsorshipId || '',
            sponsorship_message: donationData.sponsorshipMessage || ''
        }
        await saveToSupabase('donations', payload)

        // Update target quest/event funding
        if (donationData.sponsorshipId && donationData.sponsorshipType !== 'general') {
            const table = donationData.sponsorshipType === 'quest' ? 'quests' : 'events'
            const { data } = await supabase.from(table).select('amount_raised').eq('id', donationData.sponsorshipId).single()
            if (data) {
                const newAmount = (parseFloat(data.amount_raised || 0) + parseFloat(donationData.amount)).toString()
                await supabase.from(table).update({ amount_raised: newAmount }).eq('id', donationData.sponsorshipId)
                fetchData() // Refresh UI
            }
        }
    }

    const sponsorships = useMemo(() => {
        const qSpons = quests.filter(q => parseFloat(q.amountNeeded) > 0).map(q => ({ ...q, type: 'quest', name: q.title, description: q.purpose }));
        const eSpons = events.filter(e => parseFloat(e.amountNeeded) > 0).map(e => ({ ...e, type: 'event', name: e.title, description: e.description }));
        return [...qSpons, ...eSpons];
    }, [quests, events]);

    return (
        <ContentContext.Provider value={{
            loading,
            quests, addQuest, updateQuest, deleteQuest,
            roles, addRole, updateRole, deleteRole,
            characters, addCharacter, updateCharacter, deleteCharacter,
            events, addEvent, updateEvent, deleteEvent,
            announcement, updateAnnouncement,
            syncGlobalData: fetchData, // Reuse fetchData as a refresh for UI consistency
            submitDreamerApplication,
            submitDonation,
            sponsorships
        }}>
            {children}
        </ContentContext.Provider>
    )
}
