<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use App\Traits\NotifyAdmins;

class ShipmentController extends Controller
{
    use NotifyAdmins;

    /**
     * Display the shipments / order fulfillment listing.
     */
    public function index(Request $request)
    {
        $orders = Order::with(['buyer', 'product.mainImage', 'shipment'])
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
                        'id'                => $order->shipment->id,
                        'tracking_number'   => $order->shipment->tracking_number,
                        'status'            => $order->shipment->status,
                        'status_label'      => $order->shipment->status_label,
                        'carrier'           => $order->shipment->carrier,
                        'shipped_at'        => $order->shipment->shipped_at?->format('M d, Y'),
                        'delivered_at'      => $order->shipment->delivered_at?->format('M d, Y'),
                        'notes'             => $order->shipment->notes,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/Shipments/Index', [
            'orders'           => $orders,
            'shipmentStatuses' => Shipment::STATUS_LABELS,
            'paymentMethods'   => Order::PAYMENT_METHODS,
        ]);
    }

    /**
     * Update shipment status for an order.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'shipment_status' => 'required|in:pending,preparing,shipped,in_transit,delivered,cancelled',
            'tracking_number' => 'nullable|string|max:100',
            'carrier'         => 'nullable|string|max:100',
        ]);

        try {
            DB::beginTransaction();

            $shipment = $order->shipment;

            if (!$shipment) {
                $shipment = $order->shipment()->create([
                    'status'          => $validated['shipment_status'],
                    'tracking_number' => $validated['tracking_number'] ?? null,
                    'carrier'         => $validated['carrier'] ?? null,
                ]);
            } else {
                $shipment->update([
                    'status'          => $validated['shipment_status'],
                    'tracking_number' => $validated['tracking_number'] ?? $shipment->tracking_number,
                    'carrier'         => $validated['carrier'] ?? $shipment->carrier,
                ]);
            }

            // Auto-set timestamps based on status
            if ($validated['shipment_status'] === 'shipped' && !$shipment->shipped_at) {
                $shipment->update(['shipped_at' => now()]);
            }

            if ($validated['shipment_status'] === 'delivered' && !$shipment->delivered_at) {
                $shipment->update(['delivered_at' => now()]);
                // Auto-mark payment as paid if COD and delivered
                if ($order->payment_method === 'cod' && $order->payment_status !== 'paid') {
                    $order->update(['payment_status' => 'paid']);
                }
            }

            DB::commit();

            self::notifyAdmins(
                "Shipment for order {$order->order_number} updated to '{$validated['shipment_status']}'.",
                'info'
            );

            return redirect()->back()->with('success', 'Shipment status updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to update shipment: ' . $e->getMessage()]);
        }
    }

    /**
     * Update payment status for an order.
     */
    public function updatePaymentStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:pending,paid,unpaid,failed',
        ]);

        $order->update(['payment_status' => $validated['payment_status']]);

        self::notifyAdmins(
            "Payment for order {$order->order_number} marked as '{$validated['payment_status']}'.",
            'info'
        );

        return redirect()->back()->with('success', 'Payment status updated successfully.');
    }
}
