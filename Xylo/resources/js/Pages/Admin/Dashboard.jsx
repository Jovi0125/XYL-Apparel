import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Dashboard({ user, stats }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                    Welcome back, {user?.name || 'Admin'}!
                </h2>
                <p className="text-gray-400 mt-1">
                    Here's what's happening with your store today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={<ProductIcon />}
                    color="indigo"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<OrderIcon />}
                    color="emerald"
                />
                <StatCard
                    title="Pending Shipments"
                    value={stats.pendingShipments}
                    icon={<ShipmentIcon />}
                    color="amber"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={<RevenueIcon />}
                    color="rose"
                />
            </div>

            {/* Recent Orders & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {stats.recentOrders.map((order) => (
                            <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-300">
                                            {order.customer.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{order.customer}</p>
                                        <p className="text-xs text-gray-400">{order.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-white">${order.amount.toFixed(2)}</p>
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-700">
                        <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                            View all orders →
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <QuickActionButton icon={<PlusIcon />} label="Add New Product" />
                        <QuickActionButton icon={<CategoryIcon />} label="Manage Categories" />
                        <QuickActionButton icon={<OrderIcon />} label="Process Orders" />
                        <QuickActionButton icon={<ShipmentIcon />} label="Update Shipments" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
    const colorClasses = {
        indigo: 'bg-indigo-500/10 text-indigo-400',
        emerald: 'bg-emerald-500/10 text-emerald-400',
        amber: 'bg-amber-500/10 text-amber-400',
        rose: 'bg-rose-500/10 text-rose-400',
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

// Quick Action Button Component
function QuickActionButton({ icon, label }) {
    return (
        <button className="w-full flex items-center px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-600 mr-3">
                {icon}
            </span>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}

// Helper function for status colors
function getStatusColor(status) {
    switch (status) {
        case 'Processing':
            return 'bg-blue-500/20 text-blue-400';
        case 'Shipped':
            return 'bg-emerald-500/20 text-emerald-400';
        case 'Pending':
            return 'bg-amber-500/20 text-amber-400';
        default:
            return 'bg-gray-500/20 text-gray-400';
    }
}

// Icon Components
function ProductIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

function OrderIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    );
}

function ShipmentIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
    );
}

function RevenueIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );
}

function CategoryIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    );
}
