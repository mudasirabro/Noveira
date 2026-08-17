# 🗄️ NOVEIRA ATELIER — Supabase Database Integration Guide

This document contains all required information, exact table names, column specifications, SQL creation scripts, and API integration details for connecting **Noveira Atelier** to your **Supabase** PostgreSQL database on Vercel.

---

## 📋 Required Table Names & Schema Overview

To complete your setup in the Supabase Dashboard, create the following **4 Core Database Tables**:

1. **`products`** — Store garment catalogue (all 18 items), pricing, and live inventory levels.
2. **`orders`** — Store customer checkout orders, shipping information, and order status.
3. **`order_items`** — Store itemized line items associated with each customer order.
4. **`newsletter_subscribers`** — Store customer email subscriptions for the Private Access list.

---

## ⚡ Complete Setup (SQL Script for All 18 Products & RLS Policies)

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

-- ─── 5. ENABLE RLS & ADD PUBLIC ACCESSIBLE POLICIES ────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public select on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public select on products" ON public.products;
DROP POLICY IF EXISTS "Allow public update on products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert on newsletter_subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow public select on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public update on products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on newsletter_subscribers" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- ─── SEED ALL 18 PRODUCTS CATALOGUE DATA ──────────────────────────────
TRUNCATE TABLE public.products RESTART IDENTITY CASCADE;

