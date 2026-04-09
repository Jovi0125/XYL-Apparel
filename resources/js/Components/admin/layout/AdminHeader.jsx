import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import SearchBar from '../shared/SearchBar';

export default function AdminHeader({ title }) {
    const { auth } = usePage().props;
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await axios.get('/admin/notifications');
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            } catch (e) {
                console.error("Failed to fetch notifications");
            }
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAllRead = async () => {
        try {
            await axios.post('/admin/notifications/mark-read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
        } catch (e) {
            console.error("Failed to mark notifications as read");
        }
    };

    return (
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-100 shadow-sm">
            <div className="flex items-center justify-between h-full px-6 lg:px-8">
                {/* Left Side: Title */}
                <div className="flex items-center gap-4">
                    <div className="w-10 lg:hidden" /> 
                    <h1 className="text-lg font-black text-black tracking-tight uppercase">{title || 'Dashboard'}</h1>
                </div>

                {/* Right Side: Search + Notifications */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block w-72">
                        <SearchBar />
                    </div>

                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#E60012] rounded-full ring-2 ring-white" />
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-black">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-[10px] uppercase font-bold text-[#E60012] hover:text-red-600 transition-colors">Mark all read</button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(n => (
                                            <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.read_at ? 'bg-red-50/30' : ''}`}>
                                                <p className="text-sm text-gray-700">{n.data.message || 'System update'}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[10px] text-gray-400">{n.created_at}</span>
                                                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                                        n.data.type === 'danger' ? 'bg-red-100 text-red-600' : 
                                                        n.data.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-600'
                                                    }`}>
                                                        {n.data.type || 'info'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-400 text-sm">No notifications found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
