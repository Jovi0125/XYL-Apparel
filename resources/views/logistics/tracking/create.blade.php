@extends('layouts.dashboard')

@section('page-title', 'Add Tracking Event')

@section('sidebar')
@include('logistics.partials.sidebar')
@endsection

@section('content')
{{-- Back --}}
<div class="mb-4">
    <a href="{{ route('logistics.shipments.show', $shipment) }}" class="text-sm text-gray-500 hover:text-gray-900 transition inline-flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" /></svg>
        Back to Shipment
    </a>
</div>

<div class="max-w-2xl">
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
            </div>
            <div>
                <p class="font-medium text-gray-900">{{ $shipment->tracking_number }}</p>
                <p class="text-xs text-gray-500">Add a new tracking event</p>
            </div>
        </div>

        <form action="{{ route('logistics.tracking.store', $shipment) }}" method="POST">
            @csrf

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status <span class="text-red-500">*</span></label>
                    <select name="status"
                        class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                        <option value="">Select status...</option>
                        <option value="Package received at sorting hub" {{ old('status') === 'Package received at sorting hub' ? 'selected' : '' }}>Package received at sorting hub</option>
                        <option value="In transit to destination" {{ old('status') === 'In transit to destination' ? 'selected' : '' }}>In transit to destination</option>
                        <option value="Arrived at local facility" {{ old('status') === 'Arrived at local facility' ? 'selected' : '' }}>Arrived at local facility</option>
                        <option value="Out for delivery" {{ old('status') === 'Out for delivery' ? 'selected' : '' }}>Out for delivery</option>
                        <option value="Delivery attempted" {{ old('status') === 'Delivery attempted' ? 'selected' : '' }}>Delivery attempted</option>
                        <option value="Package held at facility" {{ old('status') === 'Package held at facility' ? 'selected' : '' }}>Package held at facility</option>
                        <option value="Delivered" {{ old('status') === 'Delivered' ? 'selected' : '' }}>Delivered</option>
                        <option value="Other" {{ old('status') === 'Other' ? 'selected' : '' }}>Other</option>
                    </select>
                    @error('status') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" name="location_text" value="{{ old('location_text') }}" placeholder="e.g. Manila Sorting Hub"
                        class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                    @error('location_text') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea name="remarks" rows="3" placeholder="Additional notes..."
                        class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">{{ old('remarks') }}</textarea>
                    @error('remarks') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="mt-6 flex items-center gap-3">
                <button type="submit"
                    class="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                    Add Event
                </button>
                <a href="{{ route('logistics.shipments.show', $shipment) }}"
                    class="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
                    Cancel
                </a>
            </div>
        </form>
    </div>

    {{-- Existing Tracking Events --}}
    @if($shipment->trackingEvents->count())
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Previous Events</h3>
        <div class="space-y-3">
            @foreach($shipment->trackingEvents as $event)
            <div class="flex gap-3 text-sm">
                <div class="flex flex-col items-center">
                    <div class="w-2 h-2 rounded-full {{ $loop->first ? 'bg-gray-900' : 'bg-gray-300' }} mt-1.5"></div>
                    @if(!$loop->last)
                        <div class="w-px flex-1 bg-gray-200 my-1"></div>
                    @endif
                </div>
                <div class="pb-2">
                    <p class="font-medium text-gray-900">{{ $event->status }}</p>
                    @if($event->location_text)
                        <p class="text-xs text-gray-500">{{ $event->location_text }}</p>
                    @endif
                    <p class="text-xs text-gray-400">{{ $event->created_at->format('M d, Y h:i A') }} — {{ $event->creator->name ?? 'System' }}</p>
                </div>
            </div>
            @endforeach
        </div>
    </div>
    @endif
</div>
@endsection
