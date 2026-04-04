import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function CategoryForm({ editingCategory, onCancelEdit }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        _method: 'POST',
        name: '',
        parent_category: 'Men',
        description: '',
        image: null,
        status: 'active',
    });

    // Load data when editingCategory changes
    useEffect(() => {
        if (editingCategory) {
            setData({
                _method: 'PUT',
                name: editingCategory.name || '',
                parent_category: editingCategory.parent_category || 'Men',
                description: editingCategory.description || '',
                image: null, // Reset image field
                status: editingCategory.status || 'active',
            });
            setImagePreview(editingCategory.image_url || null);
        } else {
            reset();
            setData('_method', 'POST');
            setImagePreview(null);
        }
    }, [editingCategory]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setData('image', file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingCategory) {
            // For files, we use POST with _method spoofing
            post(`/admin/categories/${editingCategory.id}`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    onCancelEdit();
                    reset();
                    setImagePreview(null);
                },
            });
        } else {
            setData('_method', 'POST');
            post('/admin/categories', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setImagePreview(null);
                },
            });
        }
    };

    return (
        <div className="sticky top-6">
            <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-teal-500/5 pointer-events-none" />
                
                {/* Form Header */}
                <div className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-800/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white tracking-tight">
                                {editingCategory ? 'Edit Category' : 'Create Category'}
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">
                                {editingCategory ? 'Update existing category details.' : 'Add a new category to organize your products.'}
                            </p>
                        </div>
                        {editingCategory && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg transition-all"
                                title="Cancel Edit"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="relative z-10 p-6 space-y-5">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter category name"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-sm text-rose-400">{errors.name}</p>
                        )}
                        <p className="mt-1.5 text-xs text-slate-500">
                            Choose a clear and descriptive name.
                        </p>
                    </div>

                    {/* Parent Category Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Parent Category <span className="text-rose-400">*</span>
                        </label>
                        <select
                            value={data.parent_category}
                            onChange={(e) => setData('parent_category', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            required
                        >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                        {errors.parent_category && (
                            <p className="mt-1.5 text-sm text-rose-400">{errors.parent_category}</p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Enter description..."
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                        />
                        {errors.description && (
                            <p className="mt-1.5 text-sm text-rose-400">{errors.description}</p>
                        )}
                        <p className="mt-1.5 text-xs text-slate-500">
                            Briefly describe this category.
                        </p>
                    </div>

                    {/* Image Upload Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Image (Optional)
                        </label>
                        
                        {!imagePreview ? (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`relative border-2 border-dashed rounded-xl transition-all ${
                                    isDragging
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-slate-700/50 bg-slate-800/30'
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center py-10 px-4">
                                    <svg
                                        className="w-12 h-12 text-slate-600 mb-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-sm text-slate-400 mb-1">
                                        Upload Image
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        PNG, JPG, up to 5MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-slate-700/50">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-2 bg-slate-900/90 hover:bg-rose-500 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {errors.image && (
                            <p className="mt-1.5 text-sm text-rose-400">{errors.image}</p>
                        )}
                    </div>

                    {/* Status Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Status
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setData('status', 'active')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                    data.status === 'active'
                                        ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50'
                                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${data.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                                    Active
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('status', 'inactive')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                    data.status === 'inactive'
                                        ? 'bg-slate-500/20 text-slate-300 border-2 border-slate-500/50'
                                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${data.status === 'inactive' ? 'bg-slate-400' : 'bg-slate-500'}`} />
                                    Inactive
                                </div>
                            </button>
                        </div>
                        {errors.status && (
                            <p className="mt-1.5 text-sm text-rose-400">{errors.status}</p>
                        )}
                        <p className="mt-1.5 text-xs text-slate-500">
                            Inactive categories won't be visible.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating...
                            </>
                        ) : (
                            <>
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {editingCategory ? 'Update Category' : 'Add Category'}
                            </>
                        )}
                    </button>
                    {editingCategory && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            disabled={processing}
                            className="w-full px-6 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white rounded-xl transition-all"
                        >
                            Cancel Editing
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
