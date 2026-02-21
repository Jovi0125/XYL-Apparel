@extends('layouts.dashboard')

@section('page-title', 'Settings')

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
<form method="POST" action="{{ route('admin.settings.update') }}" class="max-w-3xl space-y-8">
    @csrf
    @method('PUT')

    @foreach($settings as $group => $items)
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-1 capitalize">{{ $group }}</h3>
        <p class="text-sm text-gray-400 mb-5">Manage {{ $group }} settings for your platform.</p>

        <div class="space-y-5">
            @foreach($items as $setting)
            <div>
                <label for="settings_{{ $setting->key }}" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ ucwords(str_replace('_', ' ', $setting->key)) }}
                </label>

                @if($setting->type === 'textarea')
                    <textarea
                        name="settings[{{ $setting->key }}]"
                        id="settings_{{ $setting->key }}"
                        rows="3"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 resize-none"
                    >{{ old('settings.' . $setting->key, $setting->value) }}</textarea>
                @elseif($setting->type === 'boolean')
                    <div class="flex items-center gap-2">
                        <input type="hidden" name="settings[{{ $setting->key }}]" value="0">
                        <input
                            type="checkbox"
                            name="settings[{{ $setting->key }}]"
                            id="settings_{{ $setting->key }}"
                            value="1"
                            {{ old('settings.' . $setting->key, $setting->value) ? 'checked' : '' }}
                            class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        >
                        <span class="text-sm text-gray-600">Enabled</span>
                    </div>
                @elseif($setting->type === 'number')
                    <input
                        type="number"
                        name="settings[{{ $setting->key }}]"
                        id="settings_{{ $setting->key }}"
                        value="{{ old('settings.' . $setting->key, $setting->value) }}"
                        step="any"
                        class="w-full max-w-xs px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                @else
                    <input
                        type="text"
                        name="settings[{{ $setting->key }}]"
                        id="settings_{{ $setting->key }}"
                        value="{{ old('settings.' . $setting->key, $setting->value) }}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                @endif

                @error('settings.' . $setting->key)
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            @endforeach
        </div>
    </div>
    @endforeach

    <div class="flex items-center gap-3">
        <button type="submit" class="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
            Save Settings
        </button>
    </div>
</form>
@endsection
