import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/ph/en/login');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
            <Head title="Sign In | XYLO APPAREL" />
            
            <div className="w-full max-w-[400px]">
                {/* Brand Header */}
                <div className="mb-14 text-center">
                    <Link href="/ph/en" className="inline-block">
                        <h1 className="text-[32px] font-black tracking-[0.4em] text-black uppercase italic">
                            XYLO<span className="text-gray-300 not-italic">.</span>
                        </h1>
                    </Link>
                    <h2 className="mt-10 text-[11px] font-black tracking-[0.3em] text-black uppercase">
                        Member Sign In
                    </h2>
                </div>

                {/* Login Form */}
                <div className="space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-gray-50 border-b border-gray-200 px-1 py-4 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all duration-300 rounded-none italic font-medium"
                                placeholder="EMAIL ADDRESS"
                                required
                            />
                            {errors.email && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.email}</p>}
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-gray-50 border-b border-gray-200 px-1 py-4 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all duration-300 rounded-none italic font-medium"
                                placeholder="PASSWORD"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-4 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-black transition-colors"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-black text-white text-[11px] font-black tracking-[0.4em] uppercase py-5 rounded-sm hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>



                    {/* Registration Check */}
                    <div className="text-center pt-8">
                        <p className="text-[11px] text-gray-400 font-medium italic tracking-wide">
                            Don't have an account? {' '}
                            <Link href="/ph/en/register" className="text-black font-black not-italic border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
                                CREATE ACCOUNT
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
