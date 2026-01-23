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
    const [quests, setQuests] = useState(() => {
        const saved = localStorage.getItem('dreamworld_quests')
        return saved ? JSON.parse(saved) : initialQuests
    })
    const [roles, setRoles] = useState(() => {
        const saved = localStorage.getItem('dreamworld_roles')
        return saved ? JSON.parse(saved) : initialRoles
    })
    const [characters, setCharacters] = useState(() => {
        const saved = localStorage.getItem('dreamworld_characters')
        return saved ? JSON.parse(saved) : initialCharacters
    })
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('dreamworld_events')
        return saved ? JSON.parse(saved) : initialEvents
    })
    const [announcement, setAnnouncement] = useState(() => {
        const saved = localStorage.getItem('dreamworld_announcement')
        return saved ? JSON.parse(saved) : {
            title: 'Welcome to DreamWorld! 🌟',
            date: 'January 18, 2026',
            content: "We're thrilled to launch DreamWorld—a space for learning, creating, and growing together.",
            linkText: "View This Week's Quests",
            linkTo: '/quests'
        }
    })

    // --- API Sync (Fetch) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try to fetch from our Vercel KV cache bridge
                const response = await fetch('/api/data')

                if (!response.ok) {
                    throw new Error('Cache fetch failed')
                }

                const data = await response.json()

                if (data.quests) {
                    setQuests(data.quests.map(q => ({ ...q, steps: q.steps ? q.steps.split('\n') : [] })))
                }
                if (data.roles) {
                    setRoles(data.roles.map(r => ({ ...r, traits: r.traits ? r.traits.split('\n') : [] })))
                }
                if (data.characters) {
                    setCharacters(data.characters.map(c => ({ ...c, themes: c.themes ? c.themes.split(',').map(t => t.trim()) : [] })))
                }
                if (data.events) {
                    setEvents(data.events)
                }
                if (data.announcement) {
                    setAnnouncement(data.announcement)
                }

                setLoading(false)
            } catch (error) {
                console.warn("Failed to fetch from Cache, falling back to Local Storage/Defaults:", error)
                // If cache fails, we already have initial states from LocalStorage or Defaults
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Local Storage backups (Always keep as fallback)
    useEffect(() => { localStorage.setItem('dreamworld_quests', JSON.stringify(quests)) }, [quests])
    useEffect(() => { localStorage.setItem('dreamworld_roles', JSON.stringify(roles)) }, [roles])
    useEffect(() => { localStorage.setItem('dreamworld_characters', JSON.stringify(characters)) }, [characters])
    useEffect(() => { localStorage.setItem('dreamworld_events', JSON.stringify(events)) }, [events])
    useEffect(() => { localStorage.setItem('dreamworld_announcement', JSON.stringify(announcement)) }, [announcement])

    // --- Global Sync Trigger (For Admin) ---
    const syncGlobalData = async (password) => {
        try {
            const response = await fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || 'Sync failed')
            }

            return await response.json()
        } catch (error) {
            console.error("Global Sync Error:", error)
            throw error
        }
    }

    // --- Helper Methods with API Sync (SheetDB Source of Truth) ---

    const syncToApi = async (sheet, method, data, id = null) => {
        if (!API_URL) return
        try {
            let url = `${API_URL}?sheet=${sheet}`
            if (id && (method === 'PUT' || method === 'DELETE')) {
                url = `${API_URL}/id/${id}?sheet=${sheet}`
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method !== 'DELETE' ? JSON.stringify({ data: [data] }) : null
            })
            if (!res.ok) {
                const err = await res.json()
                console.error(`SheetDB Error (${sheet}):`, err)
            }
        } catch (e) {
            console.error(`API Sync failed for ${sheet}:`, e)
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
        syncToApi('quests', 'PUT', { ...updated, steps: Array.isArray(updated.steps) ? updated.steps.join('\n') : updated.steps }, id)
    }
    const deleteQuest = (id) => {
        setQuests(prev => prev.filter(q => q.id !== id))
        syncToApi('quests', 'DELETE', null, id)
    }

    // Roles
    const addRole = (newRole) => {
        const role = { ...newRole, id: newRole.id || `role-${Date.now()}` }
        setRoles(prev => [...prev, role])
        syncToApi('roles', 'POST', { ...role, traits: role.traits.join('\n') })
    }
    const updateRole = (id, updated) => {
        setRoles(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r))
        syncToApi('roles', 'PUT', { ...updated, traits: Array.isArray(updated.traits) ? updated.traits.join('\n') : updated.traits }, id)
    }
    const deleteRole = (id) => {
        setRoles(prev => prev.filter(r => r.id !== id))
        syncToApi('roles', 'DELETE', null, id)
    }

    // Members
    const addCharacter = (newChar) => {
        const member = { ...newChar, id: newChar.id || `mem-${Date.now()}`, joinedDate: new Date().toISOString().split('T')[0] }
        setCharacters(prev => [...prev, member])
        syncToApi('members', 'POST', { ...member, themes: member.themes.join(',') })
    }
    const updateCharacter = (id, updated) => {
        setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c))
        syncToApi('members', 'PUT', { ...updated, themes: Array.isArray(updated.themes) ? updated.themes.join(',') : updated.themes }, id)
    }
    const deleteCharacter = (id) => {
        setCharacters(prev => prev.filter(c => c.id !== id))
        syncToApi('members', 'DELETE', null, id)
    }

    // Events
    const addEvent = (newEvent) => {
        const event = { ...newEvent, id: `ev-${Date.now()}` }
        setEvents(prev => [...prev, event])
        syncToApi('events', 'POST', event)
    }
    const updateEvent = (id, updated) => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e))
        syncToApi('events', 'PUT', updated, id)
    }
    const deleteEvent = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id))
        syncToApi('events', 'DELETE', null, id)
    }

    // Announcement
    const updateAnnouncement = (newAnnouncement) => {
        // We always use the title as the unique key for the announcement row.
        // If the user changes the title, we first try to update the "current" title row.
        // For simplicity in this demo, we assume the first row is always the one.
        const oldTitle = announcement.title
        setAnnouncement(newAnnouncement)

        // SheetDB PUT to the row matching the PREVIOUS title to update it with NEW data
        syncToApi('announcements', 'PUT', newAnnouncement, oldTitle)
    }

    return (
        <ContentContext.Provider value={{
            loading,
            quests, addQuest, updateQuest, deleteQuest,
            roles, addRole, updateRole, deleteRole,
            characters, addCharacter, updateCharacter, deleteCharacter,
            events, addEvent, updateEvent, deleteEvent,
            announcement, updateAnnouncement,
            syncGlobalData
        }}>
            {children}
        </ContentContext.Provider>
    )
}
