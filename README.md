# XYLO APPAREL - Master Project Context & AI Instructions

> **AI ASSISTANT INSTRUCTIONS:** If you are an AI assistant (like ChatGPT or Claude) reading this document, this is the absolute source of truth for the project context. You must **STRICTLY** follow the rules, architecture, and UI requirements detailed below. Do not output pseudo-code. Do not overengineer. Do not redesign the UI unnecessarily. Ensure all code output is deployment-ready.

---

## 🛠 TECH STACK
- **Backend:** Laravel 12
- **Frontend:** Inertia.js + React
- **Styling:** Tailwind CSS (Pure utility classes, strictly no Blade UI for pages)
- **Database:** MySQL / DB compatible (like TiDB)

---

## 🏢 PROJECT CONTEXT
**Project Name:** XYLO APPAREL
**System Type:** E-Commerce Admin / Management Architecture
**Core Stakeholders:**
1. **Admin:** Master system controller (Seller + Inventory Manager)
2. **Buyers:** Customers browsing the storefront and placing orders
3. **Logistics:** Delivery and shipment flow tracking

**Handshake Logic:**
- **Buyers** create orders, interact with payment methods (COD/GCash), and generate reviews.
- **Logistics** update shipment statuses which dynamically reflect in the system.
- **Admins** oversee the entire handshake, possessing complete CRUD access over products, inventory, users, financial ledgers, and site customizations. 

---

## 🎨 UI / DESIGN LANGUAGE (STRICT)
- **Vibe:** Dark, Premium, and Enterprise Admin Dashboard.
- **Color Palette:** Strictly utilizes `slate-900` / `#0A0A0A` backgrounds, `teal-400` / `cyan-500` accents for active actions, and `emerald`/`amber` text badges for semantic statuses.
- **Components:** Glassmorphism layouts mapping gradients with backdrop blurs (e.g., `bg-slate-900/80 backdrop-blur-sm shadow-xl border border-slate-800/50`).
- **Data Rendering:** No raw HTML tables without proper styling. Empty states should *always* be rendered professionally if arrays are empty.

---

## ✅ MODULES CURRENTLY COMPLETED
*Do NOT rebuild these modules. Only interface with them when adding complementary features.*

1. **Catalog System:** Categories, Products (Create & View All).
2. **Inventory System:** Overview metrics, Stock Management, Low Stock Alerts.
3. **Marketing:** Promotions, Discount Codes, and standard Banners.
4. **Phase 1 - Commerce:** Orders, Payments Ledger, Shipments / Order Fulfillment, Product Reviews.
5. **Phase 4 - Analytics:** Sales Analytics, Product Performance, Inventory Reports (via `ReportController`).
6. **System & Auth:** Local Auth (Logout, Admin Roles), Database Logs, Basic User Management.

---

## 🚧 REMAINING BUILD TARGETS
*If instructed to build, complete these modules respecting proper standard foreign keys and React inertia architecture.*

**Phase 2 — Support Module**
- `Events`: Campaign-based groupings, scheduled start/end dates.
- `Messages`: Two-way admin inbox, message threads, unread states.

**Phase 3 — System Architecture**
- `Settings`: Global system config, payment overrides, inventory threshold configurations.
- `Site Customization`: Expandable storefront modifiers.

---

## 💾 DATABASE STRUCTURE & RULES
The database is heavily normalized. Follow clean Eloquent relationships. Existing core migrations include:
- `users`
- `categories`, `products`, `product_variants`, `product_images`
- `tags`, `product_tag`
- `discount_codes`
- `orders`, `payments`, `shipments`, `reviews`
- `events`, `messages` *[Models & Schemas Built, UI Pending]*
- `notifications`, `settings`, `archives`

**Database Integrity Rules:**
- Apply strict `$fillable` arrays to all Models.
- Implement proper foreign keys with `->onDelete('cascade')` when natively applicable.
- Leverage `SoftDeletes` correctly so crucial financial records are never entirely wiped from MySQL.

---

## ⚙️ OUTPUT FORMAT EXPECTATIONS (FOR AI)
When generating new code, always output in the following format:

**1. FILE STRUCTURE**
*(List exactly what files you are adding or touching)*

**2. FILE-BY-FILE CODE**
*(Output robust, un-truncated blocks labeled clearly)*
```language
// FILE: path/to/file.php
[CODE BLOCK]
```
