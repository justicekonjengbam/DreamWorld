import { Outlet } from 'react'
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
