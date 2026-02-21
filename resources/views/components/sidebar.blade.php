{{-- Sidebar component partial --}}
<aside class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 z-30 transform transition-transform duration-200 lg:translate-x-0"
       :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
       x-cloak>
    {{-- Logo --}}
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <a href="/" class="flex items-center gap-2">
            <span class="text-xl font-bold tracking-widest uppercase text-gray-900">XYLO</span>
            <span class="text-xs tracking-wider text-gray-400 uppercase">{{ $role ?? '' }}</span>
        </a>
    </div>

    {{-- Navigation --}}
    <nav class="mt-6 px-4 space-y-1">
        {{ $slot }}
    </nav>

    {{-- User Info --}}
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-gray-600">{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}</span>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ auth()->user()->name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ auth()->user()->email }}</p>
            </div>
        </div>
        <form method="POST" action="{{ route('logout') }}" class="mt-3">
            @csrf
            <button type="submit" class="w-full text-left text-sm text-gray-500 hover:text-gray-900 transition">
                Sign out
            </button>
        </form>
    </div>
</aside>
