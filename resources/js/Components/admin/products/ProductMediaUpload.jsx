import React, { useState, useEffect } from 'react';

export default function ProductMediaUpload({ images, existingImages = [], onChange, onExistingChange, errors }) {
    const [previews, setPreviews] = useState([]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const newImages = [...images];
        const newPreviews = [...previews];

        files.forEach(file => {
            newImages.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target.result);
                setPreviews([...newPreviews]);
            };
            reader.readAsDataURL(file);
        });

        onChange(newImages);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        onChange(newImages);
        setPreviews(newPreviews);
    };

    const removeExistingImage = (id) => {
        if (onExistingChange) {
            const updated = existingImages.filter(img => img.id !== id);
            onExistingChange(updated);
        }
    };

    return (
        <div className="sticky top-6 space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
                <div className="absolute inset-0 bg-transparent pointer-events-none" />
                
                <div className="relative p-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Product Media</h3>

                    <label className="relative block cursor-pointer">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all group">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-[#E60012]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-black font-medium">Upload Images</p>
                                    <p className="text-sm text-gray-400 mt-1">Click or drag images here</p>
                                </div>
                            </div>
                        </div>
                    </label>

                    {errors.images && (
                        <p className="mt-2 text-sm text-rose-400">{errors.images}</p>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {/* Existing Images */}
                        {existingImages.map((img) => (
                            <div key={`existing-${img.id}`} className="relative group">
                                <img
                                    src={img.image_url}
                                    alt="Product"
                                    className="w-full h-32 object-cover rounded-xl border border-gray-200 opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <span className="absolute top-2 left-2 px-2 py-1 bg-gray-100/80 text-black text-xs font-medium rounded border border-gray-200/50">
                                    Saved
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(img.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        {/* New Previews */}
                        {previews.map((preview, index) => (
                            <div key={`new-${index}`} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-xl border border-blue-500/50 shadow-sm shadow-blue-500/10"
                                />
                                {existingImages.length === 0 && index === 0 && (
                                    <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                                        Main
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
