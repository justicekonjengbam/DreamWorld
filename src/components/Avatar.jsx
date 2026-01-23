import { useState, useEffect } from 'react'

function Avatar({ src, name, className, style, onClick }) {
    const [status, setStatus] = useState('loading') // 'loading', 'error', 'success'
    const initial = name ? name.charAt(0).toUpperCase() : '?'

    return (
        <div
            className={`resilient-avatar ${className}`}
            onClick={onClick}
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor: '#0a1118', // Consistent dark base
                border: '1px solid rgba(76, 161, 175, 0.2)',
                ...style
            }}
        >
            {/* The Initial Fallback (Visible immediately) */}
            <span style={{
                fontSize: '2.5em', // Responsive to parent height
                color: 'var(--color-gold)',
                fontWeight: '800',
                opacity: status === 'success' ? 0 : 1,
                transition: 'opacity 0.3s ease',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
                userSelect: 'none'
            }}>
                {initial}
            </span>

            {/* The Actual Image */}
            {src && (
                <img
                    src={src}
                    alt={name}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: status === 'success' ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                        pointerEvents: 'none' // Don't block clicks to parent
                    }}
                    onLoad={() => setStatus('success')}
                    onError={() => {
                        console.warn(`[Avatar] Failed to load: ${src}`)
                        setStatus('error')
                    }}
                />
            )}
        </div>
    )
}

export default Avatar
