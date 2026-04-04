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
        
        // Polling for demo purposes, or use Echo in real app
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
        <header className="sticky top-0 z-20 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
            <div className="flex items-center justify-between h-full px-4 lg:px-8">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 lg:hidden" /> 
                    <h1 className="text-lg font-semibold text-white truncate max-w-[200px]">{title || 'Dashboard'}</h1>
                    
                    <div className="hidden md:block ml-8 flex-1 max-w-md">
                        <SearchBar />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                                <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-[10px] uppercase font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Mark all read</button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(n => (
                                            <div key={n.id} className={`p-4 border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors ${!n.read_at ? 'bg-emerald-500/5' : ''}`}>
                                                <p className="text-sm text-slate-300">{n.data.message || 'System update'}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[10px] text-slate-500">{n.created_at}</span>
                                                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                                        n.data.type === 'danger' ? 'bg-rose-500/10 text-rose-500' : 
                                                        n.data.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                        {n.data.type || 'info'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 text-sm italic">No notifications found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-px bg-slate-800/50 mx-2" />

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-white leading-none">{auth.user.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{auth.user.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
                            {auth.user.name.charAt(0)}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
