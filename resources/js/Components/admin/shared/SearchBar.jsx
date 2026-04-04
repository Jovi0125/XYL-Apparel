import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 1) {
                setLoading(true);
                setIsOpen(true);
                try {
                    const { data } = await axios.get(`/admin/search?query=${query}`);
                    setResults(data);
                } catch (e) {
                    console.error("Search error", e);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults(null);
                setIsOpen(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="relative w-full max-w-lg" ref={wrapperRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-700/50 rounded-xl bg-slate-800/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all sm:text-sm"
                    placeholder="Search products, categories, orders..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setIsOpen(true)}
                />
            </div>

            {isOpen && (
                <div className="absolute mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto backdrop-blur-md bg-opacity-95">
                    {loading ? (
                        <div className="p-4 text-center text-slate-500">Searching...</div>
                    ) : results && (Object.values(results).some(r => Array.isArray(r) && r.length > 0)) ? (
                        <div className="p-2 space-y-4">
                            {results.products?.length > 0 && (
                                <div>
                                    <h3 className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</h3>
                                    {results.products.map(p => (
                                        <button key={p.id} onClick={() => router.get(`/admin/products/${p.id}/edit`)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm text-slate-300 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-700 flex-shrink-0 bg-cover bg-center" style={{backgroundImage: p.main_image ? `url(${p.main_image.image_url})` : 'none'}} />
                                            {p.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {results.categories?.length > 0 && (
                                <div>
                                    <h3 className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</h3>
                                    {results.categories.map(c => (
                                        <button key={c.id} onClick={() => router.get('/admin/categories')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm text-slate-300">
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-slate-500">No results found for "{query}"</div>
                    )}
                </div>
            )}
        </div>
    );
}
