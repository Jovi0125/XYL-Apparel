<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SupportTicket::with(['user', 'assignee']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->boolean('my_assignments')) {
            $query->where('assigned_to', auth()->id());
        }

        if ($request->filled('search')) {
            $query->where('subject', 'like', '%' . $request->search . '%');
        }

        $tickets = $query->latest()->paginate(20);

        return response()->json($tickets);
    }

    public function show(SupportTicket $ticket): JsonResponse
    {
        $ticket->load(['user', 'order', 'assignee', 'messages.user']);

        return response()->json($ticket);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id'  => 'required|exists:users,id',
            'order_id' => 'nullable|exists:orders,id',
            'subject'  => 'required|string|max:255',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'body'     => 'required|string|max:5000',
        ]);

        $ticket = SupportTicket::create([
            'user_id'  => $validated['user_id'],
            'order_id' => $validated['order_id'] ?? null,
            'subject'  => $validated['subject'],
            'priority' => $validated['priority'] ?? 'medium',
        ]);

        // Create the initial message
        $ticket->messages()->create([
            'user_id'        => $validated['user_id'],
            'body'           => $validated['body'],
            'is_staff_reply' => false,
        ]);

        return response()->json($ticket->load('messages'), 201);
    }

    public function update(Request $request, SupportTicket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'status'      => 'sometimes|in:open,in_progress,resolved,closed',
            'priority'    => 'sometimes|in:low,medium,high,urgent',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
        ]);

        $ticket->update($validated);

        return response()->json([
            'message' => 'Ticket updated.',
            'ticket'  => $ticket->fresh()->load('assignee'),
        ]);
    }
}
