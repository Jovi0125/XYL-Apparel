# Cloudinary Integration Guide

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
composer install
```

The `cloudinary-labs/cloudinary-laravel` package has been added to `composer.json`.

---

### 2. Get Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your [Dashboard](https://cloudinary.com/console)
3. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

---

### 3. Configure Environment Variables

Update your `.env` file:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=
```

> **Note:** The `CLOUDINARY_URL` format is: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`

---

### 4. Publish Cloudinary Config (Optional)

```bash
php artisan vendor:publish --provider="CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider"
```

Or use the custom config file already created at `config/cloudinary.php`.

---

## 🚀 Usage Examples

### Basic Upload

```php
use Cloudinary\Cloudinary;

// Upload an image
$result = cloudinary()->uploadApi()->upload($request->file('image'), [
    'folder' => 'xylo-apparel/products',
    'transformation' => [
        'quality' => 'auto',
        'fetch_format' => 'auto',
    ]
]);

// Get the URL
$imageUrl = $result['secure_url'];
$publicId = $result['public_id'];
```

---

### Using Helper Functions

```php
// Upload
$result = cloudinary_upload($request->file('image'), [
    'folder' => 'xylo-apparel/products',
]);

// Get URL with transformation
$thumbnailUrl = cloudinary_url($publicId, 'product_thumbnail');
$detailUrl = cloudinary_url($publicId, 'product_detail');

// Delete
cloudinary_delete($publicId);
```

---

### Product Image Upload Example

```php
// In your ProductController

public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'image' => 'required|image|max:10240', // 10MB
    ]);

    // Upload to Cloudinary
    $uploadResult = cloudinary_upload($request->file('image'), [
        'folder' => 'xylo-apparel/products',
        'transformation' => [
            'width' => 1200,
            'height' => 1200,
            'crop' => 'limit',
            'quality' => 'auto:best',
        ]
    ]);

    if ($uploadResult) {
        // Save product with image data
        $product = Product::create([
            'name' => $request->name,
            'image_public_id' => $uploadResult['public_id'],
            'image_url' => $uploadResult['url'],
            // ... other fields
        ]);

        return response()->json([
            'success' => true,
            'product' => $product,
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Image upload failed',
    ], 500);
}
```

---

### Multiple Image Upload

```php
public function uploadGallery(Request $request)
{
    $request->validate([
        'images' => 'required|array',
        'images.*' => 'image|max:10240',
    ]);

    $uploadedImages = [];

    foreach ($request->file('images') as $image) {
        $result = cloudinary_upload($image, [
            'folder' => 'xylo-apparel/products/gallery',
        ]);

        if ($result) {
            $uploadedImages[] = $result;
        }
    }

    return response()->json([
        'success' => true,
        'images' => $uploadedImages,
    ]);
}
```

---

### Delete Image

```php
public function destroy(Product $product)
{
    // Delete from Cloudinary
    if ($product->image_public_id) {
        cloudinary_delete($product->image_public_id);
    }

    // Delete from database
    $product->delete();

    return response()->json([
        'success' => true,
        'message' => 'Product deleted successfully',
    ]);
}
```

---

## 🎨 Image Transformations

### Predefined Transformations (from config)

```php
// Product thumbnail (300x300, cropped)
$thumbnailUrl = cloudinary_url($publicId, 'product_thumbnail');

// Product detail (800x800, limited)
$detailUrl = cloudinary_url($publicId, 'product_detail');

// Product gallery (1200x1200, best quality)
$galleryUrl = cloudinary_url($publicId, 'product_gallery');

// User avatar (200x200, rounded)
$avatarUrl = cloudinary_url($publicId, 'avatar');

