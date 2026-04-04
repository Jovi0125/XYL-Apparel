# Categories Module - Quick Setup Guide

## ✅ Files Created

### Frontend Components
- `resources/js/Pages/Admin/CategoriesIndex.jsx` - Main categories page
- `resources/js/Components/admin/CategoryForm.jsx` - Category creation form (left side)
- `resources/js/Components/admin/CategoryGrid.jsx` - Categories grid display
- `resources/js/Components/admin/CategoryCard.jsx` - Individual category card
- `resources/js/Components/admin/CategoryEmptyState.jsx` - Empty state component

### Backend Files
- `database/migrations/2026_04_04_000001_create_categories_table.php` - Database schema
- `app/Models/Category.php` - Category model
- `app/Http/Controllers/Admin/CategoryController.php` - Controller with CRUD operations

### Updated Files
- `routes/web.php` - Added category routes
- `resources/js/Components/admin/AdminSidebar.jsx` - Updated categories link

---

## 🚀 Setup Instructions

### 1. Run Migration

```bash
php artisan migrate
```

This creates the `categories` table with:
- id, name, parent_category, description
- image_public_id, image_url (Cloudinary ready)
- status (active/inactive)
- timestamps

### 2. Start Servers

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

### 3. Access Categories Page

Navigate to: **http://127.0.0.1:8000/admin/categories**

Or click **Catalog → Categories** in the sidebar.

---

## 📋 Features

### Category Form (Left Side)
- **Name** - text input (required)
- **Parent Category** - select: Men / Women / Unisex (required)
- **Description** - textarea (optional)
- **Image Upload** - drag & drop, preview, Cloudinary-ready
- **Status** - toggle: Active / Inactive
- **Submit Button** - "Add Category"

### Categories Display (Center/Right)
- **Search Bar** - filter by name/description
- **Parent Filter** - filter by Men/Women/Unisex
- **Status Filter** - filter by active/inactive
- **Results Count** - shows filtered count
- **Grid Layout** - responsive 2-column grid

### Category Cards Show
- Category name
- Parent category badge (colored by type)
- Description
- Image thumbnail (or placeholder)
- Status badge
- Products count (placeholder: 0 products)
- Actions menu

### Empty State
- Displays when no categories exist
- Clean icon and message
- Directs user to form

---

## 🎨 Design Features

- **Dark Premium UI** - slate-900/950 backgrounds
- **Gradient Accents** - blue/violet subtle glows
- **Responsive Layout** - mobile to desktop
- **Hover Effects** - cards lift and glow
- **Status Indicators** - colored badges
- **Parent Badges** - Men (blue), Women (pink), Unisex (violet)

---

## 🔌 API Endpoints

### Available Routes

```
GET    /admin/categories          → index (list all)
POST   /admin/categories          → store (create new)
PUT    /admin/categories/{id}     → update (edit existing)
DELETE /admin/categories/{id}     → destroy (delete)
```

### Form Submission

The form in `CategoryForm.jsx` posts to `/admin/categories` with:
- Uses Inertia.js `post()` method
- Preserves scroll on success
- Resets form after creation
- Shows validation errors

---

## 📸 Image Upload Integration

### Current Setup
- Frontend shows drag & drop upload UI
- Preview displays before submission
- Ready for Cloudinary integration

### How It Works
1. User uploads image in form
2. Backend receives file in `CategoryController@store`
3. If Cloudinary helpers exist, uploads to cloud:
   ```php
   cloudinary_upload($request->file('image'), [
       'folder' => 'xylo-apparel/categories',
   ]);
   ```
4. Saves `image_public_id` and `image_url` to database

### Cloudinary Setup
If Cloudinary is configured (see `CLOUDINARY_SETUP.md`):
- Images automatically upload to cloud
- CDN URLs stored in database
- Old images deleted on update

If not configured:
- Images will be skipped (no errors)
- Categories work without images

---

## 🗂️ Database Schema

```sql
categories
├── id (bigint)
├── name (varchar)
├── parent_category (enum: Men, Women, Unisex)
├── description (text, nullable)
├── image_public_id (varchar, nullable)  -- Cloudinary
├── image_url (varchar, nullable)        -- Cloudinary
├── status (enum: active, inactive)
├── created_at (timestamp)
└── updated_at (timestamp)
```

---

## 🧪 Testing

### Test Empty State
1. Go to `/admin/categories`
2. Should see empty state if no categories

### Test Category Creation
1. Fill out form on left:
   - Name: "T-Shirts"
   - Parent: "Men"
   - Description: "Men's T-shirts collection"
   - Status: "Active"
2. Click "Add Category"
3. Should see new card appear on right

### Test Filters
1. Create multiple categories with different parents
2. Use parent filter dropdown
3. Use status filter
4. Use search bar

---

## 🔧 Customization

### Change Parent Categories
Edit in migration and model:
```php
// Migration
$table->enum('parent_category', ['Men', 'Women', 'Kids', 'Unisex']);

// Update form select options in CategoryForm.jsx
```

### Add More Statuses
```php
// Migration
$table->enum('status', ['active', 'inactive', 'draft']);
```

### Modify Card Display
Edit `CategoryCard.jsx` to show different fields or layout.

---

## 🚨 Important Notes

- **No slug field** - removed as requested
- **No subcategories** - categories are flat under parent types
- **Products count is placeholder** - shows "0 products" until products module built
- **Cloudinary optional** - works with or without image uploads
- **Empty states** - all components handle no data gracefully

---

## ✅ Next Steps

1. ✅ Run migration
2. ✅ Start servers
3. ✅ Test category creation
4. → Build Products module
5. → Connect products to categories
6. → Update products_count to show real data

---

Ready to use! 🎉
