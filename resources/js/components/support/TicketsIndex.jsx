import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SupportLayout from '../layouts/SupportLayout';
import supportService from '../../services/supportService';

const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
};

export default function TicketsIndex() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        supportService.ticketList(params)
            .then(res => setTickets(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [statusFilter]);

    return (
        <SupportLayout title="Support Tickets">
            <div className="mb-4 flex gap-2">
                {['', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            statusFilter === s ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {s ? s.replace('_', ' ') : 'All'}
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">#</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Subject</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Customer</th>
                            <th className="text-center px-6 py-3 text-gray-600 font-medium">Priority</th>
                            <th className="text-center px-6 py-3 text-gray-600 font-medium">Status</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Assigned</th>
                            <th className="text-right px-6 py-3 text-gray-600 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
                        ) : tickets.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">No tickets found.</td></tr>
                        ) : tickets.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-mono text-gray-400">#{t.id}</td>
                                <td className="px-6 py-3 font-medium text-gray-800">{t.subject}</td>
                                <td className="px-6 py-3 text-gray-600">{t.user?.name || '—'}</td>
                                <td className="px-6 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        t.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                                        t.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                        t.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                        'bg-gray-100 text-gray-500'
                                    }`}>{t.status}</span>
                                </td>
                                <td className="px-6 py-3 text-gray-600">{t.assignee?.name || 'Unassigned'}</td>
                                <td className="px-6 py-3 text-right">
                                    <Link to={`/support/tickets/${t.id}`} className="text-purple-600 hover:underline text-sm">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SupportLayout>
    );
}
