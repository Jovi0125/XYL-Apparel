<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shipment;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    /**
     * Display shipment tracking — read-only monitoring for admin.
     */
    public function index()
    {
        $orders = Order::with(['buyer', 'product.mainImage', 'shipment.rider'])
            ->approved()
            ->whereHas('shipment')
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id'                    => $order->id,
                    'order_number'          => $order->order_number,
                    'product_id'            => $order->product_id,
                    'product_title'         => $order->product?->title ?? 'N/A',
                    'product_variant_label' => $order->product_variant_label,
                    'buyer_name'            => $order->buyer?->name ?? 'N/A',
                    'buyer_email'           => $order->buyer?->email ?? '',
                    'quantity'              => $order->quantity,
                    'unit_price'            => $order->unit_price,
                    'total_amount'          => $order->total_amount,
                    'formatted_total'       => $order->formatted_total,
                    'earnings'              => $order->earnings,
                    'formatted_earnings'    => $order->formatted_earnings,
                    'payment_method'        => $order->payment_method,
                    'payment_method_label'  => $order->payment_method_label,
                    'payment_status'        => $order->payment_status,
                    'shipping_address'      => $order->shipping_address,
                    'contact_number'        => $order->contact_number,
                    'notes'                 => $order->notes,
                    'date'                  => $order->created_at?->format('M d, Y'),
                    'date_time'             => $order->created_at?->format('M d, Y h:i A'),
                    'shipment'              => $order->shipment ? [
                        'id'                  => $order->shipment->id,
                        'tracking_number'     => $order->shipment->tracking_number,
                        'status'              => $order->shipment->status,
                        'status_label'        => $order->shipment->status_label,
                        'carrier'             => $order->shipment->carrier,
                        'rider_id'            => $order->shipment->rider_id,
                        'rider_name'          => $order->shipment->rider?->name,
                        'rider_number'        => $order->shipment->rider?->rider_number,
                        'shipped_at'          => $order->shipment->shipped_at?->format('M d, Y'),
                        'out_for_delivery_at' => $order->shipment->out_for_delivery_at?->format('M d, Y'),
                        'delivered_at'        => $order->shipment->delivered_at?->format('M d, Y'),
                        'notes'               => $order->shipment->notes,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/Shipments/Index', [
            'orders'           => $orders,
            'shipmentStatuses' => Shipment::STATUS_LABELS,
        ]);
    }
}
