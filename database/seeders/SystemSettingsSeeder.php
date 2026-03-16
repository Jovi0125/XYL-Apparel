<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SystemSetting;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // ── General ──
            ['key' => 'site_name', 'value' => 'Xyl Apparel', 'type' => 'string', 'group' => 'general', 'label' => 'Site Name', 'description' => 'The name of the platform', 'is_public' => true],
            ['key' => 'site_tagline', 'value' => 'Your Style, Your Way', 'type' => 'string', 'group' => 'general', 'label' => 'Site Tagline', 'description' => 'Short tagline for the platform', 'is_public' => true],
            ['key' => 'contact_email', 'value' => 'support@xylapparel.com', 'type' => 'string', 'group' => 'general', 'label' => 'Contact Email', 'description' => 'Primary contact email', 'is_public' => true],
            ['key' => 'contact_phone', 'value' => '+63 912 345 6789', 'type' => 'string', 'group' => 'general', 'label' => 'Contact Phone', 'description' => 'Primary contact phone', 'is_public' => true],
            ['key' => 'business_address', 'value' => 'Manila, Philippines', 'type' => 'text', 'group' => 'general', 'label' => 'Business Address', 'description' => 'Official business address', 'is_public' => true],
            ['key' => 'timezone', 'value' => 'Asia/Manila', 'type' => 'string', 'group' => 'general', 'label' => 'Timezone', 'description' => 'Default timezone', 'is_public' => false],
            ['key' => 'currency', 'value' => 'PHP', 'type' => 'string', 'group' => 'general', 'label' => 'Currency', 'description' => 'Default currency code', 'is_public' => true],

            // ── Branding ──
            ['key' => 'site_logo', 'value' => null, 'type' => 'image', 'group' => 'branding', 'label' => 'Site Logo', 'description' => 'Main logo image', 'is_public' => true],
            ['key' => 'favicon', 'value' => null, 'type' => 'image', 'group' => 'branding', 'label' => 'Favicon', 'description' => 'Browser tab icon', 'is_public' => true],
            ['key' => 'homepage_banner', 'value' => null, 'type' => 'image', 'group' => 'branding', 'label' => 'Homepage Banner', 'description' => 'Hero banner image', 'is_public' => true],
            ['key' => 'footer_text', 'value' => '© 2026 Xyl Apparel. All rights reserved.', 'type' => 'text', 'group' => 'branding', 'label' => 'Footer Text', 'description' => 'Footer copyright text', 'is_public' => true],
            ['key' => 'facebook_url', 'value' => '', 'type' => 'string', 'group' => 'branding', 'label' => 'Facebook URL', 'description' => 'Facebook page URL', 'is_public' => true],
            ['key' => 'instagram_url', 'value' => '', 'type' => 'string', 'group' => 'branding', 'label' => 'Instagram URL', 'description' => 'Instagram page URL', 'is_public' => true],

            // ── Marketplace ──
            ['key' => 'platform_commission_rate', 'value' => '10', 'type' => 'number', 'group' => 'marketplace', 'label' => 'Commission Rate (%)', 'description' => 'Platform commission percentage per sale', 'is_public' => false],
            ['key' => 'seller_approval_required', 'value' => '1', 'type' => 'boolean', 'group' => 'marketplace', 'label' => 'Seller Approval Required', 'description' => 'Require admin approval for new sellers', 'is_public' => false],
            ['key' => 'product_approval_required', 'value' => '0', 'type' => 'boolean', 'group' => 'marketplace', 'label' => 'Product Approval Required', 'description' => 'Require admin approval for new products', 'is_public' => false],
            ['key' => 'allow_seller_registration', 'value' => '1', 'type' => 'boolean', 'group' => 'marketplace', 'label' => 'Allow Seller Registration', 'description' => 'Allow new sellers to register', 'is_public' => true],
            ['key' => 'max_products_per_seller', 'value' => '100', 'type' => 'number', 'group' => 'marketplace', 'label' => 'Max Products Per Seller', 'description' => 'Maximum product listings per seller', 'is_public' => false],
            ['key' => 'max_images_per_product', 'value' => '8', 'type' => 'number', 'group' => 'marketplace', 'label' => 'Max Images Per Product', 'description' => 'Maximum images per product listing', 'is_public' => false],

            // ── Orders ──
            ['key' => 'allow_cod', 'value' => '1', 'type' => 'boolean', 'group' => 'orders', 'label' => 'Allow Cash on Delivery', 'description' => 'Enable COD payment method', 'is_public' => true],
            ['key' => 'default_order_status', 'value' => 'pending', 'type' => 'string', 'group' => 'orders', 'label' => 'Default Order Status', 'description' => 'Initial status for new orders', 'is_public' => false],
            ['key' => 'auto_cancel_unpaid_order_minutes', 'value' => '1440', 'type' => 'number', 'group' => 'orders', 'label' => 'Auto-Cancel Unpaid (min)', 'description' => 'Minutes before unpaid orders are auto-cancelled', 'is_public' => false],
            ['key' => 'customer_cancellation_allowed', 'value' => '1', 'type' => 'boolean', 'group' => 'orders', 'label' => 'Customer Cancellation', 'description' => 'Allow customers to cancel orders', 'is_public' => true],
            ['key' => 'cancellation_window_hours', 'value' => '24', 'type' => 'number', 'group' => 'orders', 'label' => 'Cancellation Window (hrs)', 'description' => 'Hours within which cancellation is allowed', 'is_public' => false],

            // ── Delivery ──
            ['key' => 'default_delivery_fee', 'value' => '50', 'type' => 'number', 'group' => 'delivery', 'label' => 'Default Delivery Fee', 'description' => 'Standard delivery fee in PHP', 'is_public' => true],
            ['key' => 'free_shipping_threshold', 'value' => '999', 'type' => 'number', 'group' => 'delivery', 'label' => 'Free Shipping Threshold', 'description' => 'Minimum order amount for free shipping', 'is_public' => true],
            ['key' => 'delivery_sla_hours', 'value' => '72', 'type' => 'number', 'group' => 'delivery', 'label' => 'Delivery SLA (hrs)', 'description' => 'Target delivery hours', 'is_public' => false],
            ['key' => 'enable_logistics_assignment', 'value' => '1', 'type' => 'boolean', 'group' => 'delivery', 'label' => 'Auto-Assign Logistics', 'description' => 'Automatically assign logistics to shipments', 'is_public' => false],
            ['key' => 'default_delivery_status', 'value' => 'unassigned', 'type' => 'string', 'group' => 'delivery', 'label' => 'Default Delivery Status', 'description' => 'Initial delivery status for new shipments', 'is_public' => false],

            // ── Inventory ──
            ['key' => 'low_stock_threshold', 'value' => '10', 'type' => 'number', 'group' => 'inventory', 'label' => 'Low Stock Threshold', 'description' => 'Units below which a variant is considered low stock', 'is_public' => false],
            ['key' => 'auto_hide_out_of_stock', 'value' => '0', 'type' => 'boolean', 'group' => 'inventory', 'label' => 'Auto-Hide Out of Stock', 'description' => 'Automatically hide products with zero stock', 'is_public' => false],
            ['key' => 'allow_backorders', 'value' => '0', 'type' => 'boolean', 'group' => 'inventory', 'label' => 'Allow Backorders', 'description' => 'Allow orders for out-of-stock items', 'is_public' => false],
            ['key' => 'notify_seller_low_stock', 'value' => '1', 'type' => 'boolean', 'group' => 'inventory', 'label' => 'Notify Seller Low Stock', 'description' => 'Email seller when stock is low', 'is_public' => false],
            ['key' => 'notify_admin_critical_stock', 'value' => '1', 'type' => 'boolean', 'group' => 'inventory', 'label' => 'Notify Admin Critical Stock', 'description' => 'Email admin when stock is critically low', 'is_public' => false],

            // ── Notifications ──
            ['key' => 'email_notifications_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications', 'label' => 'Email Notifications', 'description' => 'Enable email notifications globally', 'is_public' => false],
            ['key' => 'order_confirmation_email_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications', 'label' => 'Order Confirmation Email', 'description' => 'Send order confirmation emails to customers', 'is_public' => false],
            ['key' => 'seller_order_alert_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications', 'label' => 'Seller Order Alert', 'description' => 'Notify sellers about new orders', 'is_public' => false],
            ['key' => 'delivery_status_notification_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications', 'label' => 'Delivery Status Notification', 'description' => 'Notify customers of delivery status changes', 'is_public' => false],

            // ── Security ──
            ['key' => 'otp_expiry_minutes', 'value' => '5', 'type' => 'number', 'group' => 'security', 'label' => 'OTP Expiry (min)', 'description' => 'Minutes before OTP expires', 'is_public' => false],
            ['key' => 'otp_max_attempts', 'value' => '5', 'type' => 'number', 'group' => 'security', 'label' => 'OTP Max Attempts', 'description' => 'Maximum OTP verification attempts', 'is_public' => false],
            ['key' => 'account_lock_minutes', 'value' => '30', 'type' => 'number', 'group' => 'security', 'label' => 'Account Lock Duration (min)', 'description' => 'Minutes to lock account after failed attempts', 'is_public' => false],
            ['key' => 'require_email_verification', 'value' => '1', 'type' => 'boolean', 'group' => 'security', 'label' => 'Require Email Verification', 'description' => 'Require users to verify their email', 'is_public' => false],
            ['key' => 'session_timeout_minutes', 'value' => '120', 'type' => 'number', 'group' => 'security', 'label' => 'Session Timeout (min)', 'description' => 'Minutes of inactivity before session expires', 'is_public' => false],

            // ── Seller ──
            ['key' => 'shop_deletion_grace_days', 'value' => '30', 'type' => 'number', 'group' => 'seller', 'label' => 'Shop Deletion Grace Period', 'description' => 'Days before a shop is permanently deleted', 'is_public' => false],
            ['key' => 'allow_custom_domain', 'value' => '0', 'type' => 'boolean', 'group' => 'seller', 'label' => 'Allow Custom Domain', 'description' => 'Allow sellers to use custom domains', 'is_public' => false],
            ['key' => 'allow_discount_codes', 'value' => '1', 'type' => 'boolean', 'group' => 'seller', 'label' => 'Allow Discount Codes', 'description' => 'Allow sellers to create discount codes', 'is_public' => false],
            ['key' => 'allow_seller_events', 'value' => '1', 'type' => 'boolean', 'group' => 'seller', 'label' => 'Allow Seller Events', 'description' => 'Allow sellers to create promotional events', 'is_public' => false],

            // ── Customer ──
            ['key' => 'wishlist_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'customer', 'label' => 'Wishlist Enabled', 'description' => 'Enable customer wishlist feature', 'is_public' => true],
            ['key' => 'guest_checkout_enabled', 'value' => '0', 'type' => 'boolean', 'group' => 'customer', 'label' => 'Guest Checkout', 'description' => 'Allow checkout without account', 'is_public' => true],
            ['key' => 'seller_messaging_enabled', 'value' => '0', 'type' => 'boolean', 'group' => 'customer', 'label' => 'Seller Messaging', 'description' => 'Allow customers to message sellers', 'is_public' => true],
            ['key' => 'max_cart_quantity_per_item', 'value' => '10', 'type' => 'number', 'group' => 'customer', 'label' => 'Max Cart Qty Per Item', 'description' => 'Maximum quantity per item in cart', 'is_public' => true],
        ];

        foreach ($settings as $s) {
            SystemSetting::updateOrCreate(
                ['key' => $s['key']],
                $s
            );
        }
    }
}
