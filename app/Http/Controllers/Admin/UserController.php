<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(Request $request): View
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

        return view('admin.users.index', compact('users'));
    }

    public function show(User $user): View
    {
        $user->load(['sellerProfile', 'logisticsProfile', 'orders']);

        return view('admin.users.show', compact('user'));
    }

    public function ban(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return back()->with('error', 'Cannot ban admin users.');
        }

        $user->update(['is_banned' => true]);

        return back()->with('success', "{$user->name} has been banned.");
    }

    public function unban(User $user): RedirectResponse
    {
        $user->update(['is_banned' => false]);

        return back()->with('success', "{$user->name} has been unbanned.");
    }
}
