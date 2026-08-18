# 💎 NOVEIRA ATELIER — Italian Luxury Fashion Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Live_Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> **Noveira Atelier** is an enterprise-grade luxury e-commerce application designed for bespoke fashion lines across Women, Men, and Children. Built with Next.js 16 (App Router & Turbopack), TypeScript, Supabase PostgreSQL, and Supabase Storage.

---

## 🌐 Live Web Application & Demo

| Environment | Live Link | Status |
| :--- | :--- | :--- |
| **Production Storefront** | [https://noveira.vercel.app](https://noveira.vercel.app) | 🟢 Active |
| **Admin Portal** | [https://noveira.vercel.app/admin](https://noveira.vercel.app/admin) | 🔒 Protected |

---

## ✨ Key Features & Architectural Highlights

### 🛍️ Public Storefront Experience
- **Luxury Visual Identity:** Designed with an editorial Warm Ivory & Champagne Gold aesthetic, Cormorant Garamond typography, and smooth micro-interactions.
- **Dynamic Category Architecture:** Supports real-time custom category creation (e.g. `Jacket`, `Suits`, `Outerwear`). Newly added categories instantly sync across header navigation, mobile drawers, and catalog filter pills.
- **Real-Time Catalog & New Arrivals:** Dynamic filtering for `Women`, `Men`, `Children`, `New Arrivals` (newest products prioritized), and `Archive & Sale`.
- **Instant Search:** High-performance search with live query matching across garment titles, descriptions, and categories.
- **SSR & Client Hydration Resilience:** Shopping Bag and Wishlist states seamlessly synchronize between LocalStorage and dynamic Supabase APIs.

### 🛠️ Admin Management Portal (`/admin`)
- **Full Catalogue CRUD:** Add, Edit, and Delete garments with immediate, live database persistence in Supabase.
- **Supabase Storage Integration:** Local image file uploads are automatically processed, uploaded to the Supabase Storage bucket (`product-images`), and served via public CDN URLs.
- **Stock Control Stepper:** Live increment and decrement stock controls with automatic low-stock (`<= 5`) and sold-out notifications.
- **Order Pipeline & Status:** Full order fulfillment management (`Pending` → `Processing` → `Shipped` → `Delivered` → `Cancelled`).

### 🔒 Security, Row-Level Security (RLS) & Privacy
- **Zero Secrets Committed:** All private API keys, database credentials, and service role keys are managed strictly via `.env.local` and environment variables.
- **Supabase Server-Side RLS Integration:** Server API routes run securely using Node.js server clients, enforcing explicit database security rules without exposing keys to anon clients.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions & Route Handlers) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict type checking) |
| **Database** | [Supabase PostgreSQL](https://supabase.com/) (Live DB & Row Level Security) |
| **Storage** | [Supabase Storage](https://supabase.com/storage) (`product-images` CDN bucket) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Design Tokens |
| **Deployment** | [Vercel](https://vercel.com/) (Edge Serverless Hosting) |

---

## 📁 Project Directory Structure

```
Noveira/
├── app/
│   ├── page.tsx                 # Homepage with hero & curated collections
│   ├── layout.tsx               # Main layout & SEO Open Graph metadata
│   ├── globals.css              # Luxury design system tokens & animations
│   ├── products/
│   │   ├── page.tsx             # Collection catalog & dynamic category filters
│   │   └── [id]/
│   │       └── page.tsx         # Product detail viewer & purchase panel
│   ├── cart/                    # Shopping bag
│   ├── checkout/                # Multi-step checkout & success page
│   ├── search/                  # Real-time search engine page
│   ├── wishlist/                # Saved items page
│   ├── api/                     # Backend Server Route Handlers
│   │   ├── products/route.ts    # Live Products API & Storage Bucket Uploader
│   │   ├── orders/route.ts      # Live Orders & Items API
│   │   └── auth/route.ts        # Admin authentication endpoint
│   └── admin/                   # Store management dashboard & login
├── src/
│   ├── components/              # Header, Footer, ProductCard, Forms
│   ├── context/                 # Cart, Wishlist, Search, RecentlyViewed Contexts
│   ├── data/                    # Fallback products catalog
│   └── lib/                     # Supabase Server Client & Storage Uploader
├── .env.example                 # Safe environment variables template
├── SUPABASE_SETUP.md            # Complete Supabase SQL setup script
├── package.json
└── README.md
```

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Noveira.git
cd Noveira
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and add your private credentials:

```bash
cp .env.example .env.local
```

Inside `.env.local`, set your local configuration:
```ini
ADMIN_EMAIL=admin@noveira.com
ADMIN_PASSWORD=your_secure_password

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

> **Note:** `.env.local` is strictly listed in `.gitignore` to prevent any credentials from being pushed to source control.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Validation
```bash
npm run build
npm start
```

---

## 🗄️ Supabase Database Architecture

The project requires 4 relational tables and 1 public storage bucket:

1. **`products`** — Garment catalogue, prices, stock, categories, image CDN links.
2. **`orders`** — Customer orders, shipping details, total amount, status.
3. **`order_items`** — Line items attached to orders.
4. **`newsletter_subscribers`** — Subscribed customer emails.
5. **`product-images`** *(Storage Bucket)* — Public bucket hosting uploaded garment photos.

> For full table schema and SQL creation scripts, see [SUPABASE_SETUP.md](file:///d:/Noveira/Noveira/SUPABASE_SETUP.md).

---

## 📄 License & Attribution

Designed and engineered for **Noveira Atelier**. All rights reserved.
