<?php

namespace Database\Seeders;

use App\Models\LogisticsProfile;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\Shipment;
use App\Models\ShipmentTrackingEvent;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $sellers = SellerProfile::with('products.variants')->get();
        $logistics = LogisticsProfile::first();

        if ($customers->isEmpty() || $sellers->isEmpty()) {
            return;
        }

        $orderNumber = 1;

        // --- Completed orders (delivered) ---
        foreach ($customers->take(2) as $customer) {
            foreach ($sellers->take(2) as $seller) {
                $products = $seller->products->take(2);
                if ($products->isEmpty()) continue;

                $items = [];
                $subtotal = 0;

                foreach ($products as $product) {
                    $variant = $product->variants->first();
                    $qty = rand(1, 3);
                    $unitPrice = $product->sale_price ?? $product->price;
                    $total = $unitPrice * $qty;
                    $subtotal += $total;

                    $items[] = [
                        'product_id' => $product->id,
                        'product_variant_id' => $variant?->id,
                        'product_name' => $product->name,
                        'variant_label' => $variant?->label ?? '',
                        'quantity' => $qty,
                        'unit_price' => $unitPrice,
                        'total_price' => $total,
                    ];
                }

                $shippingFee = 50.00;
                $discount = $subtotal >= 2000 ? 200 : 0;
                $total = $subtotal - $discount + $shippingFee;
                $platformFee = round($total * 0.10, 2);

                $order = Order::create([
                    'order_number' => 'XYL-' . str_pad($orderNumber++, 6, '0', STR_PAD_LEFT),
                    'customer_id' => $customer->id,
                    'seller_profile_id' => $seller->id,
                    'order_status' => 'completed',
                    'subtotal' => $subtotal,
                    'discount_amount' => $discount,
                    'shipping_fee' => $shippingFee,
                    'total' => $total,
                    'platform_fee' => $platformFee,
                    'shipping_name' => $customer->name,
                    'shipping_phone' => '09171234567',
                    'shipping_address' => '123 Sample Street, Brgy. Example',
                    'shipping_city' => 'Manila',
                    'payment_method' => 'gcash',
                    'payment_status' => 'paid',
                    'created_at' => now()->subDays(rand(15, 30)),
                ]);

                foreach ($items as $item) {
                    OrderItem::create(array_merge($item, ['order_id' => $order->id]));
                }

                // Create delivered shipment
                $deliveredAt = $order->created_at->addDays(rand(3, 5));
                $shipment = Shipment::create([
                    'order_id' => $order->id,
                    'tracking_number' => 'TRK-' . strtoupper(uniqid()),
                    'logistics_profile_id' => $logistics?->id,
                    'delivery_status' => 'delivered',
                    'pickup_address' => $seller->address,
                    'delivery_address' => $order->shipping_address . ', ' . $order->shipping_city,
                    'assigned_at' => $order->created_at->addHours(2),
                    'picked_up_at' => $order->created_at->addDay(),
                    'delivered_at' => $deliveredAt,
                ]);

                $this->createTrackingEvents($shipment, 'delivered', $logistics);
            }
        }

        // --- Processing orders ---
        $customer = $customers->first();
        foreach ($sellers->take(2) as $seller) {
            $product = $seller->products->skip(1)->first() ?? $seller->products->first();
            if (! $product) continue;

            $variant = $product->variants->first();
            $qty = 1;
            $unitPrice = $product->sale_price ?? $product->price;
            $subtotal = $unitPrice * $qty;
            $shippingFee = 50.00;
            $total = $subtotal + $shippingFee;
            $platformFee = round($total * 0.10, 2);

            $order = Order::create([
                'order_number' => 'XYL-' . str_pad($orderNumber++, 6, '0', STR_PAD_LEFT),
                'customer_id' => $customer->id,
                'seller_profile_id' => $seller->id,
                'order_status' => 'processing',
                'subtotal' => $subtotal,
                'discount_amount' => 0,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'platform_fee' => $platformFee,
                'shipping_name' => $customer->name,
                'shipping_phone' => '09181234567',
                'shipping_address' => '456 Another St, Brgy. Test',
                'shipping_city' => 'Quezon City',
                'payment_method' => 'cod',
                'payment_status' => 'pending',
                'created_at' => now()->subDays(rand(2, 5)),
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'product_name' => $product->name,
                'variant_label' => $variant?->label ?? '',
                'quantity' => $qty,
                'unit_price' => $unitPrice,
                'total_price' => $subtotal,
            ]);

            // Shipment in transit
            $shipment = Shipment::create([
                'order_id' => $order->id,
                'tracking_number' => 'TRK-' . strtoupper(uniqid()),
                'logistics_profile_id' => $logistics?->id,
                'delivery_status' => 'in_transit',
                'pickup_address' => $seller->address,
                'delivery_address' => $order->shipping_address . ', ' . $order->shipping_city,
                'assigned_at' => $order->created_at->addHours(3),
                'picked_up_at' => $order->created_at->addDay(),
            ]);

            $this->createTrackingEvents($shipment, 'in_transit', $logistics);
        }

        // --- Pending orders ---
        $customer2 = $customers->count() > 1 ? $customers[1] : $customers->first();
        $seller = $sellers->last();
        $product = $seller->products->last();
        if ($product) {
            $variant = $product->variants->first();
            $qty = 2;
            $unitPrice = $product->sale_price ?? $product->price;
            $subtotal = $unitPrice * $qty;
            $shippingFee = 50.00;
            $total = $subtotal + $shippingFee;
            $platformFee = round($total * 0.10, 2);

            $order = Order::create([
                'order_number' => 'XYL-' . str_pad($orderNumber++, 6, '0', STR_PAD_LEFT),
                'customer_id' => $customer2->id,
                'seller_profile_id' => $seller->id,
                'order_status' => 'pending',
                'subtotal' => $subtotal,
                'discount_amount' => 0,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'platform_fee' => $platformFee,
                'shipping_name' => $customer2->name,
                'shipping_phone' => '09191234567',
                'shipping_address' => '789 New Road, Brgy. Fresh',
                'shipping_city' => 'Pasig',
                'payment_method' => 'bank_transfer',
                'payment_status' => 'pending',
                'created_at' => now()->subHours(rand(6, 24)),
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'product_name' => $product->name,
                'variant_label' => $variant?->label ?? '',
                'quantity' => $qty,
                'unit_price' => $unitPrice,
                'total_price' => $subtotal,
            ]);

            // Unassigned shipment
            Shipment::create([
                'order_id' => $order->id,
                'tracking_number' => 'TRK-' . strtoupper(uniqid()),
                'delivery_status' => 'unassigned',
                'pickup_address' => $seller->address,
                'delivery_address' => $order->shipping_address . ', ' . $order->shipping_city,
            ]);
        }

        // --- Cancelled order ---
        $product = $sellers->first()->products->first();
        if ($product) {
            $variant = $product->variants->skip(1)->first() ?? $product->variants->first();
            $unitPrice = $product->sale_price ?? $product->price;
            $subtotal = $unitPrice;
            $shippingFee = 50.00;
            $total = $subtotal + $shippingFee;

            $order = Order::create([
                'order_number' => 'XYL-' . str_pad($orderNumber++, 6, '0', STR_PAD_LEFT),
                'customer_id' => $customers->first()->id,
                'seller_profile_id' => $sellers->first()->id,
                'order_status' => 'cancelled',
                'subtotal' => $subtotal,
                'discount_amount' => 0,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'platform_fee' => 0,
                'shipping_name' => $customers->first()->name,
                'shipping_phone' => '09171234567',
                'shipping_address' => '123 Sample Street, Brgy. Example',
                'shipping_city' => 'Manila',
                'payment_method' => 'gcash',
                'payment_status' => 'refunded',
                'notes' => 'Customer requested cancellation before shipping.',
                'created_at' => now()->subDays(rand(10, 20)),
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'product_name' => $product->name,
                'variant_label' => $variant?->label ?? '',
                'quantity' => 1,
                'unit_price' => $unitPrice,
                'total_price' => $subtotal,
            ]);
        }
    }

    private function createTrackingEvents(Shipment $shipment, string $upToStatus, ?LogisticsProfile $logistics): void
    {
        $createdBy = $logistics?->user_id;

        $events = [
            ['status' => 'assigned', 'location_text' => 'Sorting Hub, Manila', 'remarks' => 'Shipment assigned to courier'],
            ['status' => 'picked_up', 'location_text' => 'Seller Location', 'remarks' => 'Package picked up from seller'],
            ['status' => 'in_transit', 'location_text' => 'Distribution Center', 'remarks' => 'Package in transit to delivery area'],
            ['status' => 'out_for_delivery', 'location_text' => 'Local Delivery Hub', 'remarks' => 'Out for delivery to recipient'],
            ['status' => 'delivered', 'location_text' => 'Recipient Address', 'remarks' => 'Package delivered successfully'],
        ];

        $statuses = array_column($events, 'status');
        $stopIndex = array_search($upToStatus, $statuses);
        if ($stopIndex === false) return;

        $baseTime = $shipment->assigned_at ?? $shipment->created_at;

        for ($i = 0; $i <= $stopIndex; $i++) {
            ShipmentTrackingEvent::create([
                'shipment_id' => $shipment->id,
                'status' => $events[$i]['status'],
                'location_text' => $events[$i]['location_text'],
                'remarks' => $events[$i]['remarks'],
                'created_by' => $createdBy,
                'created_at' => $baseTime->addHours(($i + 1) * 6),
                'updated_at' => $baseTime->addHours(($i + 1) * 6),
            ]);
        }
    }
}
