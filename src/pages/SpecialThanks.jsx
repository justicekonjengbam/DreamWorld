import { useContent } from '../context/ContentContext'
import Avatar from '../components/Avatar'
import './SpecialThanks.css'

function SpecialThanks() {
    const { sponsors } = useContent()

    // 1. Royal Tributes: Check for 'Royal' in themes from the Sponsors list
    const royalTributes = sponsors.filter(s =>
        (s.themes && s.themes.includes('Royal')) ||
        (s.name.toLowerCase().includes('peter saam'))
    )

    // 2. Standard Sponsors: All other sponsors
    const standardSponsors = sponsors.filter(s => !royalTributes.some(r => r.id === s.id))

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
                                    <span className="royal-title">{royal.title || 'Patron'}</span>
                                    <p className="royal-bio">
                                        {royal.bio || "A beacon of hope and support."}
                                    </p>
                                    <div className="royal-quote">
                                        "Standing with DreamWorld since the beginning."
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-sub)' }}>
                        <p>No Royal Tributes yet.</p>
                    </div>
                )}
            </div>

            {/* --- Pillars of Support --- */}
            {standardSponsors.length > 0 && (
                <div className="sponsors-section animate-fade">
                    <div className="section-title-divider">
                        <div className="divider-line"></div>
                        <span>Pillars of DreamWorld</span>
                        <div className="divider-line"></div>
                    </div>

                    <div className="sponsors-grid">
                        {standardSponsors.map(sponsor => (
                            <div key={sponsor.id} className="sponsor-card">
                                <Avatar
                                    src={sponsor.avatar}
                                    name={sponsor.name}
                                    className="sponsor-avatar"
                                />
                                <h4 className="sponsor-name">{sponsor.name}</h4>
                                <div className="sponsor-role">{sponsor.title || 'Sponsor'}</div>
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
