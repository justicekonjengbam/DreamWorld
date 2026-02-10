import { useContent } from '../context/ContentContext'
import Avatar from '../components/Avatar'
import './SpecialThanks.css'

function SpecialThanks() {
    const { characters } = useContent()

    // 1. Royal Tributes: Check for 'Royal' in themes
    // We also explicitly look for Peter Saam if he exists, to ensure he is top of the list if there are multiple.
    const royalTributes = characters.filter(c =>
        (c.themes && c.themes.includes('Royal')) ||
        (c.name.toLowerCase().includes('peter saam')) // Fallback to ensure Peter is always Royal if not tagged
    )

    // 2. Pillars/Sponsors: standard sponsors (Role = Patron/Sponsor) but NOT in the royal list
    const sponsors = characters.filter(c => {
        const isRoyal = royalTributes.some(r => r.id === c.id)
        const isSponsorRole = ['sponsor', 'patron', 'funder', 'donor'].includes(c.role.toLowerCase())
        return isSponsorRole && !isRoyal
    })

    return (
        <div className="special-thanks">
            <div className="thanks-hero animate-fade">
                <h1>Wall of Gratitude</h1>
                <p>Honoring the visionaries who fuel the dream.</p>
            </div>

            {/* --- Royal Tributes --- */}
            <div className="royal-section animate-slide-up">
                {royalTributes.length > 0 ? (
                    royalTributes.map(royal => (
                        <div key={royal.id} className="royal-card">
                            <div className="royal-header">
                                <span className="crown-icon">👑</span>
                                <h2>Royal Guardian</h2>
                            </div>
                            <div className="royal-content">
                                <div className="royal-image-frame">
                                    <Avatar
                                        src={royal.avatar}
                                        name={royal.name}
                                        style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                    />
                                </div>
                                <div className="royal-info">
                                    <h3>{royal.name}</h3>
                                    <span className="royal-title">{royal.title || 'Director of Agriculture, Manipur'}</span>
                                    <p className="royal-bio">
                                        {royal.bio || "A beacon of hope and support. Generously empowering the next generation of dreamers through education and technology."}
                                    </p>
                                    <div className="royal-quote">
                                        "Standing with DreamWorld since the beginning."
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                        <p>No Royal Tributes found. Add a Dreamer with the "Royal" theme in Admin Panel.</p>
                    </div>
                )}
            </div>

            {/* --- Pillars of Support --- */}
            {sponsors.length > 0 && (
                <div className="sponsors-section animate-fade">
                    <div className="section-title-divider">
                        <div className="divider-line"></div>
                        <span>Pillars of DreamWorld</span>
                        <div className="divider-line"></div>
                    </div>

                    <div className="sponsors-grid">
                        {sponsors.map(sponsor => (
                            <div key={sponsor.id} className="sponsor-card">
                                <Avatar
                                    src={sponsor.avatar}
                                    name={sponsor.name}
                                    className="sponsor-avatar"
                                />
                                <h4 className="sponsor-name">{sponsor.name}</h4>
                                <div className="sponsor-role">{sponsor.title || 'Patron'}</div>
                                <p className="sponsor-bio">{sponsor.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SpecialThanks
