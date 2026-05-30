import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
    const [gradientTheme, setGradientTheme] = useState(() => {
        return localStorage.getItem('dw_gradient_theme') || 'nebula'
    })

    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('dw_theme_mode') || 'dark'
    })

    const themeGradients = {
        nebula: {
            dark: {
                '--color-background': '#06040d',
                '--color-card-bg': 'rgba(9, 6, 18, 0.85)',
                '--color-text': '#f0e6ff',
                '--color-text-sub': '#c3afda',
                '--color-text-muted': 'rgba(240, 230, 255, 0.45)',
                '--color-text-semi': 'rgba(240, 230, 255, 0.75)',
                '--color-primary': '#ffd778', // metallic gold
                '--color-accent': '#d46aae', // pink/violet
                '--glow-primary': 'rgba(255, 215, 120, 0.25)',
                '--glow-accent': 'rgba(212, 106, 174, 0.35)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #130a26 0%, #06040d 100%)'
            },
            light: {
                '--color-background': '#f4f0fc',
                '--color-card-bg': 'rgba(255, 255, 255, 0.88)',
                '--color-text': '#201538',
                '--color-text-sub': '#60527c',
                '--color-text-muted': 'rgba(32, 21, 56, 0.55)',
                '--color-text-semi': 'rgba(32, 21, 56, 0.8)',
                '--color-primary': '#aa8010',
                '--color-accent': '#b83a88',
                '--glow-primary': 'rgba(170, 128, 16, 0.15)',
                '--glow-accent': 'rgba(184, 58, 136, 0.15)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #eae2f8 0%, #f4f0fc 100%)'
            }
        },
        solar: {
            dark: {
                '--color-background': '#0c0602',
                '--color-card-bg': 'rgba(18, 9, 3, 0.85)',
                '--color-text': '#ffebd6',
                '--color-text-sub': '#e8b79b',
                '--color-text-muted': 'rgba(255, 235, 214, 0.45)',
                '--color-text-semi': 'rgba(255, 235, 214, 0.75)',
                '--color-primary': '#ffd778',
                '--color-accent': '#ff7c3b',
                '--glow-primary': 'rgba(255, 215, 120, 0.25)',
                '--glow-accent': 'rgba(255, 124, 59, 0.35)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #2f1303 0%, #0c0602 100%)'
            },
            light: {
                '--color-background': '#fdfbf7',
                '--color-card-bg': 'rgba(255, 255, 255, 0.88)',
                '--color-text': '#381d0c',
                '--color-text-sub': '#7c5942',
                '--color-text-muted': 'rgba(56, 29, 12, 0.55)',
                '--color-text-semi': 'rgba(56, 29, 12, 0.8)',
                '--color-primary': '#996d00',
                '--color-accent': '#c24b10',
                '--glow-primary': 'rgba(153, 109, 0, 0.15)',
                '--glow-accent': 'rgba(194, 75, 16, 0.15)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #faefe2 0%, #fdfbf7 100%)'
            }
        },
        ocean: {
            dark: {
                '--color-background': '#02060f',
                '--color-card-bg': 'rgba(3, 9, 22, 0.85)',
                '--color-text': '#e6f7ff',
                '--color-text-sub': '#9bcce6',
                '--color-text-muted': 'rgba(230, 247, 255, 0.45)',
                '--color-text-semi': 'rgba(230, 247, 255, 0.75)',
                '--color-primary': '#aefffc',
                '--color-accent': '#3a86c8',
                '--glow-primary': 'rgba(174, 255, 252, 0.25)',
                '--glow-accent': 'rgba(58, 134, 200, 0.35)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #051b37 0%, #02060f 100%)'
            },
            light: {
                '--color-background': '#f0f5fc',
                '--color-card-bg': 'rgba(255, 255, 255, 0.88)',
                '--color-text': '#0a1c38',
                '--color-text-sub': '#4a5f80',
                '--color-text-muted': 'rgba(10, 28, 56, 0.55)',
                '--color-text-semi': 'rgba(10, 28, 56, 0.8)',
                '--color-primary': '#157370',
                '--color-accent': '#1e5a94',
                '--glow-primary': 'rgba(21, 115, 112, 0.15)',
                '--glow-accent': 'rgba(30, 90, 148, 0.15)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #deebf7 0%, #f0f5fc 100%)'
            }
        },
        forest: {
            dark: {
                '--color-background': '#020804',
                '--color-card-bg': 'rgba(3, 18, 9, 0.85)',
                '--color-text': '#f4ffe6',
                '--color-text-sub': '#a3cca3',
                '--color-text-muted': 'rgba(244, 255, 230, 0.45)',
                '--color-text-semi': 'rgba(244, 255, 230, 0.75)',
                '--color-primary': '#e8ffd1',
                '--color-accent': '#2e8b57',
                '--glow-primary': 'rgba(232, 255, 209, 0.25)',
                '--glow-accent': 'rgba(46, 139, 87, 0.35)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #062611 0%, #020804 100%)'
            },
            light: {
                '--color-background': '#f2f6f3',
                '--color-card-bg': 'rgba(255, 255, 255, 0.88)',
                '--color-text': '#0b2914',
                '--color-text-sub': '#436b4e',
                '--color-text-muted': 'rgba(11, 41, 20, 0.55)',
                '--color-text-semi': 'rgba(11, 41, 20, 0.8)',
                '--color-primary': '#628c1d',
                '--color-accent': '#1b6338',
                '--glow-primary': 'rgba(98, 140, 29, 0.15)',
                '--glow-accent': 'rgba(27, 99, 56, 0.15)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #e2efe6 0%, #f2f6f3 100%)'
            }
        },
        void: {
            dark: {
                '--color-background': '#07020d',
                '--color-card-bg': 'rgba(11, 4, 20, 0.85)',
                '--color-text': '#fae6ff',
                '--color-text-sub': '#cca3ff',
                '--color-text-muted': 'rgba(250, 230, 255, 0.45)',
                '--color-text-semi': 'rgba(250, 230, 255, 0.75)',
                '--color-primary': '#ffd6ff',
                '--color-accent': '#9500ff',
                '--glow-primary': 'rgba(255, 214, 255, 0.25)',
                '--glow-accent': 'rgba(149, 0, 255, 0.35)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #1c0333 0%, #07020d 100%)'
            },
            light: {
                '--color-background': '#f6f1fc',
                '--color-card-bg': 'rgba(255, 255, 255, 0.88)',
                '--color-text': '#280a3c',
                '--color-text-sub': '#6d4a82',
                '--color-text-muted': 'rgba(40, 10, 60, 0.55)',
                '--color-text-semi': 'rgba(40, 10, 60, 0.8)',
                '--color-primary': '#b846cc',
                '--color-accent': '#6600cc',
                '--glow-primary': 'rgba(184, 70, 204, 0.15)',
                '--glow-accent': 'rgba(102, 0, 204, 0.15)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #efe2fc 0%, #f6f1fc 100%)'
            }
        },
        crimson: {
            dark: {
                '--color-background': '#0c0202',
                '--color-card-bg': 'rgba(16, 5, 5, 0.85)',
                '--color-text': '#ffd9d9',
                '--color-text-sub': '#daaaaa',
                '--color-text-muted': 'rgba(255, 217, 217, 0.45)',
                '--color-text-semi': 'rgba(255, 217, 217, 0.75)',
                '--color-primary': '#ffd778',
                '--color-accent': '#ff3b3b',
                '--glow-primary': 'rgba(255, 215, 120, 0.25)',
                '--glow-accent': 'rgba(255, 59, 59, 0.35)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #300606 0%, #0c0202 100%)'
            },
            light: {
                '--color-background': '#fcf3f3',
                '--color-card-bg': 'rgba(255, 255, 255, 0.88)',
                '--color-text': '#380c0c',
                '--color-text-sub': '#7c4a4a',
                '--color-text-muted': 'rgba(56, 12, 12, 0.55)',
                '--color-text-semi': 'rgba(56, 12, 12, 0.8)',
                '--color-primary': '#b58c10',
                '--color-accent': '#cc1f1f',
                '--glow-primary': 'rgba(181, 140, 16, 0.15)',
                '--glow-accent': 'rgba(204, 31, 31, 0.15)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #fae2e2 0%, #fcf3f3 100%)'
            }
        },
        silver: {
            dark: {
                '--color-background': '#08080a',
                '--color-card-bg': 'rgba(12, 12, 15, 0.85)',
                '--color-text': '#e1e1e6',
                '--color-text-sub': '#a3a3b0',
                '--color-text-muted': 'rgba(225, 225, 230, 0.45)',
                '--color-text-semi': 'rgba(225, 225, 230, 0.75)',
                '--color-primary': '#e2e8f0',
                '--color-accent': '#718096',
                '--glow-primary': 'rgba(226, 232, 240, 0.25)',
                '--glow-accent': 'rgba(113, 128, 150, 0.35)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #202026 0%, #08080a 100%)'
            },
            light: {
                '--color-background': '#f5f5f7',
                '--color-card-bg': 'rgba(255, 255, 255, 0.88)',
                '--color-text': '#1c1c1f',
                '--color-text-sub': '#5a5a66',
                '--color-text-muted': 'rgba(28, 28, 31, 0.55)',
                '--color-text-semi': 'rgba(28, 28, 31, 0.8)',
                '--color-primary': '#4a5568',
                '--color-accent': '#2d3748',
                '--glow-primary': 'rgba(74, 85, 104, 0.15)',
                '--glow-accent': 'rgba(45, 55, 72, 0.15)',
                '--gradient-body': 'radial-gradient(circle at 50% 50%, #e2e2e8 0%, #f5f5f7 100%)'
            }
        }
    }

    useEffect(() => {
        localStorage.setItem('dw_gradient_theme', gradientTheme)
        localStorage.setItem('dw_theme_mode', themeMode)
        
        const active = themeGradients[gradientTheme] || themeGradients.nebula
        const activeVariables = active[themeMode] || active.dark
        
        // Apply properties to documentElement
        Object.keys(activeVariables).forEach(key => {
            document.documentElement.style.setProperty(key, activeVariables[key])
        })

        // Add/remove classes to support standard HTML overrides
        if (themeMode === 'light') {
            document.documentElement.classList.add('light-mode')
            document.documentElement.classList.remove('dark-mode')
        } else {
            document.documentElement.classList.add('dark-mode')
            document.documentElement.classList.remove('light-mode')
        }
    }, [gradientTheme, themeMode])

    const resetTheme = () => {
        setGradientTheme('nebula')
        setThemeMode('dark')
    }

    return (
        <ThemeContext.Provider value={{ 
            gradientTheme, 
            setGradientTheme, 
            themeMode, 
            setThemeMode, 
            resetTheme, 
            themeGradients 
        }}>
            {children}
        </ThemeContext.Provider>
    )
}
