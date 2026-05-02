import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const PortalContext = createContext()

export const usePortal = () => useContext(PortalContext)

export const PortalProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for existing session
        const storedId = localStorage.getItem('dw_portal_user_id')
        const storedType = localStorage.getItem('dw_portal_user_type')

        if (storedId && storedType) {
            fetchUser(storedId, storedType)
        } else {
            setLoading(false)
        }
    }, [])

    // Apply theme whenever user changes
    useEffect(() => {
        // Theme color is applied as accent in PortalDashboard via inline styles.
        // We do NOT touch global CSS here to avoid breaking the main website.
    }, [user])

    const fetchUser = async (id, type) => {
        try {
            const table = type === 'dreamer' ? 'dreamers' : 'academy_students'
            const { data, error } = await supabase.from(table).select('*').eq('id', id).single()

            if (error) throw error

            if (data) {
                setUser({ ...data, type })
            }
        } catch (error) {
            console.error('Failed to fetch portal user:', error)
            localStorage.removeItem('dw_portal_user_id')
            localStorage.removeItem('dw_portal_user_type')
        } finally {
            setLoading(false)
        }
    }

    const login = async (passcode) => {
        setLoading(true)
        try {
            // Check dreamers first
            const { data: dreamers, error: dError } = await supabase.from('dreamers').select('*').eq('passcode', passcode)
            if (dError) throw dError

            if (dreamers && dreamers.length > 0) {
                const dreamer = dreamers[0]
                // If it's the Creator, maybe we flag it (e.g. if their role is Admin or Architect)
                // We will add an isCreator flag if their id matches the Creator's
                const isCreator = dreamer.name.toLowerCase().includes('justice') || dreamer.name.toLowerCase().includes('creator')
                
                setUser({ ...dreamer, type: 'dreamer', isCreator })
                localStorage.setItem('dw_portal_user_id', dreamer.id)
                localStorage.setItem('dw_portal_user_type', 'dreamer')
                setLoading(false)
                return { success: true, isCreator }
            }

            // Check academy students
            const { data: students, error: sError } = await supabase.from('academy_students').select('*').eq('passcode', passcode)
            if (sError) throw sError

            if (students && students.length > 0) {
                const student = students[0]
                setUser({ ...student, type: 'student' })
                localStorage.setItem('dw_portal_user_id', student.id)
                localStorage.setItem('dw_portal_user_type', 'student')
                setLoading(false)
                return { success: true }
            }

            setLoading(false)
            return { success: false, error: 'Invalid passcode' }
        } catch (error) {
            console.error('Login error:', error)
            setLoading(false)
            return { success: false, error: 'Failed to connect to DreamWorld database' }
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('dw_portal_user_id')
        localStorage.removeItem('dw_portal_user_type')
    }

    return (
        <PortalContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </PortalContext.Provider>
    )
}
