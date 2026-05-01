import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePortal } from '../context/PortalContext'

export default function PortalLogin() {
    const [passcode, setPasscode] = useState('')
    const [error, setError] = useState('')
    const { login, user, loading } = usePortal()
    const navigate = useNavigate()

    useEffect(() => {
        if (user && !loading) {
            navigate('/portal/dashboard')
        }
    }, [user, loading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!passcode.trim()) return

        const result = await login(passcode.trim())
        if (result.success) {
            navigate('/portal/dashboard')
        } else {
            setError(result.error)
        }
    }

    if (loading) return <div className="portal-login">Loading Portal...</div>

    return (
        <div className="portal-login">
            <div className="portal-login-card">
                <img src="/DreamWorldAcademy.png" alt="DreamWorld" className="portal-logo" />
                <h1>DreamWorld Portal</h1>
                <p>Enter your unique passcode to enter.</p>
                
                <form onSubmit={handleSubmit}>
                    {error && <div className="portal-error">{error}</div>}
                    <input 
                        type="password" 
                        className="portal-input"
                        placeholder="PASSCODE" 
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        required
                    />
                    <button type="submit" className="portal-btn">ENTER PORTAL</button>
                </form>
            </div>
        </div>
    )
}
