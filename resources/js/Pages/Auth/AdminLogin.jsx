import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-white/20">
            <Head title="XYLO Admin | Internal Login" />
            
            {/* Visual Accents */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-white/[0.03] rounded-full blur-[120px]" />
                <div className="absolute top-[60%] -left-[10%] w-[35%] h-[35%] bg-white/[0.02] rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Brand Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-[28px] font-black tracking-[0.4em] text-white uppercase italic">
                        XYLO<span className="text-white/30 not-italic">.</span>ADMIN
                    </h1>
                    <p className="mt-4 text-[10px] font-medium tracking-[0.3em] text-white/40 uppercase">
                        Authorized Staff Access Only
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-3 ml-1">
                                STAFF Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-[#181818] border border-white/[0.05] rounded-xl px-5 py-4 text-sm text-white placeholder-white/10 focus:outline-none focus:border-white/20 transition-all duration-300 shadow-inner"
                                placeholder="name@xylo.com"
                                required
                            />
                            {errors.email && (
                                <p className="mt-2 text-[10px] font-bold tracking-wider text-red-500 uppercase ml-1 animate-pulse">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-3 ml-1">
                                Security Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-[#181818] border border-white/[0.05] rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all duration-300"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-white/20 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Staff ID Verification Mock / Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-white text-black text-[10px] font-black tracking-[0.4em] uppercase py-5 rounded-xl hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10"
                        >
                            {processing ? 'Verifying Credentials...' : 'Authenticate Access'}
                        </button>
                    </form>
                </div>

                {/* Secure Notice */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-[10px] font-medium tracking-[0.2em] text-white/20 uppercase">
                        Enterprise Grade Security &bull; 256-bit SSL
                    </p>
                    <a href="/ph/en" className="inline-block text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase hover:text-white transition-all border-b border-white/0 hover:border-white/40 pb-1">
                        ← Back to Brand Official
                    </a>
                </div>
            </div>
        </div>
    );
}
