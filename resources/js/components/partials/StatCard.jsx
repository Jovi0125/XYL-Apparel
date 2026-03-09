import React from 'react';

export default function StatCard({ title, value }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    );
}
