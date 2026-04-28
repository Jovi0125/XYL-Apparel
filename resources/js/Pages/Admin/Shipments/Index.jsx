import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import ShipmentTable from '../../../Components/admin/shipments/ShipmentTable';
import OrderDetailPanel from '../../../Components/admin/shipments/OrderDetailPanel';

export default function ShipmentsIndex({ orders = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewingOrder, setViewingOrder] = useState(null);

    // Dynamic filtering
    const filteredOrders = orders.filter(order => {
        const matchesSearch = (
            order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.product_title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const orderShipmentStatus = order.shipment?.status || 'preparing';
        const matchesStatus = filterStatus === 'all' || orderShipmentStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout title="Shipment Tracking" activeItem="commerce">
            <Head title="Shipment Tracking - XYLO Admin" />

            <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-black tracking-tight">Shipment Tracking</h2>
                        <p className="text-sm text-gray-400 mt-1">Monitor fulfillment progress for approved orders. Updates are made by the logistics team.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl">
                        <div className="text-center px-4 border-r border-gray-200">
                            <div className="text-2xl font-bold text-black">{orders.length}</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Total Shipments</div>
                        </div>
                        <div className="text-center px-4 border-r border-gray-200">
                            <div className="text-2xl font-bold text-blue-500">
                                {orders.filter(o => ['preparing', 'packed', 'out_for_delivery'].includes(o.shipment?.status)).length}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">In Progress</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-bold text-emerald-500">
                                {orders.filter(o => o.shipment?.status === 'delivered').length}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Delivered</div>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Order ID, Buyer, or Product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-48 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all appearance-none cursor-pointer"
                        >
                            <option value="all">All Shipments</option>
                            <option value="preparing">Preparing</option>
                            <option value="packed">Ready for Pickup</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                {/* Table or Empty State */}
                {filteredOrders.length === 0 ? (
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100">
                        <div className="px-8 py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border border-gray-200 mb-6 shadow-inner">
                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-black mb-2">No shipments found</h3>
                            <p className="text-sm text-gray-400 max-w-sm">
                                {searchQuery || filterStatus !== 'all'
                                    ? "No shipments match your current filters."
                                    : "Approved orders will appear here once the logistics team begins fulfillment."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <ShipmentTable
                        orders={filteredOrders}
                        onView={setViewingOrder}
                        onUpdate={() => {}} /* No-op — read-only */
                        readOnly={true}
                    />
                )}
            </div>

            {/* Detail Panel */}
            {viewingOrder && (
                <OrderDetailPanel
                    order={viewingOrder}
                    onClose={() => setViewingOrder(null)}
                />
            )}
        </AdminLayout>
    );
}
