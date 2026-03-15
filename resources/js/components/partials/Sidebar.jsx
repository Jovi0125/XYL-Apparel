import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ role, children, bottomItems }) {
    const navigate = useNavigate();

    const handleSignOut = () => {
        axios.post("/logout").then(() => {
            window.location.href = "/login";
        }).catch(() => {
            window.location.href = "/login";
        });
    };

    return (
        <div className="sidebar-content">
            <div className="sidebar-section">
                <span className="sidebar-role-label">{role}</span>
                <div className="sidebar-menu">
                    {children}
                </div>
            </div>
            <div className="sidebar-footer">
                {bottomItems && <div className="sidebar-menu">{bottomItems}</div>}
                <button
                    onClick={handleSignOut}
                    className="sidebar-link"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
