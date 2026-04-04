import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import StatCard from '../../Components/admin/dashboard/StatCard';
import SalesChart from '../../Components/admin/dashboard/SalesChart';
import CustomerMap from '../../Components/admin/dashboard/CustomerMap';
import DeviceChart from '../../Components/admin/dashboard/DeviceChart';
import RecentOrdersTable from '../../Components/admin/dashboard/RecentOrdersTable';

export default function Dashboard({ user, stats = {} }) {
    // Extract data with proper null handling for empty states
    // Extract data with proper null handling for empty states
    const {
        revenue = null,
        orders = null,
        products = null,
        lowStockAlerts = null,
        salesData = null,
        customerDistribution = null,
        deviceUsage = null,
        recentOrders = []
    } = stats || {};

    // Format currency
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return null;
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <AdminLayout title="Dashboard" activeItem="dashboard">
            <Head title="Admin Dashboard" />

            {/* Page Background Gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Top Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(revenue?.value)}
                        trend={revenue?.trend}
                        trendLabel="vs last month"
                        emptyMessage="No revenue data yet"
                        gradient="from-emerald-500/10 to-cyan-500/10"
                        icon={<RevenueIcon />}
                    />
                    <StatCard
                        title="Total Orders"
                        value={orders?.value}
                        trend={orders?.trend}
                        trendLabel="vs last month"
                        emptyMessage="No orders yet"
                        gradient="from-blue-500/10 to-indigo-500/10"
                        icon={<OrdersIcon />}
                    />
                    <StatCard
                        title="Active Products"
                        value={products?.value}
                        trend={products?.trend}
                        trendLabel="vs last month"
                        emptyMessage="No products yet"
                        gradient="from-teal-500/10 to-cyan-500/10"
                        icon={<ProductsIcon />}
                    />
                    <StatCard
                        title="Low Stock Alerts"
                        value={lowStockAlerts?.value}
                        trend={lowStockAlerts?.trend}
                        trendLabel="items need attention"
                        emptyMessage="No alerts yet"
                        gradient="from-amber-500/10 to-orange-500/10"
                        icon={<AlertIcon />}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                    {/* Sales Overview - Takes 2 columns */}
                    <div className="xl:col-span-2">
                        <SalesChart data={salesData} />
                    </div>
                    
                    {/* Device Usage */}
                    <div>
                        <DeviceChart data={deviceUsage} />
                    </div>
                </div>

                {/* Map and Orders Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                    {/* Customer Distribution Map */}
                    <div className="xl:col-span-2">
                        <CustomerMap data={customerDistribution} />
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                        <div className="relative z-10 p-6">
                            <h3 className="text-lg font-semibold text-white mb-5">Quick Actions</h3>
                            <div className="space-y-3">
                                <QuickAction icon={<PlusIcon />} label="Add New Product" color="blue" />
                                <QuickAction icon={<TagIcon />} label="Create Discount" color="teal" />
                                <QuickAction icon={<TruckIcon />} label="Process Shipments" color="cyan" />
                                <QuickAction icon={<ChartIcon />} label="View Analytics" color="emerald" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products and Alerts Row */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                    {/* Active Products List */}
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Active Products</h3>
                            <button onClick={() => router.visit('/admin/products')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View All</button>
                        </div>
                        <div className="space-y-4">
                            {stats.activeProducts?.length > 0 ? (
                                stats.activeProducts.map(product => (
                                    <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                                            {product.main_image ? (
                                                <img src={product.main_image.image_url} alt={product.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <ProductsIcon />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-white truncate">{product.title}</h4>
                                            <p className="text-xs text-slate-500">{product.category?.name || 'Uncategorized'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold text-white">₱{parseFloat(product.final_price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center text-slate-500 text-sm italic">No active products yet</div>
                            )}
                        </div>
                    </div>

                    {/* Low Stock Alerts List */}
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white text-orange-400">Low Stock Alerts</h3>
                            <button onClick={() => router.visit('/admin/inventory')} className="text-xs text-slate-500 hover:text-slate-400 transition-colors">Manage Stock</button>
                        </div>
                        <div className="space-y-4">
                            {stats.lowStockProducts?.length > 0 ? (
                                stats.lowStockProducts.map(product => (
                                    <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 transition-colors hover:bg-orange-500/10">
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-orange-500/20">
                                            {product.main_image ? (
                                                <img src={product.main_image.image_url} alt={product.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-orange-500/50">
                                                    <AlertIcon />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-white truncate">{product.title}</h4>
                                            <p className="text-xs text-orange-500/70 font-medium">Only {product.total_stock} items left!</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                                <div 
                                                    className="h-full bg-orange-500 rounded-full" 
                                                    style={{ width: `${Math.max(10, product.stock_percentage)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center text-slate-500 text-sm italic">Excellent! No low stock alerts.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table - Full Width */}
                <div className="mb-8">
                    <RecentOrdersTable orders={recentOrders} />
                </div>
            </div>
        </AdminLayout>
    );
}

// Quick Action Button with gradient
function QuickAction({ icon, label, color = 'blue' }) {
    const colorClasses = {
        blue: 'group-hover:text-blue-400 group-hover:border-blue-500/30',
        teal: 'group-hover:text-teal-400 group-hover:border-teal-500/30',
        cyan: 'group-hover:text-cyan-400 group-hover:border-cyan-500/30',
        emerald: 'group-hover:text-emerald-400 group-hover:border-emerald-500/30',
    };

    return (
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all duration-200 group">
            <span className={`p-2.5 rounded-xl bg-slate-700/50 border border-slate-600/30 text-slate-400 transition-all duration-200 ${colorClasses[color]}`}>
                {icon}
            </span>
            <span className="text-sm font-medium">{label}</span>
            <svg className="w-4 h-4 ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
}

// Icons
function RevenueIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function OrdersIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );
}

function ProductsIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    );
}

function AlertIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function TagIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
    );
}

function TruckIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
    );
}
