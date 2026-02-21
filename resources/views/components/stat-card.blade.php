@props(['title', 'value', 'icon' => null, 'color' => 'gray'])

<div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
    <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-gray-500">{{ $title }}</span>
        @if($icon)
            <span class="text-gray-400">{!! $icon !!}</span>
        @endif
    </div>
    <p class="text-2xl font-bold text-gray-900">{{ $value }}</p>
</div>
