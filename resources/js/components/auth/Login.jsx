import React, { useState } from "react";
import { Link } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import axios from "axios";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await axios.post("/login", form);
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
                setErrors({ email: "Something went wrong. Please try again." });
            }
            setLoading(false);
        }
    };

    return (
        <GuestLayout title="Sign In">
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={form.email} 
                        onChange={(e) => setForm({ ...form, email: e.target.value })} 
                        className="form-control" 
                        required 
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={form.password} 
                        onChange={(e) => setForm({ ...form, password: e.target.value })} 
                        className="form-control" 
                        required 
                    />
                    {errors.password && <p className="form-error">{errors.password}</p>}
                </div>

                <div className="auth-actions">
                    <label className="form-check">
                        <input 
                            type="checkbox" 
                            checked={form.remember} 
                            onChange={(e) => setForm({ ...form, remember: e.target.checked })} 
                        />
                        <span>Remember me</span>
                    </label>
                </div>

                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <p className="form-footer">
                Don't have an account? <Link to="/register" className="footer-link">Create one</Link>
            </p>
        </GuestLayout>
    );
}
