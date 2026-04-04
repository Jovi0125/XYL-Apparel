<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LogisticsDashboardController extends Controller
{
    /**
     * Show the logistics dashboard
     */
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Logistics/Dashboard', [
            'user' => $user,
            'stats' => [],
        ]);
    }
}
