@props(['href', 'active' => false])

<a href="{{ $href }}"
   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
          {{ $active
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' }}">
    {{ $slot }}
</a>
