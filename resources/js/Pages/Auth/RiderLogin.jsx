import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function RiderLogin() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/rider/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-white/20">
            <Head title="XYLO Rider | Delivery Portal" />

            {/* Visual Accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] left-[60%] w-[35%] h-[35%] bg-white/[0.03] rounded-full blur-[110px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Brand Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-[26px] font-black tracking-[0.4em] text-white uppercase italic">
                        XYLO<span className="text-white/30 not-italic">.</span>RIDER
                    </h1>
                    <p className="mt-4 text-[10px] font-medium tracking-[0.3em] text-white/40 uppercase">
                        Last-Mile Delivery Portal
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-3 ml-1">
                                Rider Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-[#181818] border border-white/[0.05] rounded-xl px-5 py-4 text-sm text-white placeholder-white/10 focus:outline-none focus:border-white/20 transition-all duration-300"
                                placeholder="rider@xylo.com"
                                required
                            />
                            {errors.email && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase ml-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-3 ml-1">
                                Rider Password
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
                            </div>
                            {errors.password && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase ml-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-white text-black text-[10px] font-black tracking-[0.4em] uppercase py-5 rounded-xl hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
                        >
                            {processing ? 'Connecting...' : 'Rider Login'}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <a href="/ph/en" className="inline-block text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase hover:text-white transition-all pb-1">
                        ← Back to Storefront
                    </a>
                </div>
            </div>
        </div>
    );
}
