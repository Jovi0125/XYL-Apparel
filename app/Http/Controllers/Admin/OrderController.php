<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shipment;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Traits\NotifyAdmins;

class OrderController extends Controller
{
    use NotifyAdmins;

    /**
     * Display all orders with approve/reject controls.
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
                    'product_image'         => $order->product?->mainImage?->image_url,
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
                    'order_status'          => $order->order_status ?? 'pending',
                    'order_status_label'    => $order->order_status_label,
                    'shipping_address'      => $order->shipping_address,
                    'contact_number'        => $order->contact_number,
                    'notes'                 => $order->notes,
                    'date'                  => $order->created_at?->format('M d, Y'),
                    'date_time'             => $order->created_at?->format('M d, Y h:i A'),
                    'shipment'              => $order->shipment ? [
                        'status'       => $order->shipment->status,
                        'status_label' => $order->shipment->status_label,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/Orders/Index', [
            'orders'             => $orders,
            'orderStatusLabels'  => Order::ORDER_STATUS_LABELS,
        ]);
    }

    /**
     * Approve an order — creates a shipment record automatically.
     */
    public function approveOrder(Order $order)
    {
        if ($order->order_status !== Order::ORDER_PENDING) {
            return redirect()->back()->withErrors(['error' => 'Only pending orders can be approved.']);
        }

        try {
            DB::beginTransaction();

            $order->update(['order_status' => Order::ORDER_APPROVED]);

            // Auto-create shipment with 'preparing' status
            if (!$order->shipment) {
                Shipment::create([
                    'order_id' => $order->id,
                    'status'   => 'preparing',
                ]);
            }

            DB::commit();

            self::notifyAdmins(
                "Order {$order->order_number} has been approved and sent to fulfillment.",
                'success'
            );

            return redirect()->back()->with('success', "Order {$order->order_number} approved successfully.");

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to approve order: ' . $e->getMessage()]);
        }
    }

    /**
     * Reject an order — restores stock.
     */
    public function rejectOrder(Request $request, Order $order)
    {
        if ($order->order_status !== Order::ORDER_PENDING) {
            return redirect()->back()->withErrors(['error' => 'Only pending orders can be rejected.']);
        }

        try {
            DB::beginTransaction();

            $order->update(['order_status' => Order::ORDER_REJECTED]);

            // Restore stock
            $order->load('product');
            $variant = $order->product?->variants()
                ->where('size', explode(' / ', $order->product_variant_label ?? '')[0] ?? '')
                ->first();

            if ($variant) {
                $variant->increment('stock', $order->quantity);
            } elseif ($order->product) {
                $order->product->increment('stock', $order->quantity);
            }

            DB::commit();

            self::notifyAdmins(
                "Order {$order->order_number} has been rejected.",
                'danger'
            );

            return redirect()->back()->with('success', "Order {$order->order_number} rejected.");

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to reject order: ' . $e->getMessage()]);
        }
    }
}
