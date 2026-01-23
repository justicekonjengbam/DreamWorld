import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import './AdminLogin.css'

function AdminLogin() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'dreamworld2026'

        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('dw_admin_token', 'logged_in_' + Date.now())
            sessionStorage.setItem('dw_admin_pass', password) // Store for sync calls
            navigate('/admin/dashboard')
        } else {
            setError('Invalid password. Please try again.')
        }
    }

    return (
        <div className="admin-login page">
            <div className="container">
                <div className="login-hero">
                    <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" />
                </div>

                <div className="login-container">
                    <Card className="login-card">
                        <h2>Admin Portal</h2>
                        <p className="login-subtitle">Please enter your password to continue</p>

                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    autoFocus
                                />
                            </div>

                            {error && <p className="login-error">{error}</p>}

                            <Button type="submit" variant="primary">Login</Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