// Banner (1920x600)
$bannerUrl = cloudinary_url($publicId, 'banner');
```

### Custom Transformations

```php
$customUrl = cloudinary_url($publicId, [
    'width' => 500,
    'height' => 500,
    'crop' => 'fill',
    'gravity' => 'auto',
    'quality' => 'auto:good',
    'radius' => 20, // Rounded corners
    'effect' => 'blur:300', // Blur effect
]);
```

---

## 📂 Folder Structure on Cloudinary

```
xylo-apparel/
├── products/
│   ├── {product_id}/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   └── general/
├── categories/
│   ├── category1.jpg
│   └── category2.jpg
├── banners/
│   ├── banner1.jpg
│   └── banner2.jpg
└── avatars/
    ├── user_1.jpg
    └── user_2.jpg
```

---

## 🔧 Database Schema Example

### Products Table

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->decimal('price', 10, 2);
    
    // Cloudinary fields
    $table->string('image_public_id')->nullable();
    $table->string('image_url')->nullable();
    
    // Multiple images (JSON)
    $table->json('gallery_images')->nullable();
    
    $table->timestamps();
});
```

### Storing Multiple Images

```php
// Upload multiple images
$galleryImages = [];
foreach ($request->file('gallery') as $image) {
    $result = cloudinary_upload($image, [
        'folder' => "xylo-apparel/products/{$product->id}/gallery",
    ]);
    
    if ($result) {
        $galleryImages[] = [
            'public_id' => $result['public_id'],
            'url' => $result['url'],
        ];
    }
}

// Save to database
$product->gallery_images = json_encode($galleryImages);
$product->save();
```

---

## 🎯 React Component Example (Frontend)

### ImageUpload Component

```jsx
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const ImageUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        setPreview(URL.createObjectURL(file));
        setUploading(true);

        // Upload to backend (which uploads to Cloudinary)
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'product');

        try {
            const response = await fetch('/api/cloudinary/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                onUploadSuccess(result.data);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block">
                <span className="sr-only">Choose image</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                />
            </label>

            {preview && (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                    />
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <div className="text-white">Uploading...</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
```

---

## ⚡ Best Practices

### 1. Always Use Transformations

```php
// ❌ Bad - sends full resolution
$url = $result['secure_url'];

// ✅ Good - optimized delivery
$url = cloudinary_url($publicId, [
    'quality' => 'auto',
    'fetch_format' => 'auto',
]);
```

### 2. Use Folders for Organization

```php
cloudinary_upload($file, [
    'folder' => 'xylo-apparel/products/' . $productId,
]);
```

### 3. Delete Old Images

```php
// When updating product image
if ($product->image_public_id) {
    cloudinary_delete($product->image_public_id);
}
```

### 4. Handle Upload Failures

```php
$result = cloudinary_upload($file);

if (!$result) {
    return back()->withErrors(['image' => 'Image upload failed']);
}
```

---

## 🔒 Security Tips

1. **Validate file types:**
   ```php
   $request->validate([
       'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
   ]);
   ```

2. **Limit file sizes** (10MB recommended for products)

3. **Use signed uploads** for sensitive data:
   ```php
   cloudinary_upload($file, [
       'signed' => true,
   ]);
   ```

4. **Never expose API secrets** in frontend code

---

## 📊 Cost Optimization

- Use `quality: 'auto'` for automatic compression
- Use `fetch_format: 'auto'` for optimal format (WebP, AVIF)
- Set reasonable image dimensions
- Use CDN caching (automatic with Cloudinary)
- Delete unused images regularly

---

## 🐛 Troubleshooting

### Upload fails with "Invalid credentials"

Check your `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Image not displaying

- Check if `image_url` is properly saved in database
- Verify the public_id format
- Check Cloudinary dashboard to confirm upload

### Transformation not working

- Ensure transformation name exists in `config/cloudinary.php`
- Check syntax of custom transformations

---

## 📚 Additional Resources

- [Cloudinary Laravel Documentation](https://cloudinary.com/documentation/laravel_integration)
- [Image Transformations Guide](https://cloudinary.com/documentation/image_transformations)
- [Cloudinary Dashboard](https://cloudinary.com/console)

---

## ✅ Next Steps

1. Run `composer install` to install the package
2. Set up your Cloudinary credentials in `.env`
3. Test upload with a simple controller
4. Integrate into your product/category management
5. Build React components for image uploads

Happy coding! 🚀
