import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import SidebarLink from '../../partials/SidebarLink';

export default function LogisticsSidebar() {
    const location = useLocation();
    const is = (pattern) => location.pathname.startsWith(pattern);

    return (
        <Sidebar role="Logistics" bottomItems={
            <SidebarLink href="/logistics/profile/edit" active={is('/logistics/profile')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
            </SidebarLink>
        }>
            <SidebarLink href="/logistics/dashboard" active={location.pathname === '/logistics/dashboard'}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
            </SidebarLink>
            <SidebarLink href="/logistics/shipments" active={is('/logistics/shipments')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Shipments
            </SidebarLink>
        </Sidebar>
    );
}
