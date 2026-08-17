# 🗄️ NOVEIRA ATELIER — Supabase Database Integration Guide

This document contains all required information, exact table names, column specifications, SQL creation scripts, and API integration details for connecting **Noveira Atelier** to your **Supabase** PostgreSQL database on Vercel.

---

## 📋 Required Table Names & Schema Overview

To complete your manual setup in the Supabase Dashboard, create the following **4 Core Database Tables**:

1. **`products`** — Store garment catalogue, pricing, and live inventory levels.
2. **`orders`** — Store customer checkout orders, shipping information, and order status.
3. **`order_items`** — Store itemized line items associated with each customer order.
4. **`newsletter_subscribers`** — Store customer email subscriptions for the Private Access list.

---

## ⚡ Quick One-Click Setup (SQL Script)

Instead of creating tables manually line-by-line, you can create all tables and indexes automatically:

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your **Noveira** project.
3. Click on **SQL Editor** in the left sidebar.
4. Click **New query**, paste the SQL script below, and click **Run**.

```sql
-- ─── 1. PRODUCTS TABLE ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Women', 'Men', 'Children')),
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    price_num NUMERIC NOT NULL,
    sale_price TEXT,
    is_sale BOOLEAN DEFAULT false,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 10,
    sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL'],
    colors TEXT[] DEFAULT ARRAY['Default'],
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. ORDERS TABLE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT DEFAULT 'Karachi',
    payment_method TEXT DEFAULT 'Cash on Delivery',
    subtotal NUMERIC NOT NULL,
    shipping NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    placed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. ORDER ITEMS TABLE ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL,
    product_name TEXT NOT NULL,
    size TEXT DEFAULT 'M',
    color TEXT DEFAULT 'Default',
    quantity INTEGER NOT NULL DEFAULT 1,
    price TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. NEWSLETTER SUBSCRIBERS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SEED PRODUCTS CATALOGUE DATA ─────────────────────────────────────
INSERT INTO public.products (name, gender, category, price, price_num, sale_price, is_sale, image, description, stock, sizes, colors, rating, reviews_count) VALUES
('Silk Trench Coat', 'Women', 'Outerwear', 'PKR 65,000', 65000, 'PKR 52,000', true, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&h=1200&fit=crop&q=85', 'Double-breasted silk-blend trench with belted waist and custom horn buttons.', 8, ARRAY['XS','S','M','L'], ARRAY['Champagne','Espresso'], 4.9, 14),
('Cashmere Wrap Dress', 'Women', 'Dresses', 'PKR 48,000', 48000, NULL, false, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&h=1200&fit=crop&q=85', 'Pure Mongolian cashmere wrap dress with fluid drape and ribbed cuffs.', 12, ARRAY['S','M','L'], ARRAY['Ivory','Charcoal'], 5.0, 22),
('Structured Wool Blazer', 'Women', 'Blazers', 'PKR 58,000', 58000, 'PKR 46,000', true, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85', 'Tailored Italian wool blazer with structured shoulders and silk lining.', 5, ARRAY['S','M','L','XL'], ARRAY['Espresso'], 4.8, 9),
('Double-Breasted Overcoat', 'Men', 'Suits', 'PKR 85,000', 85000, NULL, false, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=1200&fit=crop&q=85', 'Heavyweight cashmere-wool blend overcoat with hand-stitched lapels.', 4, ARRAY['48R','50R','52R'], ARRAY['Midnight','Camel'], 4.9, 18),
('Merino Polo Sweater', 'Men', 'Knitwear', 'PKR 32,000', 32000, 'PKR 25,000', true, 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&h=1200&fit=crop&q=85', 'Fine-gauge merino wool polo with mother-of-pearl buttons.', 15, ARRAY['S','M','L','XL'], ARRAY['Taupe','Black'], 4.7, 11),
('Silk Velvet Evening Gown', 'Women', 'Evening', 'PKR 92,000', 92000, NULL, false, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&h=1200&fit=crop&q=85', 'Floor-length silk velvet dress with open back and concealed side zip.', 3, ARRAY['XS','S','M'], ARRAY['Emerald','Black'], 5.0, 31),
('Mini Cashmere Knit Set', 'Children', 'Knitwear', 'PKR 28,000', 28000, NULL, false, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&h=1200&fit=crop&q=85', 'Ultra-soft organic cashmere sweater and trousers set for toddlers.', 10, ARRAY['2Y','4Y','6Y'], ARRAY['Cream','Soft Taupe'], 4.9, 8),
('Tailored Linen Trouser', 'Men', 'Trousers', 'PKR 36,000', 36000, 'PKR 29,000', true, 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=900&h=1200&fit=crop&q=85', 'Relaxed-fit pure linen trousers with side adjusters and double pleats.', 7, ARRAY['30','32','34','36'], ARRAY['Sand','Navy'], 4.6, 16);
```

---

## 🛠️ API Routes Integrated

The codebase has been fully equipped with API endpoints that sync seamlessly with Supabase while keeping zero-downtime local fallbacks:

| API Route | Supported Methods | Description |
| :--- | :--- | :--- |
| `/api/products` | `GET`, `PATCH` | Fetch catalog & update product stock quantity |
| `/api/orders` | `GET`, `POST`, `PATCH` | Fetch all orders, place new checkout orders, update order status |
| `/api/newsletter` | `POST` | Subscribe emails to the Private Access list |

---

## 🔑 Environment Variables Configured

Vercel Marketplace automatically injects these into your project. If testing locally in `.env.local`, ensure these keys are present:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## ✅ Seamless Fallback Guarantee

If Supabase keys are not set up or temporary database maintenance occurs, **Noveira Atelier** will automatically fallback to local memory and `localStorage` persistence. The store will **never crash** or block customer checkouts.
