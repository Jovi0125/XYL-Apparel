{{-- Guest layout for login/register --}}
@extends('layouts.app')

@section('body')
<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md">
        {{-- Logo --}}
        <div class="text-center mb-8">
            <a href="/" class="inline-block">
                <h1 class="text-3xl font-bold tracking-widest uppercase text-gray-900">XYLO</h1>
                <p class="text-xs tracking-[0.3em] text-gray-500 uppercase mt-1">Apparel</p>
            </a>
        </div>

        {{-- Session Messages --}}
        @if (session('error'))
            <div class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {{ session('error') }}
            </div>
        @endif

        @if (session('success'))
            <div class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {{ session('success') }}
            </div>
        @endif

        {{-- Card --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            @yield('content')
        </div>
    </div>
</div>
@endsection
