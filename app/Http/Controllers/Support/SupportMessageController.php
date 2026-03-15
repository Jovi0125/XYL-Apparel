<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportMessageController extends Controller
{
    public function store(Request $request, SupportTicket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        $user = auth()->user();

        $message = $ticket->messages()->create([
            'user_id'        => $user->id,
            'body'           => $validated['body'],
            'is_staff_reply' => $user->isSupportStaff() || $user->isAdmin(),
        ]);

        // If a staff member replies and ticket is open, move to in_progress
        if ($message->is_staff_reply && $ticket->status === 'open') {
            $ticket->update(['status' => 'in_progress']);
        }

        return response()->json([
            'message'        => 'Reply sent.',
            'support_message' => $message->load('user'),
        ], 201);
    }
}
