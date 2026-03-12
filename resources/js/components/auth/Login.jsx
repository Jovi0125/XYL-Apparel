import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import axios from 'axios';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await axios.post('/login', form);
            window.location.href = response.data.redirect;
        } catch (error) {
            if (error.response?.status === 422 || error.response?.status === 403) {
                const errs = error.response.data.errors || {};
                const flat = {};
                for (const [key, val] of Object.entries(errs)) {
                    flat[key] = Array.isArray(val) ? val[0] : val;
                }
                setErrors(flat);
            } else {
                setErrors({ email: 'Something went wrong. Please try again.' });
            }
            setLoading(false);
        }
    };

    return (
        <GuestLayout>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Sign In</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                    {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} className="rounded border-gray-300" />
                        <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <button type="submit" disabled={loading} className="w-full px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
                Don't have an account? <Link to="/register" className="text-gray-900 font-medium hover:underline">Create one</Link>
            </p>
        </GuestLayout>
    );
}
