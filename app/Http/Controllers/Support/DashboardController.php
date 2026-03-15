<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $open        = SupportTicket::where('status', 'open')->count();
        $inProgress  = SupportTicket::where('status', 'in_progress')->count();
        $resolved    = SupportTicket::where('status', 'resolved')->count();
        $myAssigned  = SupportTicket::where('assigned_to', auth()->id())
            ->whereIn('status', ['open', 'in_progress'])
            ->count();

        $recentTickets = SupportTicket::with('user')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'stats' => [
                'open'        => $open,
                'in_progress' => $inProgress,
                'resolved'    => $resolved,
                'my_assigned' => $myAssigned,
            ],
            'recent_tickets' => $recentTickets,
        ]);
    }
}
