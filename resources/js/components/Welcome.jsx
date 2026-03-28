import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Welcome({ auth, user }) {
    const [activeSection, setActiveSection] = useState(0);
    const containerRef = useRef(null);
    const sectionRefs = useRef([]);
    const wheelLockRef = useRef(false);

    const heroBackgroundStyle = {
        backgroundImage: "url('/images/hero-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };
    const secondBackgroundStyle = {
        backgroundImage: "url('/images/second-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries.filter((entry) => entry.isIntersecting);
                if (visibleEntries.length === 0) {
                    return;
                }

                visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                const index = Number(visibleEntries[0].target.getAttribute('data-section-index'));

                if (!Number.isNaN(index)) {
                    setActiveSection(index);
                }
            },
            { threshold: [0.45, 0.6, 0.75] }
        );

        const sections = sectionRefs.current.filter(Boolean);
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (index) => {
        const container = containerRef.current;
        const targetSection = sectionRefs.current[index];

        if (!container || !targetSection) {
            return;
        }

        container.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth',
        });
    };

    const handleWheel = (event) => {
        event.preventDefault();

        if (wheelLockRef.current || event.deltaY === 0) {
            return;
        }

        const direction = event.deltaY > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(sectionRefs.current.length - 1, activeSection + direction));

        if (nextIndex === activeSection) {
            return;
        }

        wheelLockRef.current = true;
        scrollToSection(nextIndex);

        window.setTimeout(() => {
            wheelLockRef.current = false;
        }, 700);
    };

    return (
        <>
            <style>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <header className="fixed top-2 left-0 right-0 z-30 flex items-start justify-between pl-24 pr-12 sm:pl-32 sm:pr-16">
                <img
                    src="/images/top-right-logo.png"
                    alt="XYLO logo"
                    className="h-14 w-auto sm:h-20 object-contain"
                />
                {auth ? (
                    <Link to="/dashboard" className="inline-flex items-center mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:opacity-70">
                        Dashboard
                    </Link>
                ) : (
                    <Link to="/login" className="inline-flex items-center mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:opacity-70">
                        Login
                    </Link>
                )}
            </header>
            <button
                type="button"
                aria-label="Go to first section"
                onClick={() => scrollToSection(0)}
                className="fixed left-1/2 bottom-8 -translate-x-1/2 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-lg ring-1 ring-black/10 transition hover:bg-white hover:shadow-xl"
            >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 3.75 3.75 10.5v9h5.25v-5.25h6V19.5h5.25v-9L12 3.75z" />
                </svg>
            </button>
            <div
                ref={containerRef}
                onWheel={handleWheel}
                className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar"
            >
            <div className="fixed right-5 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 pointer-events-none">
                {[0, 1].map((index) => (
                    <span
                        key={index}
                        className={activeSection === index
                            ? 'h-8 w-1 rounded-full bg-gray-900/90 transition-all duration-300'
                            : 'h-1.5 w-1.5 rounded-full bg-gray-500/40 transition-all duration-300'}
                    />
                ))}
            </div>
            <section
                ref={(el) => {
                    sectionRefs.current[0] = el;
                }}
                data-section-index="0"
                className={`relative h-screen snap-start [scroll-snap-stop:always] transition-opacity duration-700 ease-out ${activeSection === 0 ? 'opacity-100' : 'opacity-95'}`}
                style={heroBackgroundStyle}
            >
                <div className="absolute left-8 sm:left-16 lg:left-24 top-[62%] -translate-y-1/2 z-10">
                    <img
                        src="/images/xy.png"
                        alt="XYLO mark"
                        className="-ml-8 sm:-ml-9 mb-4 h-12 w-auto sm:h-14 object-contain"
                    />
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-black leading-tight">
                        DRIP x Arist Series Tee
                    </h2>
                    <p className="mt-3 max-w-sm text-sm sm:text-base text-black/85 leading-relaxed">
                        Bold art. Clean drip.
                        <br />
                        Elevate your everyday fit with a statement piece built for style and comfort.
                    </p>
                    <p className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-black">
                        P1999
                    </p>
                </div>
            </section>
            <section
                ref={(el) => {
                    sectionRefs.current[1] = el;
                }}
                data-section-index="1"
                className={`relative h-screen snap-start [scroll-snap-stop:always] transition-opacity duration-700 ease-out ${activeSection === 1 ? 'opacity-100' : 'opacity-95'}`}
                style={secondBackgroundStyle}
            >
                <div className="absolute left-8 sm:left-16 lg:left-24 top-[62%] -translate-y-1/2 z-10">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white leading-tight">
                        Distressed Denim Trucker
                    </h2>
                    <p className="mt-3 max-w-sm text-sm sm:text-base text-white/90 leading-relaxed">
                        Rugged denim. Timeless edge.
                        <br />
                        Elevate your street fit with a bold, distressed look built for everyday wear.
                    </p>
                    <p className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        P3499
                    </p>
                </div>
            </section>
            </div>
        </>
    );
}
