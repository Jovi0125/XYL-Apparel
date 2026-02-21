@extends('layouts.guest')

@section('title', 'Login — Xylo Apparel')

@section('content')
<h2 class="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

<form method="POST" action="{{ route('login') }}" class="space-y-5">
    @csrf

    {{-- Email --}}
    <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input
            id="email"
            name="email"
            type="email"
            value="{{ old('email') }}"
            required
            autofocus
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
            placeholder="you@example.com"
        >
        @error('email')
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
            placeholder="Enter your password"
        >
        @error('password')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    {{-- Remember Me --}}
    <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="remember" class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900">
            <span class="text-sm text-gray-600">Remember me</span>
        </label>
    </div>

    {{-- Submit --}}
    <button type="submit" class="w-full bg-gray-900 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition duration-200">
        Sign in
    </button>
</form>

<p class="mt-6 text-center text-sm text-gray-500">
    Don't have an account?
    <a href="{{ route('register') }}" class="text-gray-900 font-medium hover:underline">Create one</a>
</p>
@endsection
