@extends('layouts.guest')

@section('title', 'Register — Xylo Apparel')

@section('content')
<h2 class="text-xl font-semibold text-gray-900 mb-6">Create your account</h2>

<form method="POST" action="{{ route('register') }}" class="space-y-5">
    @csrf

    {{-- Name --}}
    <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full name</label>
        <input
            id="name"
            name="name"
            type="text"
            value="{{ old('name') }}"
            required
            autofocus
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
            placeholder="John Doe"
        >
        @error('name')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    {{-- Email --}}
    <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input
            id="email"
            name="email"
            type="email"
            value="{{ old('email') }}"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
            placeholder="you@example.com"
        >
        @error('email')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    {{-- Phone --}}
    <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone <span class="text-gray-400">(optional)</span></label>
        <input
            id="phone"
            name="phone"
            type="text"
            value="{{ old('phone') }}"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
            placeholder="09XX XXX XXXX"
        >
        @error('phone')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    {{-- Role --}}
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">I want to</label>
        <div class="grid grid-cols-2 gap-3">
            <label class="relative cursor-pointer">
                <input type="radio" name="role" value="customer" class="peer sr-only" {{ old('role', 'customer') === 'customer' ? 'checked' : '' }}>
                <div class="border-2 border-gray-200 rounded-lg p-4 text-center peer-checked:border-gray-900 peer-checked:bg-gray-50 transition">
                    <svg class="w-6 h-6 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">Shop</span>
                </div>
            </label>
            <label class="relative cursor-pointer">
                <input type="radio" name="role" value="seller" class="peer sr-only" {{ old('role') === 'seller' ? 'checked' : '' }}>
                <div class="border-2 border-gray-200 rounded-lg p-4 text-center peer-checked:border-gray-900 peer-checked:bg-gray-50 transition">
                    <svg class="w-6 h-6 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">Sell</span>
                </div>
            </label>
        </div>
        @error('role')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    {{-- Password --}}
    <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
            id="password"
            name="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
            placeholder="Minimum 8 characters"
        >
        @error('password')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    {{-- Confirm Password --}}
    <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
        <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
            placeholder="Re-enter your password"
        >
    </div>

    {{-- Submit --}}
    <button type="submit" class="w-full bg-gray-900 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition duration-200">
        Create account
    </button>
</form>

<p class="mt-6 text-center text-sm text-gray-500">
    Already have an account?
    <a href="{{ route('login') }}" class="text-gray-900 font-medium hover:underline">Sign in</a>
</p>
@endsection
