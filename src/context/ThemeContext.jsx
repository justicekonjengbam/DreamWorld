import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
    // Check localStorage or system preference, default to 'day' (light)
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('dw_theme')
        if (saved) return saved
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
    })

    useEffect(() => {
        localStorage.setItem('dw_theme', theme)
        // Update body class for global styles if needed, though we'll primarily use a wrapper in App
        document.body.className = theme
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'day' ? 'night' : 'day')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
