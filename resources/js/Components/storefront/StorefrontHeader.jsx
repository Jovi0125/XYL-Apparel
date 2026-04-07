import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function StorefrontHeader({ categories = [] }) {
    const { url } = usePage();
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (slug) => {
        const path = url.split('/')[3] || 'women';
        const baseSlug = path.replace('-navi', '') || 'women';
        return baseSlug === slug;
    };

    const isLandingPage = ['/ph/en', '/ph/en/', '/ph/en/women', '/ph/en/men', '/ph/en/unisex'].includes(url.split('?')[0]);
    const isTransparent = isLandingPage && !scrolled;

    return (
        <header className={`fixed top-0 inset-x-0 z-[400] transition-colors duration-500
            ${isTransparent ? 'bg-transparent text-white' : 'bg-white border-b border-gray-100/10 text-black shadow-sm'}`}>
            <div className="max-w-[120rem] mx-auto px-6 md:px-12 flex flex-col justify-center min-h-[56px] md:h-[70px]">
                
                {/* Top Row: Logo & Icons */}
                <div className="flex items-center justify-between w-full h-14 md:h-full">
                    {/* Left: Logo */}
                    <div className="flex justify-start shrink-0">
                        <Link href="/ph/en" className="group flex items-center">
                            <img 
                                src="/images/xylo-logo.png" 
                                alt="XYLO APPAREL" 
                                className="h-8 md:h-10 w-auto transition-opacity group-hover:opacity-60"
                            />
                        </Link>
                    </div>

                    {/* Center: Parent Tabs (Desktop only) */}
                    <nav className="hidden md:flex flex-1 items-center justify-center space-x-10 px-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={cat.slug === 'women' ? '/ph/en' : `/ph/en/${cat.slug}`}
                                className={`text-[12px] font-bold tracking-[0.2em] uppercase transition-all relative py-2
                                    ${isActive(cat.slug) ? (isTransparent ? 'text-white' : 'text-black') : (isTransparent ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black')}`}
                            >
                                {cat.label}
                                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#E60012] transition-all duration-300
                                    ${isActive(cat.slug) ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Icons */}
                    <div className="flex justify-end items-center space-x-4 md:space-x-8 shrink-0">
                        <button aria-label="Region" className={`opacity-70 hover:opacity-100 transition-opacity hidden sm:block
                            ${isTransparent ? 'text-white' : 'text-black'}`}>
                            <GlobeIcon />
                        </button>
                        <Link href="#" aria-label="Favorites" className={`opacity-70 hover:opacity-100 transition-opacity
                            ${isTransparent ? 'text-white' : 'text-black'}`}>
                            <HeartIcon />
                        </Link>
                        <Link href="/ph/en/login" aria-label="Cart" className={`opacity-70 hover:opacity-100 transition-opacity relative
                            ${isTransparent ? 'text-white' : 'text-black'}`}>
                            <CartIcon />
                        </Link>
                    </div>
                </div>

                {/* Bottom Row: Parent Tabs (Mobile only) */}
                <nav className="flex md:hidden items-center justify-start space-x-6 pb-2 overflow-x-auto no-scrollbar">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={cat.slug === 'women' ? '/ph/en' : `/ph/en/${cat.slug}`}
                            className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all relative py-2 whitespace-nowrap
                                ${isActive(cat.slug) ? (isTransparent ? 'text-white' : 'text-black') : (isTransparent ? 'text-white/60 hover:text-white' : 'text-black/40 hover:text-black')}`}
                        >
                            {cat.label}
                            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#E60012] transition-all duration-300
                                ${isActive(cat.slug) ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}

const GlobeIcon = () => (
    <svg className="w-[20px] h-[20px] stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);
const HeartIcon = () => (
    <svg className="w-[20px] h-[20px] stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const CartIcon = () => (
    <svg className="w-[20px] h-[20px] stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);
