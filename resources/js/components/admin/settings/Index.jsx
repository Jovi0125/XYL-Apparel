import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

const GROUP_ORDER = ['general', 'branding', 'marketplace', 'orders', 'delivery', 'inventory', 'notifications', 'security', 'seller', 'customer'];

export default function SettingsIndex() {
    const [allSettings, setAllSettings] = useState({});
    const [groups, setGroups] = useState([]);
    const [activeGroup, setActiveGroup] = useState('general');
    const [values, setValues] = useState({});
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        axios.get('/admin/settings').then(res => {
            const grouped = res.data.settings || {};
            const settingsMap = {};
            const gList = GROUP_ORDER.filter(g => grouped[g]);
            Object.values(grouped).flat().forEach(s => { settingsMap[s.key] = s.value || ''; });
            setAllSettings(grouped);
            setGroups(gList);
            setValues(settingsMap);
        }).catch(() => {});
    }, []);

    const handleChange = (key, val) => { setValues(prev => ({ ...prev, [key]: val })); setFeedback(''); };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put('/admin/settings', { settings: values });
            setFeedback('Settings saved!');
        } catch (err) {
            setFeedback('Failed to save.');
        }
        setSaving(false);
    };

    const currentSettings = allSettings[activeGroup] || [];

    const renderField = (setting) => {
        const val = values[setting.key] ?? '';
        const type = setting.type || 'string';

        if (type === 'boolean') {
            const isOn = val === '1' || val === 'true' || val === true;
            return (
                <div className="toggle-switch">
                    <div className={`switch ${isOn ? 'on' : ''}`} onClick={() => handleChange(setting.key, isOn ? '0' : '1')}>
                        <div className="switch-knob"></div>
                    </div>
                    <span className="switch-label">{isOn ? 'Enabled' : 'Disabled'}</span>
                </div>
            );
        }
        if (type === 'number') {
            return <input type="number" value={val} onChange={e => handleChange(setting.key, e.target.value)} />;
        }
        if (type === 'text') {
            return <textarea value={val} onChange={e => handleChange(setting.key, e.target.value)} />;
        }
        if (type === 'image') {
            return (
                <div>
                    {val && <img src={val.startsWith('/') ? val : `/storage/${val}`} alt={setting.label} style={{ maxWidth: 120, marginBottom: 8, display: 'block', border: '1px solid #eee' }} />}
                    <input type="file" accept="image/*" onChange={e => {
                        // For now, just show the file name. Full upload can be wired later.
                        const file = e.target.files[0];
                        if (file) handleChange(setting.key, file.name);
                    }} />
                </div>
            );
        }
        return <input type="text" value={val} onChange={e => handleChange(setting.key, e.target.value)} />;
    };

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="System Settings">
            <div className="settings-module">
                <div className="settings-sidebar">
                    <ul className="settings-nav">
                        {groups.map(g => (
                            <li key={g} className={activeGroup === g ? 'active' : ''} onClick={() => { setActiveGroup(g); setFeedback(''); }}>
                                {g}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="settings-content">
                    <div className="settings-group-title">{activeGroup} Settings</div>
                    <div className="settings-group-desc">Manage {activeGroup} configuration for the platform.</div>
                    {currentSettings.map(s => (
                        <div key={s.key} className="setting-field">
                            <label>{s.label || s.key}</label>
                            {s.description && <div className="setting-help">{s.description}</div>}
                            {renderField(s)}
                        </div>
                    ))}
                    <button className="save-btn" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {feedback && <span className="save-feedback">{feedback}</span>}
                </div>
            </div>
        </DashboardLayout>
    );
}
