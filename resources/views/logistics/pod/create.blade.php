@extends('layouts.dashboard')

@section('page-title', 'Proof of Delivery')

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
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <p class="font-medium text-gray-900">Upload Proof of Delivery</p>
                <p class="text-xs text-gray-500">{{ $shipment->tracking_number }} — {{ $shipment->order->customer->name ?? 'Customer' }}</p>
            </div>
        </div>

        <form action="{{ route('logistics.pod.store', $shipment) }}" method="POST" enctype="multipart/form-data">
            @csrf

            <div class="space-y-5">
                {{-- Receiver Name --}}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Receiver Name <span class="text-red-500">*</span></label>
                    <input type="text" name="receiver_name" value="{{ old('receiver_name') }}" placeholder="Name of the person who received the package"
                        class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                    @error('receiver_name') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                </div>

                {{-- Photo Upload --}}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Photo</label>
                    <p class="text-xs text-gray-500 mb-2">Take a photo of the delivered package at the doorstep or with the receiver (max 5MB).</p>
                    <div class="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-400 transition cursor-pointer"
                        x-data="{ fileName: '' }"
                        @click="$refs.photoInput.click()">
                        <input type="file" name="photo" accept="image/*" class="hidden" x-ref="photoInput"
                            @change="fileName = $event.target.files[0]?.name || ''" />
                        <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p class="text-sm text-gray-500" x-show="!fileName">Click to upload photo</p>
                        <p class="text-sm text-gray-900 font-medium" x-show="fileName" x-text="fileName"></p>
                    </div>
                    @error('photo') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                </div>

                {{-- Signature Upload --}}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Receiver Signature</label>
                    <p class="text-xs text-gray-500 mb-2">Upload a photo of the receiver's signature (max 2MB).</p>
                    <div class="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-400 transition cursor-pointer"
                        x-data="{ fileName: '' }"
                        @click="$refs.sigInput.click()">
                        <input type="file" name="signature" accept="image/*" class="hidden" x-ref="sigInput"
                            @change="fileName = $event.target.files[0]?.name || ''" />
                        <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <p class="text-sm text-gray-500" x-show="!fileName">Click to upload signature</p>
                        <p class="text-sm text-gray-900 font-medium" x-show="fileName" x-text="fileName"></p>
                    </div>
                    @error('signature') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            {{-- Delivery Info Summary --}}
            <div class="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
                <p class="font-medium text-gray-700 mb-2">Delivery Summary</p>
                <div class="space-y-1 text-gray-600">
                    <p>Customer: <span class="text-gray-900">{{ $shipment->order->customer->name ?? '—' }}</span></p>
                    <p>Address: <span class="text-gray-900">{{ $shipment->delivery_address }}</span></p>
                    <p>Phone: <span class="text-gray-900">{{ $shipment->order->shipping_phone ?? '—' }}</span></p>
                </div>
            </div>

            <div class="mt-6 flex items-center gap-3">
                <button type="submit"
                    class="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
                    Submit Proof of Delivery
                </button>
                <a href="{{ route('logistics.shipments.show', $shipment) }}"
                    class="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
                    Cancel
                </a>
            </div>
        </form>
    </div>
</div>
@endsection
