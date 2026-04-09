export default function StockManagementTable({ products = [] }) {
    const criticalCount = products.filter(p => p.stock_statusLabel === 'Critical' || p.stock_statusLabel === 'Out of Stock').length;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden  shadow-2xl h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-100/20">
                <h3 className="text-black font-bold tracking-tight uppercase text-sm">Stock Management</h3>
                {criticalCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-500/20 animate-pulse uppercase tracking-wider">
                        {criticalCount} Items Critical
                    </span>
                )}
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 bg-white/50">
                            <th className="px-6 py-4 border-b border-gray-100">Product Identity</th>
                            <th className="px-6 py-4 border-b border-gray-100">Classification</th>
                            <th className="px-6 py-4 border-b border-gray-100 text-center">Stock Analytics</th>
                            <th className="px-6 py-4 border-b border-gray-100 text-center">Threshold</th>
                            <th className="px-6 py-4 border-b border-gray-100 text-center">Condition</th>
                            <th className="px-6 py-4 border-b border-gray-100 text-right">Records</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center gap-2 opacity-30">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <p className="text-sm font-medium">No products registered</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-100/40 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white overflow-hidden border border-gray-200 group-hover:border-gray-200 transition-colors shadow-inner flex-shrink-0">
                                                {product.main_image ? (
                                                    <img src={product.main_image.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                ) : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px]">X</div>}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-sm font-bold text-black group-hover:text-[#E60012] transition-colors block truncate uppercase tracking-tight">{product.title}</span>
                                                <span className="text-[10px] text-gray-400 font-mono">#{product.id.toString().padStart(4, '0')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter bg-gray-100/30 px-2 py-1 rounded border border-gray-100">{product.category?.name || 'GEN'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2 min-w-[140px]">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-black text-black">{product.total_stock} <span className="text-gray-400 font-bold ml-0.5 tracking-tighter">PCS</span></span>
                                                <span className={`text-[10px] font-black ${product.stock_statusLabel === 'Healthy' ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                    {Math.round(product.stock_percentageComputed || 0)}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200/20 relative">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ease-in-out ${product.stock_statusColor} relative z-10`}
                                                    style={{ width: `${Math.min(100, product.stock_percentageComputed || 0)}%` }}
                                                />
                                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black text-gray-600 tracking-tight">{product.reference_stock}</span>
                                            <span className="text-[10px] text-gray-300 uppercase font-black tracking-widest leading-tight">Cap</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${product.stock_statusBadge}`}>
                                            {product.stock_statusLabel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end pr-2">
                                            <button 
                                                onClick={() => router.get(`/admin/products/${product.id}/edit`)}
                                                className="group/btn flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100/80 hover:bg-black transition-all border border-gray-200 group-hover:border-gray-300 shadow-xl"
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/btn:text-black">Update</span>
                                                <svg className="w-4 h-4 text-gray-300 group-hover/btn:text-black transition-transform group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-white border-t border-gray-100 text-center">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">{products.length === 0 ? 'Table empty' : 'No additional items recorded'}</span>
            </div>
        </div>
    );
}
