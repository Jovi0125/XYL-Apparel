<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BuyerDashboardController extends Controller
{
    /**
     * Show the buyer dashboard
     */
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Buyer/Dashboard', [
            'user' => $user,
            'stats' => [],
        ]);
    }
}
