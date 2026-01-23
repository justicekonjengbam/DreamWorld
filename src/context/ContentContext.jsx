import { createContext, useContext, useState, useEffect } from 'react'
import { quests as initialQuests } from '../data/quests'
import { roles as initialRoles, characters as initialCharacters } from '../data/characters'
import { events as initialEvents } from '../data/events'

const ContentContext = createContext()

export const useContent = () => useContext(ContentContext)

const API_URL = import.meta.env.VITE_SHEET_API_URL

export const ContentProvider = ({ children }) => {
    const [loading, setLoading] = useState(!!API_URL)

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

    // --- API Sync (Fetch) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try to fetch from our Vercel KV cache bridge
                const response = await fetch('/api/data')

                if (!response.ok) {
                    throw new Error(`Cache fetch failed (Status: ${response.status})`)
                }

                const contentType = response.headers.get("content-type")
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("API returned non-JSON response (likely 404 in local dev)")
                }

                const data = await response.json()

                if (data.quests) {
                    setQuests(data.quests.map(q => {
                        const n = {}
                        Object.keys(q).forEach(k => n[k.toLowerCase().trim()] = q[k])
                        return { ...n, id: n.id || `q-${Date.now()}`, steps: n.steps ? String(n.steps).split('\n') : [] }
                    }))
                }
                if (data.roles) {
                    setRoles(data.roles.map(r => {
                        const n = {}
                        Object.keys(r).forEach(k => n[k.toLowerCase().trim()] = r[k])
                        return {
                            ...n,
                            id: n.id || String(n.id),
                            image: n.image || n.icon || n.photo || n.imgurl || '', // Added n.imgurl
                            traits: n.traits ? String(n.traits).split('\n') : []
                        }
                    }))
                }
                if (data.characters) {
                    setCharacters(data.characters.map(c => {
                        const n = {}
                        Object.keys(c).forEach(k => n[k.toLowerCase().trim()] = c[k])
                        return {
                            ...n,
                            id: n.id || n.mid || '',
                            avatar: n.avatar || n.avatar_url || n.photo || n.image || '',
                            coverImage: n.coverimage || n.cover_url || n.background || '',
                            themes: n.themes ? String(n.themes).split(',').map(t => t.trim()) : [],
                            socials: {
                                youtube: n.youtube || '',
                                instagram: n.instagram || '',
                                facebook: n.facebook || '',
                                twitter: n.twitter || ''
                            }
                        }
                    }))
                }
                if (data.events) {
                    setEvents(data.events.map(e => {
                        const n = {}
                        Object.keys(e).forEach(k => n[k.toLowerCase().trim()] = e[k])
                        return n
                    }))
                }
                if (data.announcement) {
                    const ann = Array.isArray(data.announcement) ? data.announcement[0] : data.announcement;
                    const n = {}
                    if (ann) {
                        Object.keys(ann).forEach(k => n[k.toLowerCase().trim()] = ann[k])
                        setAnnouncement(prev => ({ ...prev, ...n, date: n.date ? String(n.date) : (prev.date || '') }));
                    }
                }

                setLoading(false)
            } catch (error) {
                console.warn("Failed to fetch from Cache:", error)
                setLoading(false)
            }
        }

        fetchData()
    }, [])



    // --- Global Sync Trigger (For Admin) ---
    const syncGlobalData = async (password) => {
        try {
            const response = await fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (!response.ok) {
                let errorMessage = 'Sync failed'
                const contentType = response.headers.get("content-type")
                if (contentType && contentType.includes("application/json")) {
                    const err = await response.json()
                    errorMessage = err.error || errorMessage
                } else if (response.status === 404) {
                    errorMessage = 'Sync API not found. If testing locally, use "vercel dev" instead of "npm run dev".'
                }
                throw new Error(errorMessage)
            }

            const contentType = response.headers.get("content-type")
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned an invalid response. Please check your live logs.")
            }

            return await response.json()
        } catch (error) {
            console.error("Global Sync Error:", error)
            throw error
        }
    }

    // --- Helper Methods with API Sync (SheetDB Source of Truth) ---

    const syncToApi = async (sheet, method, data, idValue = null, idColumn = 'id') => {
        if (!API_URL) return
        try {
            let url = `${API_URL}?sheet=${sheet}`
            if (idValue && (method === 'PUT' || method === 'DELETE')) {
                url = `${API_URL}/${idColumn}/${idValue}?sheet=${sheet}`
            }

            console.log(`Synced[${method}] to ${sheet}:`, data);

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method !== 'DELETE' ? JSON.stringify({ data: [data] }) : null
            })

            const resData = await res.json()

            if (!res.ok) {
                console.error(`SheetDB Error (${sheet}):`, resData)
                alert(`Sync Error: ${JSON.stringify(resData)}`)
            } else {
                // "Upsert" Logic: If PUT updated 0 rows, the row is missing. Try POSTing it to restore.
                if (method === 'PUT' && resData.updated === 0) {
                    console.warn(`Row missing in ${sheet}, attempting to restore via POST...`)
                    await syncToApi(sheet, 'POST', data)
                    alert(`Note: The item was missing from the Sheet, so it has been re-created.`)
                }
            }
        } catch (e) {
            console.error(`API Sync failed for ${sheet}:`, e)
            alert(`Network Error during Sync: ${e.message}`)
        }
    }

    // Quests
    const addQuest = (newQuest) => {
        const quest = { ...newQuest, id: `quest-${Date.now()}` }
        setQuests(prev => [...prev, quest])
        syncToApi('quests', 'POST', { ...quest, steps: quest.steps.join('\n') })
    }
    const updateQuest = (id, updated) => {
        setQuests(prev => prev.map(q => q.id === id ? { ...q, ...updated } : q))
        syncToApi('quests', 'PUT', { ...updated, steps: Array.isArray(updated.steps) ? updated.steps.join('\n') : updated.steps }, id, 'id')
    }
    const deleteQuest = (id) => {
        setQuests(prev => prev.filter(q => q.id !== id))
        syncToApi('quests', 'DELETE', null, id)
    }

    // Roles
    const addRole = (newRole) => {
        const role = { ...newRole, id: newRole.id || `role-${Date.now()}` }
        setRoles(prev => [...prev, role])
        // Sanitize Payload for SheetDB: Ensure only 'imgURL' is sent, remove duplicates.
        const { image, imgurl, ...rest } = role;
        syncToApi('roles', 'POST', { ...rest, traits: role.traits.join('\n'), imgURL: role.image })
    }
    const updateRole = (id, updated) => {
        setRoles(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r))
        // Sanitize Payload for SheetDB: Ensure only 'imgURL' is sent, remove duplicates.
        const { image, imgurl, ...rest } = updated;
        syncToApi('roles', 'PUT', { ...rest, traits: Array.isArray(updated.traits) ? updated.traits.join('\n') : updated.traits, imgURL: updated.image }, id, 'id')
    }
    const deleteRole = (id) => {
        setRoles(prev => prev.filter(r => r.id !== id))
        syncToApi('roles', 'DELETE', null, id)
    }

    // Members
    const addCharacter = (newChar) => {
        const member = { ...newChar, id: newChar.id || `mem-${Date.now()}`, joinedDate: new Date().toISOString().split('T')[0] }
        setCharacters(prev => [...prev, member])
        syncToApi('dreamers', 'POST', { ...member, themes: member.themes.join(',') })
    }
    const updateCharacter = (id, updated) => {
        setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c))
        syncToApi('dreamers', 'PUT', { ...updated, themes: Array.isArray(updated.themes) ? updated.themes.join(',') : updated.themes }, id, 'id')
    }
    const deleteCharacter = (id) => {
        setCharacters(prev => prev.filter(c => c.id !== id))
        syncToApi('dreamers', 'DELETE', null, id)
    }

    // Events
    const addEvent = (newEvent) => {
        const event = { ...newEvent, id: `ev-${Date.now()}` }
        setEvents(prev => [...prev, event])
        syncToApi('events', 'POST', event)
    }
    const updateEvent = (id, updated) => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e))
        syncToApi('events', 'PUT', updated, id, 'id')
    }
    const deleteEvent = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id))
        syncToApi('events', 'DELETE', null, id)
    }

    // Announcement
    const updateAnnouncement = async (newAnnouncement) => {
        const oldTitle = announcement.title
        setAnnouncement(newAnnouncement)

        try {
            // We use Delete-then-Post for the announcement to ensure that 
            // even if the Title changes, the record is updated correctly.
            // (SheetDB often can't update the column used as the identification key).
            await syncToApi('announcements', 'DELETE', null, oldTitle, 'title')
            await syncToApi('announcements', 'POST', newAnnouncement)
        } catch (e) {
            console.error("Announcement state sync failed:", e)
        }
    }

    // Join Form Submission
    const submitDreamerApplication = async (formData) => {
        // Map frontend fields to Sheet columns: name, email, phone, role, whydream, whyrole, age, gender
        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role, // This sends the ID. The user might want the Name, but ID is safer for linking.
            whydream: formData.reason,
            whyrole: formData.roleReason,
            age: formData.age,
            gender: formData.gender,
            submittedAt: new Date().toISOString()
        }
        await syncToApi('joindream', 'POST', payload)
    }

    return (
        <ContentContext.Provider value={{
            loading,
            quests, addQuest, updateQuest, deleteQuest,
            roles, addRole, updateRole, deleteRole,
            characters, addCharacter, updateCharacter, deleteCharacter,
            events, addEvent, updateEvent, deleteEvent,
            announcement, updateAnnouncement,
            syncGlobalData,
            submitDreamerApplication
        }}>
            {children}
        </ContentContext.Provider>
    )
}
