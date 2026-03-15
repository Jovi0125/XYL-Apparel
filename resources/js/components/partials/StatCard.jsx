import React from "react";

export default function StatCard({ title, value }) {
    return (
        <div className="stat-card">
            <p className="stat-card-title">{title}</p>
            <p className="stat-card-value">{value}</p>
        </div>
    );
}