INSERT INTO public.products (name, gender, category, price, price_num, sale_price, is_sale, image, description, stock, sizes, colors, rating, reviews_count) VALUES
('Silk Blend Wrap Blouse', 'Women', 'Blouses', 'Rs.12,900.00 PKR', 12900, 'Rs.8,900.00 PKR', true, 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop', 'A fluid silk-blend wrap blouse with a softly draped neckline and covered buttons.', 15, ARRAY['XS','S','M','L'], ARRAY['Ivory','Onyx'], 4.5, 12),
('Tailored Wool Trouser', 'Women', 'Trousers', 'Rs.16,400.00 PKR', 16400, 'Rs.11,900.00 PKR', true, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop', 'High-rise wool trousers with a pressed crease and a clean, elongating line.', 8, ARRAY['XS','S','M','L'], ARRAY['Charcoal','Camel'], 4.2, 8),
('Chiffon Evening Gown', 'Women', 'Evening', 'Rs.34,000.00 PKR', 34000, NULL, false, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop&q=80', 'A floor-length chiffon gown with a bias-cut skirt and hand-finished hem.', 20, ARRAY['S','M','L'], ARRAY['Champagne','Deep Plum'], 4.8, 15),
('Cashmere Boat-Neck Knit', 'Women', 'Knitwear', 'Rs.19,800.00 PKR', 19800, 'Rs.14,300.00 PKR', true, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop', 'Pure cashmere knit with a wide boat neckline and ribbed cuffs.', 5, ARRAY['XS','S','M','L'], ARRAY['Oat','Slate'], 4.0, 6),
('Pleated Midi Skirt', 'Women', 'Skirts', 'Rs.14,600.00 PKR', 14600, 'Rs.9,800.00 PKR', true, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', 'Knife-pleated midi skirt in a lightweight satin with a concealed zip.', 10, ARRAY['XS','S','M','L'], ARRAY['Pearl','Sage'], 4.4, 9),
('Structured Crepe Blazer', 'Women', 'Blazers', 'Rs.28,900.00 PKR', 28900, NULL, false, 'https://images.unsplash.com/photo-1548624313-0396a93cc90f?w=600&h=800&fit=crop', 'A single-breasted crepe blazer with sculpted shoulders and a nipped waist.', 25, ARRAY['XS','S','M','L'], ARRAY['Onyx','Ivory'], 4.9, 20),
('Quilted Leather Shoulder Bag', 'Women', 'Accessories', 'Rs.31,000.00 PKR', 31000, NULL, false, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop', 'Diamond-quilted calf leather with an antique-gold chain strap.', 30, ARRAY['One Size'], ARRAY['Black','Cognac'], 4.3, 7),
('Satin Wrap Dress', 'Women', 'Dresses', 'Rs.22,400.00 PKR', 22400, NULL, false, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop', 'Fluid satin wrap dress with a V-neckline and adjustable tie waist.', 14, ARRAY['XS','S','M','L','XL'], ARRAY['Midnight','Blush','Emerald'], 4.6, 18),
('Merino Wool Rollneck', 'Men', 'Knitwear', 'Rs.18,500.00 PKR', 18500, NULL, false, 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&h=800&fit=crop', 'Fine-gauge merino rollneck in a relaxed, modern silhouette.', 22, ARRAY['S','M','L','XL','XXL'], ARRAY['Navy','Charcoal','Camel'], 4.7, 14),
('Slim-Cut Suit', 'Men', 'Suits', 'Rs.48,000.00 PKR', 48000, 'Rs.36,000.00 PKR', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80', 'A slim two-piece suit in Italian wool blend with a half-canvas construction.', 8, ARRAY['48','50','52','54','56'], ARRAY['Midnight Navy','Charcoal'], 4.8, 11),
('Oxford Button-Down Shirt', 'Men', 'Shirts', 'Rs.9,800.00 PKR', 9800, NULL, false, 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&h=800&fit=crop', 'Crisp Oxford cloth shirt with a button-down collar and barrel cuffs.', 40, ARRAY['S','M','L','XL','XXL'], ARRAY['White','Light Blue','Pale Pink'], 4.4, 22),
('Tapered Chino Trouser', 'Men', 'Trousers', 'Rs.12,500.00 PKR', 12500, 'Rs.8,900.00 PKR', true, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop', 'Slim-tapered chino in stretch-cotton with a clean finish.', 18, ARRAY['28','30','32','34','36'], ARRAY['Stone','Olive','Navy'], 4.3, 16),
('Leather Derby Shoe', 'Men', 'Footwear', 'Rs.26,000.00 PKR', 26000, NULL, false, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=80', 'Full-grain calf leather derby on a leather sole with Goodyear welt.', 12, ARRAY['40','41','42','43','44','45'], ARRAY['Tan','Black'], 4.6, 8),
('Cashmere V-Neck Sweater', 'Men', 'Knitwear', 'Rs.22,000.00 PKR', 22000, NULL, false, 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&h=800&fit=crop', 'Two-ply cashmere V-neck with a classic fit and ribbed trims.', 15, ARRAY['S','M','L','XL'], ARRAY['Camel','Charcoal','Burgundy'], 4.5, 9),
('Mini Linen Playsuit', 'Children', 'Playsuits', 'Rs.5,800.00 PKR', 5800, NULL, false, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop&q=80', 'Breathable linen playsuit with snap buttons and adjustable straps.', 20, ARRAY['2Y','3Y','4Y','5Y','6Y'], ARRAY['Pale Blue','Sand','Mint'], 4.8, 13),
('Kids Merino Cardigan', 'Children', 'Knitwear', 'Rs.7,200.00 PKR', 7200, 'Rs.5,400.00 PKR', true, 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=800&fit=crop', 'Soft merino cardigan with wooden buttons and contrast ribbing.', 16, ARRAY['2Y','4Y','6Y','8Y','10Y'], ARRAY['Cream','Dusty Rose','Sky'], 4.6, 7),
('Junior Tailored Trouser', 'Children', 'Trousers', 'Rs.6,500.00 PKR', 6500, NULL, false, 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&h=800&fit=crop', 'Neatly tailored twill trousers with an elasticated waist for comfort.', 12, ARRAY['4Y','6Y','8Y','10Y','12Y'], ARRAY['Navy','Grey'], 4.4, 5),
('Girls Tulle Party Dress', 'Children', 'Dresses', 'Rs.9,800.00 PKR', 9800, 'Rs.7,200.00 PKR', true, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop', 'Layered tulle dress with a satin bodice and full skirt for special occasions.', 9, ARRAY['3Y','4Y','5Y','6Y','7Y','8Y'], ARRAY['Blush','Ivory','Lilac'], 4.9, 19);
```

---

## 🔍 Live Diagnostic API Endpoint

You can test your live connection by opening this URL in your browser after deploying to Vercel:

`https://your-domain.vercel.app/api/test-supabase`
