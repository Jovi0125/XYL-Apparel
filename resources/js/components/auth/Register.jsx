import React, { useState } from "react";
import { Link } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import axios from "axios";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "", role: "customer" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await axios.post("/register", form);
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
                setErrors({ email: "Something went wrong. Please try again." });
            }
            setLoading(false);
        }
    };

    return (
        <GuestLayout title="Create Account">
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Name</label>
                    <input 
                        type="text" 
                        value={form.name} 
                        onChange={(e) => setForm({ ...form, name: e.target.value })} 
                        className="form-control" 
                        required 
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                </div>

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
                    <label>Account Type</label>
                    <select 
                        value={form.role} 
                        onChange={(e) => setForm({ ...form, role: e.target.value })} 
                        className="form-control"
                    >
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                    </select>
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

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input 
                        type="password" 
                        value={form.password_confirmation} 
                        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} 
                        className="form-control" 
                        required 
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>

            <p className="form-footer">
                Already have an account? <Link to="/login" className="footer-link">Sign in</Link>
            </p>
        </GuestLayout>
    );
}
