import React from "react";

export default function DashboardLayout({ sidebar, pageTitle, children }) {
    const [mobileMenu, setMobileMenu] = React.useState(false);

    return (
        <div className="dashboard-wrapper">
            {/* Mobile Header */}
            <div className="mobile-header">
                <span className="brand-logo">XYLO</span>
                <button onClick={() => setMobileMenu(!mobileMenu)} className="menu-toggle">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`sidebar-wrapper ${mobileMenu ? "is-open" : ""}`}>
                <div className="sidebar-header">
                    <a href="/" className="brand-logo">
                        <span className="brand-name">XYLO</span>
                        <span className="brand-tagline">Apparel</span>
                    </a>
                </div>
                <nav className="sidebar-nav">
                    {sidebar}
                </nav>
            </aside>

            {/* Overlay */}
            {mobileMenu && (
                <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />
            )}

            {/* Main Content */}
            <main className="main-content">
                <div className="content-container">
                    {pageTitle && (
                        <h1 className="page-title">{pageTitle}</h1>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
