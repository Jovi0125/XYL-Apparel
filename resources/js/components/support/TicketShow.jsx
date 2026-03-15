import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SupportLayout from '../layouts/SupportLayout';
import supportService from '../../services/supportService';

export default function TicketShow() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        supportService.ticketShow(id)
            .then(res => setTicket(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        setSending(true);
        try {
            const res = await supportService.sendMessage(id, { body: reply });
            setTicket(prev => ({
                ...prev,
                messages: [...(prev.messages || []), res.data.support_message],
            }));
            setReply('');
        } catch (err) {
            console.error(err);
        }
        setSending(false);
    };

    if (loading) return <SupportLayout title="Ticket Details"><p className="text-gray-400">Loading...</p></SupportLayout>;
    if (!ticket) return <SupportLayout title="Ticket Details"><p className="text-red-500">Ticket not found.</p></SupportLayout>;

    return (
        <SupportLayout title={`Ticket #${ticket.id}: ${ticket.subject}`}>
            {/* Ticket Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{ticket.user?.name}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className="font-medium">{ticket.status}</span></div>
                    <div><span className="text-gray-500">Priority:</span> <span className="font-medium">{ticket.priority}</span></div>
                    <div><span className="text-gray-500">Order:</span> <span className="font-medium">{ticket.order_id ? `#${ticket.order_id}` : 'N/A'}</span></div>
                </div>
            </div>

            {/* Messages Thread */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Conversation</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(ticket.messages || []).map(msg => (
                        <div key={msg.id} className={`flex ${msg.is_staff_reply ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md px-4 py-3 rounded-2xl text-sm ${
                                msg.is_staff_reply
                                    ? 'bg-purple-600 text-white rounded-br-md'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                            }`}>
                                <p className="font-medium text-xs mb-1 opacity-75">{msg.user?.name}</p>
                                <p>{msg.body}</p>
                                <p className="text-xs mt-1 opacity-60">{new Date(msg.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleReply} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none"
                    rows="3"
                    required
                />
                <div className="flex justify-end mt-3">
                    <button type="submit" disabled={sending}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50">
                        {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                </div>
            </form>
        </SupportLayout>
    );
}
