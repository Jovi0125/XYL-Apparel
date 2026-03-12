import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const collections = [
    { name: 'T-Shirts & Tops', desc: 'Everyday comfort meets clean design', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { name: 'Jackets & Outerwear', desc: 'Layer up with modern silhouettes', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
    { name: 'Pants & Bottoms', desc: 'From denim to tailored fits', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Sneakers & Footwear', desc: 'Step into style', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Accessories', desc: 'Complete the look', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
    { name: 'Limited Edition', desc: 'Exclusive drops & collaborations', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
];

const features = [
    { title: 'Multi-Vendor Marketplace', desc: 'Shop from dozens of independent sellers, each with their own curated collections and styles.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { title: 'Secure Checkout', desc: 'Multiple payment options with order protection. Cash on delivery available for eligible items.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Real-Time Tracking', desc: 'Live shipment tracking from pickup to your doorstep, with proof of delivery confirmation.', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { title: 'Discount Codes', desc: 'Sellers offer exclusive discount codes and promotions. Save more on every purchase.', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { title: 'Wishlist & Cart', desc: 'Save items you love and come back to them anytime. Seamless cart management across devices.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'Seller Analytics', desc: 'Sellers get detailed insights into revenue, top products, and customer behavior.', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

const steps = [
    { step: '01', title: 'Browse & Discover', desc: 'Explore products from multiple sellers, filter by category, and find your perfect style.' },
    { step: '02', title: 'Add to Cart & Checkout', desc: 'Add items to your cart, apply discount codes, and choose your preferred payment method.' },
    { step: '03', title: 'Track & Receive', desc: 'Follow your order in real-time from the warehouse to your doorstep with live tracking.' },
];

export default function Welcome({ auth, user }) {
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-[0.2em] uppercase text-gray-900">XYLO</span>
                            <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase hidden sm:inline">Apparel</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#collections" className="text-sm text-gray-600 hover:text-gray-900 transition">Collections</a>
                            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition">Features</a>
                            <a href="#sellers" className="text-sm text-gray-600 hover:text-gray-900 transition">Sell With Us</a>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth ? (
                                <Link to="/dashboard" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition hidden sm:inline">Log in</Link>
                                    <Link to="/register" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                                        Get Started
                                    </Link>
                                </>
                            )}
                            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenu && (
                    <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
                        <a href="#collections" className="block text-sm text-gray-600 hover:text-gray-900">Collections</a>
                        <a href="#features" className="block text-sm text-gray-600 hover:text-gray-900">Features</a>
                        <a href="#sellers" className="block text-sm text-gray-600 hover:text-gray-900">Sell With Us</a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-6">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Now open for sellers &amp; customers
                    </div>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        Fashion that<br />
                        <span className="text-gray-400">speaks for itself.</span>
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        XYLO APPAREL is a curated multi-vendor marketplace connecting you with independent fashion brands and unique styles — all in one place.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {auth ? (
                            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
                                    Start Shopping
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="border-y border-gray-100 bg-gray-50/50">
                <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                    <div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">500+</p>
                        <p className="text-sm text-gray-500 mt-1">Products</p>
                    </div>
                    <div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">50+</p>
                        <p className="text-sm text-gray-500 mt-1">Sellers</p>
                    </div>
                    <div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">10K+</p>
                        <p className="text-sm text-gray-500 mt-1">Happy Customers</p>
                    </div>
                    <div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">4.8</p>
                        <p className="text-sm text-gray-500 mt-1">Avg Rating</p>
                    </div>
                </div>
            </section>

            {/* Collections Grid */}
            <section id="collections" className="py-20 sm:py-28 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Curated Collections</h2>
                        <p className="text-gray-500 mt-3 max-w-lg mx-auto">Explore our handpicked categories, from everyday essentials to statement pieces.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((col, i) => (
                            <div key={i} className="group bg-gray-50 hover:bg-gray-900 rounded-2xl p-8 transition-all duration-300 cursor-pointer">
                                <div className="w-12 h-12 bg-white group-hover:bg-gray-800 rounded-xl flex items-center justify-center mb-5 transition-colors">
                                    <svg className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={col.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors">{col.name}</h3>
                                <p className="text-sm text-gray-500 group-hover:text-gray-400 mt-2 transition-colors">{col.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 sm:py-28 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Why XYLO?</h2>
                        <p className="text-gray-500 mt-3 max-w-lg mx-auto">A marketplace designed for the modern fashion experience.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feat.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">{feat.title}</h3>
                                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sell With Us CTA */}
            <section id="sellers" className="py-20 sm:py-28 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white">Start Selling Today</h2>
                            <p className="text-gray-400 mt-4 max-w-lg mx-auto leading-relaxed">
                                Join XYLO APPAREL as a seller. Set up your shop, list your products, and reach thousands of fashion-savvy customers.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-100 transition">
                                    Create Seller Account
                                </Link>
                                <a href="#features" className="w-full sm:w-auto px-8 py-3.5 border border-gray-600 text-gray-300 text-sm font-medium rounded-xl hover:border-gray-400 hover:text-white transition">
                                    Learn More
                                </a>
                            </div>
                            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto">
                                <div>
                                    <p className="text-2xl font-bold text-white">10%</p>
                                    <p className="text-xs text-gray-400 mt-1">Commission Rate</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">24h</p>
                                    <p className="text-xs text-gray-400 mt-1">Approval Time</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">Free</p>
                                    <p className="text-xs text-gray-400 mt-1">To Get Started</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16">How It Works</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {steps.map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-5">
                                    <span className="text-sm font-bold">{s.step}</span>
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
                                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl font-bold tracking-[0.2em] uppercase text-gray-900">XYLO</span>
                                <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Apparel</span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                                A curated multi-vendor fashion marketplace. Connecting independent brands with style-conscious shoppers since 2025.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Platform</h4>
                            <ul className="space-y-2.5 text-sm text-gray-500">
                                <li><Link to="/register" className="hover:text-gray-900 transition">Create Account</Link></li>
                                <li><Link to="/login" className="hover:text-gray-900 transition">Sign In</Link></li>
                                <li><a href="#features" className="hover:text-gray-900 transition">Features</a></li>
                                <li><a href="#sellers" className="hover:text-gray-900 transition">Sell With Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Categories</h4>
                            <ul className="space-y-2.5 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-gray-900 transition">T-Shirts &amp; Tops</a></li>
                                <li><a href="#" className="hover:text-gray-900 transition">Jackets &amp; Outerwear</a></li>
                                <li><a href="#" className="hover:text-gray-900 transition">Pants &amp; Bottoms</a></li>
                                <li><a href="#" className="hover:text-gray-900 transition">Accessories</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} XYLO APPAREL. All rights reserved.</p>
                        <div className="flex items-center gap-6 text-xs text-gray-400">
                            <a href="#" className="hover:text-gray-600 transition">Privacy</a>
                            <a href="#" className="hover:text-gray-600 transition">Terms</a>
                            <a href="#" className="hover:text-gray-600 transition">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
