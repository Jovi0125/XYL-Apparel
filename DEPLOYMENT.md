# XYLO APPAREL — Free Deployment Guide

> Deploy your Laravel 12 e-commerce app **100% free** using **Render** (web hosting), **Supabase** (PostgreSQL database), and **Supabase Storage** (product images & files).

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Step 1 — Push Code to GitHub](#step-1--push-code-to-github)
4. [Step 2 — Create a Supabase Project (Database)](#step-2--create-a-supabase-project-database)
5. [Step 3 — Create a Supabase Storage Bucket (Images)](#step-3--create-a-supabase-storage-bucket-images)
6. [Step 4 — Update Laravel for Supabase Storage](#step-4--update-laravel-for-supabase-storage)
7. [Step 5 — Deploy to Render (Free Web Service)](#step-5--deploy-to-render-free-web-service)
8. [Step 6 — Run Migrations & Seed](#step-6--run-migrations--seed)
9. [Step 7 — Verify Everything Works](#step-7--verify-everything-works)
10. [Free Tier Limits](#free-tier-limits)
11. [Test Accounts](#test-accounts)
12. [Troubleshooting](#troubleshooting)

---

## 1. Architecture Overview

```
┌──────────────┐       ┌────────────────────┐       ┌─────────────────────┐
│   Browser    │◄─────►│   Render (PHP)     │◄─────►│ Supabase PostgreSQL │
│              │       │   Free Web Service │       │   (Free Tier)       │
└──────────────┘       └────────┬───────────┘       └─────────────────────┘
                                │
                                ▼
                       ┌────────────────────┐
                       │  Supabase Storage  │
                       │  (Images / Files)  │
                       │  S3-compatible     │
                       └────────────────────┘
```

| Component       | Service           | Free Tier                          |
|-----------------|-------------------|------------------------------------|
| Web Hosting     | Render            | 750 hours/month (always free)      |
| Database        | Supabase          | 500 MB PostgreSQL, 2 projects      |
| File Storage    | Supabase Storage  | 1 GB storage, 2 GB bandwidth/month |
| Version Control | GitHub            | Unlimited public/private repos     |

---

## 2. Prerequisites

- A **GitHub** account — [github.com](https://github.com)
- A **Supabase** account — [supabase.com](https://supabase.com)
- A **Render** account — [render.com](https://render.com)
- **Git** installed locally
- **Composer** & **Node.js** installed locally (for building assets before deploy)

---

## Step 1 — Push Code to GitHub

If you haven't already, create a GitHub repository and push your code:

```bash
cd XYLO_APPAREL

# Initialize git (skip if already a repo)
git init
git branch -M main

# Create a .gitignore (Laravel already has one)
# Make sure /vendor and /node_modules are ignored

git add .
git commit -m "Initial commit – XYLO APPAREL"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/xylo-apparel.git
git push -u origin main
```

---

## Step 2 — Create a Supabase Project (Database)

### 2.1 Create the project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name:** `xylo-apparel`
   - **Database Password:** (save this somewhere safe!)
   - **Region:** Choose the closest to your users (e.g., `Southeast Asia (Singapore)`)
4. Click **"Create new project"** and wait ~2 minutes

### 2.2 Get your database credentials

1. In your Supabase dashboard, go to **Settings → Database**
2. Scroll to **"Connection parameters"** and note down:

| Parameter | Example Value                               |
|-----------|---------------------------------------------|
| Host      | `db.xxxxxxxxxxxx.supabase.co`               |
| Port      | `5432`                                      |
| Database  | `postgres`                                  |
| User      | `postgres`                                  |
| Password  | *(the password you set during project creation)* |

3. Alternatively, copy the **Connection String (URI)** — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```

### 2.3 Test the connection locally (optional)

Update your local `.env` to test:

```env
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
```

Then run:

```bash
php artisan migrate
php artisan db:seed
```

If it works, your Supabase database is ready!

---

## Step 3 — Create a Supabase Storage Bucket (Images)

Supabase Storage is **S3-compatible**, so Laravel can use it with the S3 driver.

### 3.1 Create a public bucket

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click **"New Bucket"**
3. Set:
   - **Name:** `xylo-public`
   - **Public bucket:** ✅ Toggle ON (so product images are publicly accessible)
4. Click **"Create bucket"**

### 3.2 Set a bucket policy (allow public reads)

The bucket is public, but you need to add a **Storage Policy** for public access:

1. Click on the `xylo-public` bucket
2. Go to **Policies** tab
3. Click **"New Policy"** → **"For full customization"**
4. Set:
   - **Policy name:** `Allow public read`
   - **Allowed operation:** `SELECT`
   - **Target roles:** leave empty (applies to everyone)
   - **Policy definition:** `true`
5. Click **"Review"** → **"Save policy"**

Also create an **INSERT/UPDATE/DELETE policy** for authenticated uploads:

1. Click **"New Policy"** → **"For full customization"**
2. Set:
   - **Policy name:** `Allow authenticated uploads`
   - **Allowed operations:** `INSERT`, `UPDATE`, `DELETE`
   - **Target roles:** `authenticated` (or use `true` for simplicity since your Laravel backend manages auth)
   - **Policy definition:** `true`
3. Save the policy

### 3.3 Get your Storage credentials

1. Go to **Settings → API**
2. Note down:
   - **Project URL:** `https://xxxxxxxxxxxx.supabase.co`
   - **Service role key (secret):** `eyJhbG...` (under "service_role" — keep this private!)

Your S3-compatible credentials will be:

| Laravel `.env` Variable       | Value                                                |
|-------------------------------|------------------------------------------------------|
| `AWS_ACCESS_KEY_ID`           | Your Supabase **service_role** key                   |
| `AWS_SECRET_ACCESS_KEY`       | Your Supabase **service_role** key (same value)      |
| `AWS_DEFAULT_REGION`          | `us-east-1` (any valid region string)                |
| `AWS_BUCKET`                  | `xylo-public`                                        |
| `AWS_ENDPOINT`                | `https://xxxxxxxxxxxx.supabase.co/storage/v1/s3`     |
| `AWS_URL`                     | `https://xxxxxxxxxxxx.supabase.co/storage/v1/object/public/xylo-public` |
| `AWS_USE_PATH_STYLE_ENDPOINT` | `true`                                               |

---

## Step 4 — Update Laravel for Supabase Storage

### 4.1 Install the S3 Flysystem adapter

```bashhheh
composer require league/flysystem-aws-s3-v3 "^3.0"
```

Commit this change (it updates `composer.json` and `composer.lock`).

### 4.2 Switch the filesystem disk

In your `.env` (and later in Render's environment variables):

```env
FILESYSTEM_DISK=s3
```

### 4.3 Update image upload code (if needed)

Your product images currently save with:

```php
$image->store('products', 'public');
```

Change `'public'` to `'s3'` — **OR** simply set `FILESYSTEM_DISK=s3` and use the default disk:

```php
$image->store('products');  // uses default disk (now s3)
```

**Files that need updating** (search for `'public'` disk usage):

| File | What to change |
|------|---------------|
| `app/Http/Controllers/Seller/ProductController.php` | `$image->store('products', 'public')` → `$image->store('products')` |
| `app/Http/Controllers/Logistics/ProofOfDeliveryController.php` | `->store('proof-of-delivery/photos', 'public')` → `->store('proof-of-delivery/photos')` |
| `app/Http/Controllers/Logistics/ProofOfDeliveryController.php` | `->store('proof-of-delivery/signatures', 'public')` → `->store('proof-of-delivery/signatures')` |

### 4.4 Update image display in Blade templates

Currently images might use `asset('storage/...')` or `Storage::url(...)`. Update them to use:

```php
// Before (local storage)
<img src="{{ asset('storage/' . $image->path) }}">

// After (S3/Supabase)
<img src="{{ Storage::disk('s3')->url($image->path) }}">

// OR if FILESYSTEM_DISK=s3, simply:
<img src="{{ Storage::url($image->path) }}">
```

Since `AWS_URL` is set, `Storage::url()` will return the full public Supabase URL.

### 4.5 Commit all changes

```bash
git add .
git commit -m "Switch to Supabase Storage (S3-compatible)"
git push origin main
```

---

## Step 5 — Deploy to Render (Free Web Service)

### 5.1 Create a `render.yaml` (optional but recommended)

Create a file called `render.yaml` in your project root:

```yaml
services:
  - type: web
    name: xylo-apparel
    runtime: php
    plan: free
    buildCommand: |
      composer install --no-dev --optimize-autoloader
      npm install
      npm run build
      php artisan config:cache
      php artisan route:cache
      php artisan view:cache
    startCommand: php artisan serve --host=0.0.0.0 --port=$PORT
    envVars:
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: "false"
      - key: APP_KEY
        generateValue: true
```

### 5.2 Create the web service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your **GitHub** account and select the `xylo-apparel` repo
4. Configure:

| Setting        | Value                                           |
|----------------|-------------------------------------------------|
| **Name**       | `xylo-apparel`                                  |
| **Region**     | Singapore (or closest)                          |
| **Branch**     | `main`                                          |
| **Runtime**    | `PHP` (or Docker if PHP isn't available)        |
| **Build Command** | `composer install --no-dev --optimize-autoloader && npm install && npm run build && php artisan config:cache && php artisan route:cache && php artisan view:cache` |
| **Start Command** | `php artisan serve --host=0.0.0.0 --port=$PORT` |
| **Plan**       | **Free**                                        |

### 5.3 Add Environment Variables on Render

In the Render dashboard, go to your service → **Environment** → **Add Environment Variable**:

```env
APP_NAME="XYLO APPAREL"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:GENERATE_ONE_WITH_php_artisan_key:generate
APP_URL=https://xylo-apparel.onrender.com

DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-supabase-service-role-key
AWS_SECRET_ACCESS_KEY=your-supabase-service-role-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=xylo-public
AWS_ENDPOINT=https://xxxxxxxxxxxx.supabase.co/storage/v1/s3
AWS_URL=https://xxxxxxxxxxxx.supabase.co/storage/v1/object/public/xylo-public
AWS_USE_PATH_STYLE_ENDPOINT=true

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

> **Tip:** Generate `APP_KEY` locally with `php artisan key:generate --show` and paste the output.

### 5.4 Deploy

Click **"Create Web Service"**. Render will:

1. Clone your repo
2. Run the build command (install deps, build Vite assets, cache configs)
3. Start the PHP server

Your app will be live at: `https://xylo-apparel.onrender.com`

---

## Step 6 — Run Migrations & Seed

### Option A: Via Render Shell

1. In Render dashboard, go to your service → **Shell**
2. Run:

```bash
php artisan migrate --force
php artisan db:seed --force
```

### Option B: Add to Build Command

Update the build command to include migrations automatically:

```
composer install --no-dev --optimize-autoloader && npm install && npm run build && php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache
```

> ⚠️ Only include `db:seed` in the build command for the **first deployment**. Remove it afterwards to avoid duplicate data.

---

## Step 7 — Verify Everything Works

1. **Visit** your Render URL: `https://xylo-apparel.onrender.com`
2. **Log in** with a test account (see below)
3. **Upload a product image** as a seller — verify it shows up (image is stored in Supabase Storage)
4. **Place a test order** as a customer
5. **Check Supabase dashboard** → Storage → `xylo-public` bucket to see uploaded files

---

## Free Tier Limits

| Service           | Free Tier Limit                              | What Happens When Exceeded    |
|-------------------|----------------------------------------------|-------------------------------|
| **Render**        | 750 hours/month, sleeps after 15 min idle    | Cold start takes ~30–60 sec   |
| **Supabase DB**   | 500 MB, 2 projects                           | Project may be paused after 1 week of inactivity |
| **Supabase Storage** | 1 GB storage, 2 GB transfer/month         | Uploads/downloads will fail   |

### Tips to stay within free limits:

- **Render cold starts:** The free tier "sleeps" after 15 minutes of no traffic. First request after sleeping takes ~30–60 seconds. This is normal.
- **Supabase pausing:** Supabase may pause free projects after 1 week of inactivity. Just click "Restore" in the dashboard to bring it back.
- **Compress images:** Compress product images before upload to save storage space (use TinyPNG or similar).
- **Limit seeder images:** The seeder data uses placeholder URLs, so it won't consume storage.

---

## Test Accounts

All seeded accounts use the password: **`password`**

| Role       | Name          | Email               |
|------------|---------------|---------------------|
| Admin      | Admin         | `admin@xylo.com`    |
| Seller     | Test Seller   | `seller@xylo.com`   |
| Seller     | Maria Santos  | `maria@xylo.com`    |
| Seller     | Jake Reyes    | `jake@xylo.com`     |
| Customer   | Test Customer | `customer@xylo.com` |
| Customer   | Ana Lopez     | `ana@xylo.com`      |
| Customer   | Carlos Tan    | `carlos@xylo.com`   |
| Logistics  | Test Courier  | `logistics@xylo.com`|

---

## Troubleshooting

### "500 Server Error" after deploy

- Check `APP_KEY` is set in Render environment variables
- Check `APP_DEBUG=true` temporarily to see the actual error
- Check Render logs for PHP errors

### "Could not find driver" (database error)

- Make sure `DB_CONNECTION=pgsql` is set
- Render's PHP runtime includes the `pgsql` extension by default

### Images not showing

- Verify `FILESYSTEM_DISK=s3` is set
- Check that `AWS_URL` points to the **public** URL of your Supabase bucket
- Make sure the Supabase Storage bucket is set to **public**
- Verify the storage policy allows `SELECT` for everyone

### "Connection refused" to database

- Double-check your Supabase host, port, and password
- Go to Supabase → Settings → Database and verify the connection info
- Make sure the project is not paused (free tier pauses after inactivity)

### Slow first load

- This is normal on Render's free tier — the app sleeps after 15 minutes of inactivity
- First request after sleep takes ~30–60 seconds to "cold start"
- Subsequent requests are fast

### Vite assets not loading (broken CSS/JS)

- Make sure `npm run build` is in your build command
- Verify that `public/build/manifest.json` exists after build
- Check that `APP_URL` matches your actual Render URL

---

## Alternative Free Hosting Options

If Render doesn't work well for you, here are other free options:

| Service             | Type         | Notes                                    |
|---------------------|--------------|------------------------------------------|
| **Railway**         | Full-stack   | 500 hours/month free, $5 credit          |
| **Vercel**          | Serverless   | Requires adapter; not ideal for Laravel  |
| **Fly.io**          | Containers   | Generous free tier, needs Docker setup   |
| **InfinityFree**    | Shared PHP   | Traditional PHP hosting, unlimited sites |
| **000webhost**      | Shared PHP   | Free PHP hosting with MySQL              |

> **Recommended combo for zero cost:** Render (hosting) + Supabase (database + storage) gives you the best developer experience with a fully free stack.

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Supabase project created (database credentials noted)
- [ ] Supabase Storage bucket `xylo-public` created (public, with policies)
- [ ] `league/flysystem-aws-s3-v3` installed via Composer
- [ ] Image upload code updated to use S3 disk
- [ ] Render web service created and connected to GitHub
- [ ] All environment variables set on Render
- [ ] Migrations run (`php artisan migrate --force`)
- [ ] Database seeded (`php artisan db:seed --force`)
- [ ] Test login and image upload working
- [ ] `APP_DEBUG` set back to `false`

---

*Last updated: February 2026*
