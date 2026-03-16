import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';

// Admin
import AdminDashboard from './admin/Dashboard';
import AdminCategoriesIndex from './admin/categories/Index';
import AdminCategoriesCreate from './admin/categories/Create';
import AdminCategoriesEdit from './admin/categories/Edit';
import AdminUsersIndex from './admin/users/Index';
import AdminUsersShow from './admin/users/Show';
import AdminSellersIndex from './admin/sellers/Index';
import AdminSellersShow from './admin/sellers/Show';
import AdminOrdersIndex from './admin/orders/Index';
import AdminOrdersShow from './admin/orders/Show';
import AdminInventoryIndex from './admin/inventory/Index';
import AdminInventoryLogs from './admin/inventory/Logs';
import AdminReportsIndex from './admin/reports/Index';
import AdminReportsProducts from './admin/reports/Products';
import AdminReportsSellers from './admin/reports/Sellers';
import AdminSettingsIndex from './admin/settings/Index';

// Seller
import SellerDashboard from './seller/Dashboard';
import SellerProductsIndex from './seller/products/Index';
import SellerProductsCreate from './seller/products/Create';
import SellerProductsEdit from './seller/products/Edit';
import SellerProductsShow from './seller/products/Show';
import SellerOrdersIndex from './seller/orders/Index';
import SellerOrdersShow from './seller/orders/Show';
import SellerInventoryIndex from './seller/inventory/Index';
import SellerInventoryEdit from './seller/inventory/Edit';
import SellerDiscountsIndex from './seller/discounts/Index';
import SellerDiscountsCreate from './seller/discounts/Create';
import SellerDiscountsEdit from './seller/discounts/Edit';
import SellerShopEdit from './seller/shop/Edit';
import SellerReportsIndex from './seller/reports/Index';
import SellerReportsProducts from './seller/reports/Products';

// User (Customer)
import UserDashboard from './user/Dashboard';
import UserBrowseIndex from './user/browse/Index';
import UserBrowseShow from './user/browse/Show';
import UserBrowseShop from './user/browse/Shop';
import UserCartIndex from './user/cart/Index';
import UserCheckoutIndex from './user/checkout/Index';
import UserOrdersIndex from './user/orders/Index';
import UserOrdersShow from './user/orders/Show';
import UserWishlistIndex from './user/wishlist/Index';
import UserProfileEdit from './user/profile/Edit';

// Auth
import Login from './auth/Login';
import Register from './auth/Register';

// Logistics
import LogisticsDashboard from './logistics/Dashboard';
import LogisticsDeliveries from './logistics/Deliveries';
import LogisticsShipmentDetails from './logistics/ShipmentDetails';
import LogisticsDeliveryHistory from './logistics/DeliveryHistory';
import LogisticsShipmentsIndex from './logistics/shipments/Index';
import LogisticsShipmentsShow from './logistics/shipments/Show';
import LogisticsTrackingCreate from './logistics/tracking/Create';
import LogisticsPodCreate from './logistics/pod/Create';
import LogisticsProfileEdit from './logistics/profile/Edit';

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
            <Route path="/admin/sellers" element={<AdminSellersIndex />} />
            <Route path="/admin/sellers/:id" element={<AdminSellersShow />} />
            <Route path="/admin/orders" element={<AdminOrdersIndex />} />
            <Route path="/admin/orders/:id" element={<AdminOrdersShow />} />
            <Route path="/admin/reports" element={<AdminReportsIndex />} />
            <Route path="/admin/reports/products" element={<AdminReportsProducts />} />
            <Route path="/admin/reports/sellers" element={<AdminReportsSellers />} />
            <Route path="/admin/settings" element={<AdminSettingsIndex />} />
            <Route path="/admin/inventory" element={<AdminInventoryIndex />} />
            <Route path="/admin/inventory/logs" element={<AdminInventoryLogs />} />

            {/* Seller */}
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<SellerProductsIndex />} />
            <Route path="/seller/products/create" element={<SellerProductsCreate />} />
            <Route path="/seller/products/:id/edit" element={<SellerProductsEdit />} />
            <Route path="/seller/products/:id" element={<SellerProductsShow />} />
            <Route path="/seller/orders" element={<SellerOrdersIndex />} />
            <Route path="/seller/orders/:id" element={<SellerOrdersShow />} />
            <Route path="/seller/inventory" element={<SellerInventoryIndex />} />
            <Route path="/seller/inventory/:id/edit" element={<SellerInventoryEdit />} />
            <Route path="/seller/discounts" element={<SellerDiscountsIndex />} />
            <Route path="/seller/discounts/create" element={<SellerDiscountsCreate />} />
            <Route path="/seller/discounts/:id/edit" element={<SellerDiscountsEdit />} />
            <Route path="/seller/shop/edit" element={<SellerShopEdit />} />
            <Route path="/seller/reports" element={<SellerReportsIndex />} />
            <Route path="/seller/reports/products" element={<SellerReportsProducts />} />

            {/* Customer / User */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/browse" element={<UserBrowseIndex />} />
            <Route path="/browse/product/:id" element={<UserBrowseShow />} />
            <Route path="/browse/shop/:id" element={<UserBrowseShop />} />
            <Route path="/cart" element={<UserCartIndex />} />
            <Route path="/checkout" element={<UserCheckoutIndex />} />
            <Route path="/orders" element={<UserOrdersIndex />} />
            <Route path="/orders/:id" element={<UserOrdersShow />} />
            <Route path="/wishlist" element={<UserWishlistIndex />} />
            <Route path="/profile/edit" element={<UserProfileEdit />} />

            {/* Logistics */}
            <Route path="/logistics/dashboard" element={<LogisticsDashboard />} />
            <Route path="/logistics/deliveries" element={<LogisticsDeliveries />} />
            <Route path="/logistics/deliveries/:id" element={<LogisticsShipmentDetails />} />
            <Route path="/logistics/history" element={<LogisticsDeliveryHistory />} />
            <Route path="/logistics/shipments" element={<LogisticsShipmentsIndex />} />
            <Route path="/logistics/shipments/:id" element={<LogisticsShipmentsShow />} />
            <Route path="/logistics/tracking/create/:shipmentId" element={<LogisticsTrackingCreate />} />
            <Route path="/logistics/pod/create/:shipmentId" element={<LogisticsPodCreate />} />
            <Route path="/logistics/profile/edit" element={<LogisticsProfileEdit />} />
        </Routes>
    );
}
