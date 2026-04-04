# Cloudinary Integration - Quick Reference

## ✅ What's Been Added

### 1. Package Added
- `cloudinary-labs/cloudinary-laravel` in `composer.json`

### 2. Configuration Files
- `config/cloudinary.php` - Main configuration with predefined transformations
- `.env.example` - Updated with Cloudinary variables

### 3. Helper Functions
- `app/helpers.php` - Three helper functions:
  - `cloudinary_upload()` - Upload files
  - `cloudinary_delete()` - Delete files
  - `cloudinary_url()` - Get transformed URLs

### 4. Documentation
- `CLOUDINARY_SETUP.md` - Complete integration guide
- `INSTALLATION.md` - Full project setup guide

---

## 🚀 Quick Start

### 1. Install the Package

```bash
composer install
composer dump-autoload
```

### 2. Configure Credentials

Add to your `.env` file:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get credentials from: https://cloudinary.com/console

### 3. Test the Integration

```php
// In any controller:
$result = cloudinary_upload($request->file('image'));

if ($result) {
    echo $result['url']; // Image URL
    echo $result['public_id']; // For future reference
}
```

---

## 📝 Common Use Cases

### Upload Product Image

```php
public function store(Request $request)
{
    $request->validate([
        'image' => 'required|image|max:10240',
    ]);

    $result = cloudinary_upload($request->file('image'), [
        'folder' => 'xylo-apparel/products',
    ]);

    if ($result) {
        Product::create([
            'name' => $request->name,
            'image_public_id' => $result['public_id'],
            'image_url' => $result['url'],
        ]);
    }
}
```

### Get Different Image Sizes

```php
// Thumbnail (300x300)
$thumbnail = cloudinary_url($publicId, 'product_thumbnail');

// Detail view (800x800)
$detail = cloudinary_url($publicId, 'product_detail');

// Gallery (1200x1200)
$gallery = cloudinary_url($publicId, 'product_gallery');
```

### Delete Image

```php
public function destroy(Product $product)
{
    // Delete from Cloudinary
    cloudinary_delete($product->image_public_id);
    
    // Delete from database
    $product->delete();
}
```

---

## 🎨 Predefined Transformations

Available transformations (defined in `config/cloudinary.php`):

1. **product_thumbnail** - 300x300, cropped
2. **product_detail** - 800x800, limited
3. **product_gallery** - 1200x1200, best quality
4. **avatar** - 200x200, circular, face-focused
5. **banner** - 1920x600, for promotions

### Usage:

```php
// Use predefined transformation
$url = cloudinary_url($publicId, 'product_thumbnail');

// Or custom transformation
$url = cloudinary_url($publicId, [
    'width' => 500,
    'height' => 500,
    'crop' => 'fill',
    'quality' => 'auto',
]);
```

---

## 📂 Recommended Folder Structure

```
xylo-apparel/
├── products/
│   ├── 1/              (product ID)
│   │   ├── main.jpg
│   │   └── gallery/
│   ├── 2/
│   └── ...
├── categories/
├── banners/
└── avatars/
```

### Implementation:

```php
// Product image
cloudinary_upload($file, [
    'folder' => "xylo-apparel/products/{$productId}",
]);

// Category image
cloudinary_upload($file, [
    'folder' => 'xylo-apparel/categories',
]);

// User avatar
cloudinary_upload($file, [
    'folder' => 'xylo-apparel/avatars',
    'public_id' => "user_{$userId}",
]);
```

---

## 🔒 Validation Best Practices

```php
$request->validate([
    // Single image
    'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
    
    // Multiple images
    'images' => 'required|array|max:10',
    'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
    
    // Avatar (smaller size limit)
    'avatar' => 'required|image|max:5120', // 5MB
]);
```

---

## 📊 Database Schema Example

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    
    // Single main image
    $table->string('image_public_id')->nullable();
    $table->string('image_url')->nullable();
    
    // Multiple gallery images (JSON)
    $table->json('gallery_images')->nullable();
    
    $table->timestamps();
});
```

### Storing Multiple Images:

```php
$galleryImages = [];

foreach ($request->file('gallery') as $image) {
    $result = cloudinary_upload($image);
    if ($result) {
        $galleryImages[] = [
            'public_id' => $result['public_id'],
            'url' => $result['url'],
        ];
    }
}

$product->gallery_images = json_encode($galleryImages);
$product->save();
```

---

## ⚡ Performance Tips

1. **Always use transformations** for delivery:
   ```php
   cloudinary_url($publicId, 'product_detail')
   ```

2. **Enable auto optimization**:
   ```php
   cloudinary_upload($file, [
       'quality' => 'auto',
       'fetch_format' => 'auto',
   ]);
   ```

3. **Delete unused images**:
   ```php
   // When updating product image
   if ($oldPublicId) {
       cloudinary_delete($oldPublicId);
   }
   ```

---

## 🐛 Troubleshooting

### "Call to undefined function cloudinary_upload()"

Run:
```bash
composer dump-autoload
```

### "Invalid credentials"

Check `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### Upload works but image not displaying

- Check if URL is saved correctly in database
- Verify public_id format
- Check Cloudinary Media Library

---

## 📚 Full Documentation

For complete documentation with React examples and advanced features, see:

- **`CLOUDINARY_SETUP.md`** - Complete integration guide
- **`INSTALLATION.md`** - Project setup guide
- [Cloudinary Laravel Docs](https://cloudinary.com/documentation/laravel_integration)

---

## ✅ Next Steps

1. ✅ Run `composer install`
2. ✅ Add credentials to `.env`
3. ✅ Test with simple upload
4. → Build product CRUD with images
5. → Add category images
6. → Implement user avatars
7. → Create banner management

---

Ready to use! 🚀
