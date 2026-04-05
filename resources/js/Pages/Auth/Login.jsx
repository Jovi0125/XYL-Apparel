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
        post('/login');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
            <Head title="Sign In | XYLO APPAREL" />
            
            <div className="w-full max-w-[400px]">
                {/* Brand Header */}
                <div className="mb-14 text-center">
                    <Link href="/" className="inline-block">
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

                    {/* Separator */}
                    <div className="flex items-center space-x-4 py-2">
                        <div className="flex-1 h-[1px] bg-gray-100" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">OR</span>
                        <div className="flex-1 h-[1px] bg-gray-100" />
                    </div>

                    {/* Social Login */}
                    <Link
                        href="/auth/google/redirect"
                        className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-200 text-black text-[11px] font-black tracking-[0.2em] uppercase py-5 rounded-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>Continue with Google</span>
                    </Link>

                    {/* Registration Check */}
                    <div className="text-center pt-8">
                        <p className="text-[11px] text-gray-400 font-medium italic tracking-wide">
                            Don't have an account? {' '}
                            <Link href="/register" className="text-black font-black not-italic border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
                                CREATE ACCOUNT
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
