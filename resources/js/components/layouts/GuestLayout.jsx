import React from "react";

export default function GuestLayout({ title, children }) {
    return (
        <div className="auth-layout-wrapper">
            <div className="auth-layout-container">
                <div className="auth-logo-wrapper">
                    <a href="/" className="auth-logo">
                        <span className="brand-name">XYLO</span>
                        <span className="brand-tagline">Apparel</span>
                    </a>
                </div>
                <div className="auth-card">
                    {title && <h2 className="auth-title">{title}</h2>}
                    {children}
                </div>
            </div>
        </div>
    );
}
