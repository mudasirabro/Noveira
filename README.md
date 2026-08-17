# 💎 Noveira — Luxury Fashion Atelier

> A modern luxury fashion house web portal for Women, Men, and Children.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Pages & Routes](#-pages--routes)
- [Admin Panel](#-admin-panel)
- [License](#-license)

---

## ✨ Features

### 🏠 Homepage
- Dynamic luxury hero with gold ambient gradients and interactive typography
- Category spotlight cards for **Women**, **Men**, and **Children**
- Infinite marquee banner ticker
- Curated collection sections & Atelier standards philosophy

### 🛍️ Product Listing & Filtering
- Responsive product grid with hover image zoom and glassmorphism overlays
- Multi-line filter tabs: **All Lines**, **Women**, **Men**, **Children**, and **Sale**
- Category filtering and sorting (Price low-high, high-low, highest rated)
- Instant search with hotkey (`Ctrl+K` / `Cmd+K`) and live result popup

### 📦 Product Details
- Interactive image zoom viewer
- Size and shade/color selection
- Real-time stock warnings & quick cart addition

### 🛒 Shopping Cart & Checkout
- SSR-safe cart state with local storage persistence
- Step-by-step luxury checkout flow (Shipping & Payment)
- Automated reference generation (`NOV-XXXX`) and order summary

### 🛠️ Admin Dashboard
- Client-side protected admin panel at `/admin`
- Overview statistics: Total revenue, pending dispatches, customer records, low stock alerts
- Order status tracking (Pending → Processing → Shipped → Delivered → Cancelled)
- Customer database and catalogue overview

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router & Turbopack |
| **TypeScript** | Strict type safety |
| **Tailwind CSS v4** | Dark luxury custom design system & utilities |
| **React Context API** | State management (Cart, Wishlist, Search, Recently Viewed) |
| **localStorage** | SSR-safe client data persistence |

---

## 📁 Project Structure

```
Noveira/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout & Metadata
│   ├── globals.css              # Dark luxury design system tokens & animations
│   ├── products/
│   │   ├── page.tsx             # Product listing & gender filters
│   │   └── [id]/
│   │       └── page.tsx         # Product details
│   ├── cart/
│   │   └── page.tsx             # Shopping bag
│   ├── checkout/
│   │   ├── page.tsx             # Checkout flow
│   │   └── success/
│   │       └── page.tsx         # Order confirmation
│   ├── search/
│   │   └── page.tsx             # Search page
│   └── admin/
│       ├── page.tsx             # Admin dashboard
│       └── login/
│           └── page.tsx         # Admin login
├── src/
│   ├── components/              # Header, Footer, ProductCard, SearchBar
│   ├── context/                 # Cart, Wishlist, Search, RecentlyViewed
│   ├── data/                    # Products catalog (Women, Men, Children)
│   └── lib/                     # Orders & Storage helpers
├── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Steps

**1. Clone your new repository**
```bash
git clone <YOUR_NEW_GITHUB_REPO_URL>
cd Noveira
```

**2. Install dependencies**
```bash
npm install
```

**3. Run development server**
```bash
npm run dev
```

**4. Open in browser**
```
http://localhost:3000
```

**5. Build for production**
```bash
npm run build
npm start
```

---

## 📍 Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Luxury landing page |
| Product Listing | `/products` | Catalog with gender & category filters |
| Product Details | `/products/[id]` | Individual garment viewer |
| Shopping Bag | `/cart` | Cart with order summary |
| Checkout | `/checkout` | Shipping and payment steps |
| Confirmation | `/checkout/success` | Order confirmation receipt |
| Wishlist | `/wishlist` | Saved favorite pieces |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin` | Store & order management |

---

## 📝 License

This project is open for custom deployment and usage under your own license.
