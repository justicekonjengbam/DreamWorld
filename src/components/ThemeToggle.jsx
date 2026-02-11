import { useTheme } from '../context/ThemeContext'
import './ThemeToggle.css'

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            className={`theme-toggle ${theme}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'day' ? 'night' : 'day'} mode`}
            title={`Switch to ${theme === 'day' ? 'night' : 'day'} mode`}
        >
            <div className="toggle-track">
                <div className="toggle-thumb">
                    {theme === 'day' ? (
                        <span className="icon sun">☀️</span>
                    ) : (
                        <span className="icon moon">🌙</span>
                    )}
                </div>
            </div>
        </button>
    )
}

export default ThemeToggle
