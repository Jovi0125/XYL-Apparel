import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        postal_code: '',
        birthday: '',
        gender: '',
        terms: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/ph/en/register');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
            <Head title="Create Account | XYLO APPAREL" />
            
            <div className="w-full max-w-[500px]">
                {/* Brand Header */}
                <div className="mb-14 text-center">
                    <Link href="/ph/en" className="inline-block">
                        <h1 className="text-[32px] font-black tracking-[0.4em] text-black uppercase italic">
                            XYLO<span className="text-gray-300 not-italic">.</span>
                        </h1>
                    </Link>
                    <h2 className="mt-10 text-[11px] font-black tracking-[0.3em] text-black uppercase">
                        Create Member Account
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-300 uppercase">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-gray-50 border-b border-gray-200 px-1 py-4 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all italic font-medium"
                                    placeholder="FULL NAME"
                                    required
                                />
                                {errors.name && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.name}</p>}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    value={data.postal_code}
                                    onChange={(e) => setData('postal_code', e.target.value)}
                                    className="w-full bg-gray-50 border-b border-gray-200 px-1 py-4 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all italic font-medium"
                                    placeholder="POSTAL CODE"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input
                                    type="date"
                                    value={data.birthday}
                                    onChange={(e) => setData('birthday', e.target.value)}
                                    className="w-full bg-gray-50 border-b border-gray-200 px-1 py-4 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all italic font-medium uppercase"
                                    placeholder="BIRTHDAY"
                                />
                            </div>

                            <div>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full bg-gray-50 border-b border-gray-200 px-1 py-4 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all italic font-medium uppercase"
                                >
                                    <option value="">SELECT GENDER</option>
                                    <option value="male">MALE</option>
                                    <option value="female">FEMALE</option>
                                    <option value="other">OTHER</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Account Security Section */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-300 uppercase">Account Security</h3>
                        
                        <div>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-gray-50 border-b border-gray-200 px-1 py-4 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all italic font-medium"
                                placeholder="EMAIL ADDRESS"
                                required
                            />
                            {errors.email && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-gray-50 border-b border-gray-200 px-1 py-4 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all italic font-medium"
                                    placeholder="PASSWORD"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full bg-gray-50 border-b border-gray-200 px-1 py-4 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all italic font-medium"
                                    placeholder="CONFIRM PASSWORD"
                                    required
                                />
                                {errors.password && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.password}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Terms Section */}
                    <div className="space-y-5 pt-4">
                        <label className="flex items-start group cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.terms}
                                onChange={(e) => setData('terms', e.target.checked)}
                                className="mt-1 h-4 w-4 rounded-none border-gray-300 text-black focus:ring-black"
                                required
                            />
                            <span className="ml-4 text-[11px] text-gray-400 font-medium italic leading-relaxed group-hover:text-black transition-colors">
                                I AGREE TO THE <span className="text-black font-black not-italic border-b border-black/10">TERMS OF SERVICE</span> AND <span className="text-black font-black not-italic border-b border-black/10">PRIVACY POLICY</span>.
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-black text-white text-[11px] font-black tracking-[0.4em] uppercase py-5 rounded-sm hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? 'Creating account...' : 'Sign Up'}
                        </button>

                        <div className="text-center pt-6">
                            <p className="text-[11px] text-gray-400 font-medium italic tracking-wide">
                                Already a member? {' '}
                                <Link href="/ph/en/login" className="text-black font-black not-italic border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
                                    SIGN IN
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
