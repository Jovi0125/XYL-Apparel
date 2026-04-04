<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        // Role filtering
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/UsersIndex', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Placeholder for viewing a user.
     */
    public function show(User $user)
    {
        // For future implementation
        return back()->with('info', 'User viewing is not yet implemented.');
    }

    /**
     * Delete a user.
     */
    public function destroy(User $user)
    {
        // Don't allow deleting self
        if (auth()->id() === $user->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'User has been deleted successfully.');
    }

    /**
     * Toggle user status (Active/Suspended).
     */
    public function toggleStatus(User $user)
    {
        // Don't allow suspending self
        if (auth()->id() === $user->id) {
            return back()->with('error', 'You cannot suspend your own account.');
        }

        if ($user->status === 'active') {
            $user->update([
                'status' => 'suspended',
                'suspended_at' => now(),
            ]);
            $message = 'User has been banned/suspended.';
        } else {
            $user->update([
                'status' => 'active',
                'suspended_at' => null,
            ]);
            $message = 'User has been reactivated.';
        }

        return back()->with('success', $message);
    }
}
