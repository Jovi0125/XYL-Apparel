import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import ShipmentTable from '../../../Components/admin/shipments/ShipmentTable';
import OrderDetailPanel from '../../../Components/admin/shipments/OrderDetailPanel';
import UpdateStatusModal from '../../../Components/admin/shipments/UpdateStatusModal';

export default function ShipmentsIndex({ orders = [] }) {
    const { flash } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFlash, setShowFlash] = useState(!!flash?.success);

    // Modal states
    const [viewingOrder, setViewingOrder] = useState(null);
    const [updatingOrder, setUpdatingOrder] = useState(null);

    // Dynamic filtering
    const filteredOrders = orders.filter(order => {
        const matchesSearch = (
            order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.product_title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const orderShipmentStatus = order.shipment?.status || 'pending';
        const matchesStatus = filterStatus === 'all' || orderShipmentStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout title="Shipments & Fulfillment" activeItem="commerce">
            <Head title="Shipments - XYLO Admin" />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 space-y-6">
                {/* Flash Messages */}
                {showFlash && flash?.success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flash.success}
                        </div>
                        <button onClick={() => setShowFlash(false)} className="text-emerald-400 hover:text-emerald-300">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Header Metrics */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Order Fulfillment</h2>
                        <p className="text-sm text-slate-400 mt-1">Manage shipments and payment statuses for customer orders.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm p-4 rounded-2xl">
                        <div className="text-center px-4 border-r border-slate-800">
                            <div className="text-2xl font-bold text-white">{orders.length}</div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500">Total Orders</div>
                        </div>
                        <div className="text-center px-4 border-r border-slate-800">
                            <div className="text-2xl font-bold text-teal-400">
                                {orders.filter(o => !o.shipment || o.shipment.status === 'pending').length}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500">Pending Shipments</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-bold text-emerald-400">
                                {orders.filter(o => o.payment_status === 'unpaid').length}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500">Unpaid Orders</div>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm p-4 rounded-2xl">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Order ID, Buyer, or Product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/30 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-48 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all appearance-none cursor-pointer"
                        >
                            <option value="all">All Shipments</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="shipped">Shipped</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Table or Empty State */}
                {filteredOrders.length === 0 ? (
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                        <div className="relative px-8 py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700/50 mb-6 shadow-inner">
                                <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No shipment records yet</h3>
                            <p className="text-sm text-slate-400 max-w-sm">
                                {searchQuery || filterStatus !== 'all'
                                    ? "No orders match your current search and filter criteria."
                                    : "When customers place orders, their shipments will appear here for you to fulfill."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <ShipmentTable
                        orders={filteredOrders}
                        onView={setViewingOrder}
                        onUpdate={setUpdatingOrder}
                    />
                )}
            </div>

            {/* Modals & Drawers */}
            {viewingOrder && (
                <OrderDetailPanel
                    order={viewingOrder}
                    onClose={() => setViewingOrder(null)}
                />
            )}

            {updatingOrder && (
                <UpdateStatusModal
                    order={updatingOrder}
                    onClose={() => setUpdatingOrder(null)}
                />
            )}
        </AdminLayout>
    );
}
