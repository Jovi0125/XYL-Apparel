import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

export default function SettingsIndex() {
    const [settings, setSettings] = useState({});
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        axios.get('/admin/settings').then(res => {
            const grouped = res.data.settings || {};
            const settingsMap = {};
            const groupList = Object.keys(grouped).map(name => {
                const items = grouped[name] || [];
                items.forEach(s => { settingsMap[s.key] = s.value || ''; });
                return { name, settings: items.map(s => ({ key: s.key, label: s.label || s.key, type: s.type || 'text' })) };
            });
            setSettings(settingsMap);
            setGroups(groupList);
        }).catch(() => {});
    }, []);

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/admin/settings', { settings });
            alert('Settings saved successfully.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save settings.');
        }
    };

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="System Settings">
            <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
                {groups.map((group) => (
                    <div key={group.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4 capitalize">{group.name}</h3>
                        <div className="space-y-4">
                            {(group.settings || []).map((setting) => (
                                <div key={setting.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{setting.label}</label>
                                    {setting.type === 'boolean' ? (
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!settings[setting.key]}
                                                onChange={(e) => handleChange(setting.key, e.target.checked)}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm text-gray-600">Enabled</span>
                                        </label>
                                    ) : setting.type === 'textarea' ? (
                                        <textarea
                                            value={settings[setting.key] || ''}
                                            onChange={(e) => handleChange(setting.key, e.target.value)}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        />
                                    ) : setting.type === 'number' ? (
                                        <input
                                            type="number"
                                            value={settings[setting.key] || ''}
                                            onChange={(e) => handleChange(setting.key, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={settings[setting.key] || ''}
                                            onChange={(e) => handleChange(setting.key, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                    Save Settings
                </button>
            </form>
        </DashboardLayout>
    );
}
