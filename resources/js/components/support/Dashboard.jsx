import React, { useState, useEffect } from 'react';
import SupportLayout from '../layouts/SupportLayout';
import supportService from '../../services/supportService';

export default function SupportDashboard() {
    const [stats, setStats] = useState(null);
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supportService.dashboard()
            .then(res => {
                setStats(res.data.stats);
                setRecentTickets(res.data.recent_tickets || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cards = stats ? [
        { label: 'Open', value: stats.open, color: 'bg-yellow-500' },
        { label: 'In Progress', value: stats.in_progress, color: 'bg-blue-500' },
        { label: 'Resolved', value: stats.resolved, color: 'bg-green-500' },
        { label: 'My Assigned', value: stats.my_assigned, color: 'bg-purple-500' },
    ] : [];

    return (
        <SupportLayout title="Support Dashboard">
            {loading ? <p className="text-gray-400">Loading...</p> : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {cards.map(card => (
                            <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white text-lg mb-3`}>🎫</div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-semibold text-gray-800 mb-4">Recent Tickets</h2>
                        <div className="space-y-3">
                            {recentTickets.map(t => (
                                <div key={t.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{t.subject}</p>
                                        <p className="text-xs text-gray-500">{t.user?.name} • {t.priority}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        t.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                                        t.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>{t.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </SupportLayout>
    );
}
