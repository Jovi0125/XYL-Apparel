import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'customer' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await axios.post('/register', form);
            window.location.href = response.data.redirect;
        } catch (error) {
            if (error.response?.status === 422) {
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
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                    {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                </div>

                <button type="submit" disabled={loading} className="w-full px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
                Already have an account? <Link to="/login" className="text-gray-900 font-medium hover:underline">Sign in</Link>
            </p>
        </GuestLayout>
    );
}
