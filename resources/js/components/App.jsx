import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';

// Auth
import Login from './auth/Login';
import Register from './auth/Register';

// Admin (existing pages preserved)
import AdminDashboard from './admin/Dashboard';
import AdminCategoriesIndex from './admin/categories/Index';
import AdminCategoriesCreate from './admin/categories/Create';
import AdminCategoriesEdit from './admin/categories/Edit';
import AdminUsersIndex from './admin/users/Index';
import AdminUsersShow from './admin/users/Show';
import AdminOrdersIndex from './admin/orders/Index';
import AdminOrdersShow from './admin/orders/Show';
import AdminReportsIndex from './admin/reports/Index';
import AdminReportsProducts from './admin/reports/Products';
import AdminSettingsIndex from './admin/settings/Index';

// Customer (formerly "user")
import CustomerDashboard from './customer/Dashboard';
import CustomerBrowseIndex from './customer/browse/Index';
import CustomerBrowseShow from './customer/browse/Show';
import CustomerCartIndex from './customer/cart/Index';
import CustomerCheckoutIndex from './customer/checkout/Index';
import CustomerOrdersIndex from './customer/orders/Index';
import CustomerOrdersShow from './customer/orders/Show';
import CustomerWishlistIndex from './customer/wishlist/Index';
import CustomerProfileEdit from './customer/profile/Edit';

// Inventory Staff (new)
import InventoryDashboard from './inventory/Dashboard';
import InventoryIndex from './inventory/InventoryIndex';
import InventoryProducts from './inventory/Products';
import StockAdjustPage from './inventory/StockAdjustPage';
import WarehousesPage from './inventory/WarehousesPage';
import StockReceivingPage from './inventory/StockReceivingPage';

// Fulfillment Staff (new)
import FulfillmentDashboard from './fulfillment/Dashboard';
import FulfillmentOrdersPage from './fulfillment/OrdersPage';
import FulfillmentShipmentsPage from './fulfillment/ShipmentsPage';

// Support Staff (new)
import SupportDashboard from './support/Dashboard';
import SupportTicketsIndex from './support/TicketsIndex';
import SupportTicketShow from './support/TicketShow';

export default function App({ auth, user }) {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Welcome auth={auth} user={user} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<AdminCategoriesIndex />} />
            <Route path="/admin/categories/create" element={<AdminCategoriesCreate />} />
            <Route path="/admin/categories/:id/edit" element={<AdminCategoriesEdit />} />
            <Route path="/admin/users" element={<AdminUsersIndex />} />
            <Route path="/admin/users/:id" element={<AdminUsersShow />} />
            <Route path="/admin/orders" element={<AdminOrdersIndex />} />
            <Route path="/admin/orders/:id" element={<AdminOrdersShow />} />
            <Route path="/admin/reports" element={<AdminReportsIndex />} />
            <Route path="/admin/reports/products" element={<AdminReportsProducts />} />
            <Route path="/admin/settings" element={<AdminSettingsIndex />} />

            {/* Customer */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/browse" element={<CustomerBrowseIndex />} />
            <Route path="/customer/products/:id" element={<CustomerBrowseShow />} />
            <Route path="/customer/cart" element={<CustomerCartIndex />} />
            <Route path="/customer/checkout" element={<CustomerCheckoutIndex />} />
            <Route path="/customer/orders" element={<CustomerOrdersIndex />} />
            <Route path="/customer/orders/:id" element={<CustomerOrdersShow />} />
            <Route path="/customer/wishlist" element={<CustomerWishlistIndex />} />
            <Route path="/customer/profile" element={<CustomerProfileEdit />} />

            {/* Backward compatibility — redirect old customer paths */}
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/browse" element={<CustomerBrowseIndex />} />

            {/* Inventory Staff */}
            <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
            <Route path="/inventory/products" element={<InventoryProducts />} />
            <Route path="/inventory/stock" element={<InventoryIndex />} />
            <Route path="/inventory/stock-adjustment" element={<StockAdjustPage />} />
            <Route path="/inventory/warehouses" element={<WarehousesPage />} />
            <Route path="/inventory/receiving" element={<StockReceivingPage />} />

            {/* Fulfillment Staff */}
            <Route path="/fulfillment/dashboard" element={<FulfillmentDashboard />} />
            <Route path="/fulfillment/orders" element={<FulfillmentOrdersPage />} />
            <Route path="/fulfillment/shipments" element={<FulfillmentShipmentsPage />} />

            {/* Support Staff */}
            <Route path="/support/dashboard" element={<SupportDashboard />} />
            <Route path="/support/tickets" element={<SupportTicketsIndex />} />
            <Route path="/support/tickets/:id" element={<SupportTicketShow />} />
        </Routes>
    );
}
