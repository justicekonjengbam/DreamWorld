import { useAudio } from '../context/AudioContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/Card'
import Button from '../components/Button'
import './Settings.css'

function Settings() {
    const { 
        isSoundMuted, setIsSoundMuted, 
        musicVolume, setMusicVolume, 
        buttonVolume, setButtonVolume 
    } = useAudio()

    const { 
        gradientTheme, setGradientTheme, 
        themeMode, setThemeMode, 
        resetTheme, themeGradients 
    } = useTheme()

    const handleMusicVolumeChange = (e) => {
        const val = parseFloat(e.target.value)
        setMusicVolume(val)
        if (val > 0 && isSoundMuted) {
            setIsSoundMuted(false) // Unmute automatically when raising volume
        }
    }

    const handleButtonVolumeChange = (e) => {
        setButtonVolume(parseFloat(e.target.value))
    }

    const resetMusicVolume = () => setMusicVolume(0.5)
    const resetButtonVolume = () => setButtonVolume(0.7)

    const gradientDisplayNames = {
        nebula: 'Celestial Nebula',
        solar: 'Solar Flare',
        ocean: 'Deep Ocean',
        forest: 'Emerald Forest',
        void: 'Void Rift',
        crimson: 'Crimson Eclipse',
        silver: 'Lunar Dust'
    }

    return (
        <div className="page settings-page container">
            <div className="page-hero">
                <h1 className="page-title">Settings</h1>
                <div className="fantasy-separator"></div>
            </div>

            <div className="settings-grid">
                <Card className="settings-card gold-theme">
                    <h2 className="settings-section-title">🔮 Audio Configuration</h2>
                    <div className="settings-divider"></div>

                    {/* Mute Control */}
                    <div className="settings-option-row">
                        <div className="settings-option-info">
                            <span className="settings-label">Master Sound Mute</span>
                            <p className="settings-description">Enable or disable all background melodies and click sounds.</p>
                        </div>
                        <div className="settings-control-box">
                            <Button 
                                variant={isSoundMuted ? 'primary' : 'ghost'} 
                                onClick={() => setIsSoundMuted(!isSoundMuted)}
                            >
                                {isSoundMuted ? '🔇 Muted' : '🔊 Active'}
                            </Button>
                        </div>
                    </div>

                    {/* Music Volume Slider */}
                    <div className="settings-option-row">
                        <div className="settings-option-info">
                            <span className="settings-label">Melodic Background Volume</span>
                            <p className="settings-description">Adjust the loudness of the ambient fantasy soundtrack.</p>
                        </div>
                        <div className="settings-control-box vertical-control">
                            <div className="slider-wrapper">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.05" 
                                    value={musicVolume} 
                                    onChange={handleMusicVolumeChange}
                                    className="fantasy-slider"
                                    style={{ '--slider-fill': `${musicVolume * 100}%` }}
                                
                                />
                                <span className="slider-value">{Math.round(musicVolume * 100)}%</span>
                            </div>
                            <Button variant="ghost" onClick={resetMusicVolume}>Reset</Button>
                        </div>
                    </div>

                    {/* Button Sound Volume Slider */}
                    <div className="settings-option-row">
                        <div className="settings-option-info">
                            <span className="settings-label">Interface Click Volume</span>
                            <p className="settings-description">Adjust the audio feedback volume of buttons, links, and cards.</p>
                        </div>
                        <div className="settings-control-box vertical-control">
                            <div className="slider-wrapper">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.05" 
                                    value={buttonVolume} 
                                    onChange={handleButtonVolumeChange}
                                    className="fantasy-slider"
                                    style={{ '--slider-fill': `${buttonVolume * 100}%` }}
                                
                                />
                                <span className="slider-value">{Math.round(buttonVolume * 100)}%</span>
                            </div>
                            <Button variant="ghost" onClick={resetButtonVolume}>Reset</Button>
                        </div>
                    </div>
                </Card>

                <Card className="settings-card gold-theme">
                    <h2 className="settings-section-title">🎨 Celestial Visuals</h2>
                    <div className="settings-divider"></div>

                    {/* Light/Dark Toggle Row */}
                    <div className="settings-option-row" style={{ borderBottom: '1px solid rgba(255, 215, 120, 0.08)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <div className="settings-option-info">
                            <span className="settings-label">Celestial Alignment Mode</span>
                            <p className="settings-description">Toggle between Midnight Dark and Alabaster Light theme settings.</p>
                        </div>
                        <div className="settings-control-box">
                            <Button 
                                variant={themeMode === 'light' ? 'primary' : 'ghost'} 
                                onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                            >
                                {themeMode === 'light' ? '☀️ Alabaster Light' : '🌙 Midnight Dark'}
                            </Button>
                        </div>
                    </div>

                    <p className="settings-description-full">
                        Repaint the visual energy of DreamWorld. Select a celestial alignment to dynamically transform the buttons, scrollbars, cards, and nebula backgrounds globally.
                    </p>

                    <div className="gradient-theme-picker">
                        {Object.keys(themeGradients).map((themeName) => {
                            const gradSet = themeGradients[themeName]
                            const grad = gradSet[themeMode] || gradSet.dark
                            return (
                                <button 
                                    key={themeName}
                                    onClick={() => setGradientTheme(themeName)}
                                    className={`gradient-theme-button ${gradientTheme === themeName ? 'active' : ''}`}
                                    style={{ 
                                        '--grad-bg': grad['--gradient-body'],
                                        '--grad-accent': grad['--color-accent'],
                                        '--grad-primary': grad['--color-primary']
                                    }}
                                    title={gradientDisplayNames[themeName]}
                                >
                                    <div className="gradient-theme-preview" />
                                    <span className="gradient-theme-label">{gradientDisplayNames[themeName]}</span>
                                    {gradientTheme === themeName && <span className="active-marker">✦</span>}
                                </button>
                            )
                        })}
                    </div>

                    <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={resetTheme}>Reset Visuals to Default</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Settings
