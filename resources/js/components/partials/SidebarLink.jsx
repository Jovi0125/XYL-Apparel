import React from "react";
import { Link } from "react-router-dom";

export default function SidebarLink({ href, active = false, children }) {
    return (
        <Link
            to={href}
            className={`sidebar-link ${active ? "active" : ""}`}
        >
            {children}
        </Link>
    );
}
