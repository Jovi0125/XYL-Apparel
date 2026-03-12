<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
            ->when($request->role, fn ($q, $r) => $q->where('role', $r))
            ->when($request->status === 'banned', fn ($q) => $q->where('is_banned', true))
            ->when($request->status === 'active', fn ($q) => $q->where('is_banned', false))
            ->where('role', '!=', 'admin')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('users'));
        }

        return view('welcome');
    }

    public function show(Request $request, User $user)
    {
        $user->load(['sellerProfile', 'logisticsProfile', 'orders']);

        if ($request->expectsJson()) {
            return response()->json(compact('user'));
        }

        return view('welcome');
    }

    public function ban(Request $request, User $user)
    {
        if ($user->isAdmin()) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Cannot ban admin users.'], 422);
            }
            return back()->with('error', 'Cannot ban admin users.');
        }

        $user->update(['is_banned' => true]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => "{$user->name} has been banned."]);
        }

        return back()->with('success', "{$user->name} has been banned.");
    }

    public function unban(Request $request, User $user)
    {
        $user->update(['is_banned' => false]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => "{$user->name} has been unbanned."]);
        }

        return back()->with('success', "{$user->name} has been unbanned.");
    }
}
