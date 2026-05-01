import { Outlet } from 'react-router-dom'
import { PortalProvider } from '../context/PortalContext'
import './Portal.css'

export default function PortalLayout() {
    return (
        <PortalProvider>
            <div className="portal-container">
                <Outlet />
            </div>
        </PortalProvider>
    )
}
