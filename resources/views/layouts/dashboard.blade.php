{{-- Base dashboard layout with sidebar --}}
@extends('layouts.app')

@section('body')
<div x-data="{ sidebarOpen: false }" class="min-h-screen bg-gray-50">
    {{-- Mobile menu button --}}
    <div class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center px-4 z-20">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-lg hover:bg-gray-100 transition">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <span class="ml-3 text-lg font-bold tracking-widest uppercase text-gray-900">XYLO</span>
    </div>

    {{-- Overlay --}}
    <div x-show="sidebarOpen" @click="sidebarOpen = false"
         class="fixed inset-0 bg-black/20 z-20 lg:hidden" x-cloak></div>

    {{-- Sidebar --}}
    @yield('sidebar')

    {{-- Main Content --}}
    <main class="lg:ml-64 pt-16 lg:pt-0">
        {{-- Header --}}
        <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
            <h1 class="text-lg font-semibold text-gray-900">@yield('page-title', 'Dashboard')</h1>
            <div class="flex items-center gap-4">
                @yield('header-actions')
            </div>
        </header>

        {{-- Page Content --}}
        <div class="p-6">
            {{-- Flash Messages --}}
            @if (session('success'))
                <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {{ session('success') }}
                </div>
            @endif
            @if (session('error'))
                <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {{ session('error') }}
                </div>
            @endif

            @yield('content')
        </div>
    </main>
</div>
@endsection
