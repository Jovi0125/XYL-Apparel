<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        // Only show non-admin users (registered via Brevo/OTP flow)
        $query = User::where('role', '!=', User::ROLE_ADMIN);

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

    /**
     * Create a new delivery rider account.
     * Auto-generates a rider_number like RDR-001.
     */
    public function createRider(Request $request)
    {
        $request->validate([
            'name'     => ['required', 'string', 'max:100'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        // Auto-generate next rider number: RDR-001, RDR-002 …
        $lastRider = User::where('role', User::ROLE_RIDER)
            ->whereNotNull('rider_number')
            ->orderByDesc('id')
            ->first();

        $nextNum = 1;
        if ($lastRider && preg_match('/RDR-(\d+)/', $lastRider->rider_number, $m)) {
            $nextNum = (int) $m[1] + 1;
        }
        $riderNumber = 'RDR-' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

        User::create([
            'name'              => $request->name,
            'email'             => $request->email,
            'password'          => $request->password,
            'role'              => User::ROLE_RIDER,
            'rider_number'      => $riderNumber,
            'status'            => 'active',
            'email_verified_at' => now(),
        ]);

        return back()->with('success', "Rider account for {$request->name} created successfully ({$riderNumber}).");
    }
}
