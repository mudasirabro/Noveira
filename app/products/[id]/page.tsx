'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { useRecentlyViewed } from '@/src/context/RecentlyViewedContext';
import { useWishlist } from '@/src/context/WishlistContext';
import ProductCard from '@/src/components/ProductCard';
import { getProductById, products as fallbackProducts, Product, parsePrice } from '@/src/data/products';

export default function ProductDetailsPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { addRecentlyViewed } = useRecentlyViewed();
  const { toggleWishlist, isInWishlist, hydrated: wishlistHydrated } = useWishlist();

  const id = Number.parseInt(params.id as string, 10);

  const [allProducts, setAllProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const hasLoggedView = useRef(false);

  // Fetch latest products from Supabase / API route
  useEffect(() => {
    let cancelled = false;

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setAllProducts(data.data);
        }
      })
      .catch((err) => console.error('Product details API error:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const product = useMemo(() => {
    return allProducts.find((p) => Number(p.id) === Number(id)) ?? getProductById(id) ?? null;
  }, [allProducts, id]);

  useEffect(() => {
    if (product && !hasLoggedView.current) {
      addRecentlyViewed(product);
      hasLoggedView.current = true;
    }
  }, [product, addRecentlyViewed]);

  useEffect(() => {
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setAdded(false);
    hasLoggedView.current = false;
  }, [id]);

  const related = useMemo(() => {
    if (!product) return [];
    const sameGender = allProducts.filter(
      (p) => p.gender === product.gender && Number(p.id) !== Number(product.id)
    );
    if (sameGender.length >= 4) return sameGender.slice(0, 4);
    const others = allProducts.filter((p) => Number(p.id) !== Number(product.id));
    return [...sameGender, ...others].slice(0, 4);
  }, [product, allProducts]);

  // Loading Skeleton State
  if (loading && !product) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-24" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-2 border-t-transparent border-b-transparent rounded-full animate-spin-slow" style={{ borderColor: 'var(--color-champagne)', borderTopColor: 'transparent' }} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-taupe)' }}>Loading Garment Details...</p>
        </div>
      </main>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-6 pt-28 pb-16"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="max-w-md text-center">
          <h1 className="font-heading text-4xl" style={{ color: 'var(--color-espresso)', fontWeight: 400 }}>
            Piece Not Found
          </h1>
          <p className="mt-4 text-base" style={{ color: 'var(--color-taupe)' }}>
            This garment is no longer in our active atelier catalog.
          </p>
          <Link href="/products" className="mt-8 inline-block btn-outline">
            <span>Back to Collection</span>
          </Link>
        </div>
      </main>
    );
  }

  const soldOut = product.stock === 0;
  const saved = wishlistHydrated && isInWishlist(product.id);
  const discount = product.salePrice
    ? Math.round(
        ((parsePrice(product.price) - parsePrice(product.salePrice)) /
          parsePrice(product.price)) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    if (soldOut) return;
    const accepted = addToCart(
      product,
      quantity,
      selectedSize || product.sizes?.[0],
      selectedColor || product.colors?.[0]
    );
    if (accepted) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2500);
    }
  };

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }} className="pt-20 md:pt-28">

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-6 md:px-12 pt-4 pb-6 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em]"
        style={{ color: 'var(--color-taupe)' }}
      >
        <Link href="/" className="transition-opacity hover:opacity-60">Home</Link>
        <span>/</span>
        <Link href={`/products?gender=${product.gender}`} className="transition-opacity hover:opacity-60">
          {product.gender}
        </Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="transition-opacity hover:opacity-60">
          {product.category}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Product Detail Layout Grid */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 pb-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">

          {/* ── Left Column: Garment Image (7 Cols on desktop) ────────────────── */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div
              className="relative overflow-hidden rounded-sm group"
              style={{ aspectRatio: '3/4', background: 'var(--color-bg-warm)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}
            >
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={product.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80'}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80';
                }}
              />

              {/* Badges Overlay */}
              <div className="pointer-events-none absolute left-5 top-5 flex flex-col gap-2.5 z-10">
                {soldOut ? (
                  <span
                    className="px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ background: 'var(--color-espresso)', color: '#F5F1E8' }}
                  >
                    Sold Out
                  </span>
                ) : (
                  product.isSale && (
                    <span
                      className="px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]"
                      style={{ background: 'var(--color-champagne)', color: '#1C1917' }}
                    >
                      Archive Sale — Save {discount}%
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column: Purchase Form & Information (5 Cols on desktop) ──── */}
          <div className="lg:col-span-5 flex flex-col pt-2 md:pt-0">

            {/* Category & Review Rating Header */}
            <div className="flex items-center justify-between pb-2">
              <span
                className="text-xs font-semibold uppercase tracking-[0.28em]"
                style={{ color: 'var(--color-champagne)' }}
              >
                {product.gender} · {product.category}
              </span>
              {product.rating > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--color-champagne)' }}>
                  <span>{'★'.repeat(Math.round(product.rating))}</span>
                  <span style={{ color: 'var(--color-taupe)', fontSize: '0.75rem' }}>({product.reviews || 5} reviews)</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-heading mt-2 mb-4"
              style={{
                fontSize: 'clamp(2.25rem, 3.5vw, 3.25rem)',
                fontWeight: 400,
                color: 'var(--color-espresso)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              {product.name}
            </h1>

            {/* Price Display */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-heading text-3xl font-semibold" style={{ color: 'var(--color-espresso)' }}>
                {product.salePrice ?? product.price}
              </span>
              {product.salePrice && (
                <span className="text-base line-through font-normal" style={{ color: 'var(--color-taupe)' }}>
                  {product.price}
                </span>
              )}
            </div>

            <div className="mb-8 divider" />

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-espresso)' }}>
                    Select Size
                  </span>
                  <button
                    type="button"
                    className="text-xs font-medium uppercase tracking-[0.16em] underline hover:opacity-75"
                    style={{ color: 'var(--color-taupe)' }}
                    onClick={() => setShowSizeGuide(true)}
                  >
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size || (!selectedSize && size === product.sizes?.[0]);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className="flex h-13 min-w-[56px] items-center justify-center px-4 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200"
                        style={{
                          border: `1.5px solid ${isSelected ? 'var(--color-espresso)' : 'var(--color-parchment)'}`,
                          background: isSelected ? 'var(--color-espresso)' : 'transparent',
                          color: isSelected ? '#F5F1E8' : 'var(--color-espresso)',
                          boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors / Shades Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] mb-3.5" style={{ color: 'var(--color-espresso)' }}>
                  Shade / Color: <span style={{ color: 'var(--color-taupe)', fontWeight: 500 }}>{selectedColor || product.colors[0]}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color || (!selectedColor && color === product.colors?.[0]);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200"
                        style={{
                          border: `1.5px solid ${isSelected ? 'var(--color-espresso)' : 'var(--color-parchment)'}`,
                          background: isSelected ? 'var(--color-bg-alt)' : 'transparent',
                          color: 'var(--color-espresso)',
                        }}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Row: Quantity + Add to Bag + Wishlist */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-10">
              {/* Quantity Stepper */}
              <div
                className="flex items-center justify-between border rounded-sm px-2 flex-shrink-0"
                style={{ borderColor: 'var(--color-parchment)', minWidth: '130px', height: '56px' }}
              >
                <button
                  type="button"
                  disabled={quantity <= 1 || soldOut}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-full flex items-center justify-center text-xl font-medium transition-opacity hover:opacity-60 disabled:opacity-25"
                  style={{ color: 'var(--color-espresso)' }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold" style={{ color: 'var(--color-espresso)' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={soldOut}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-full flex items-center justify-center text-xl font-medium transition-opacity hover:opacity-60 disabled:opacity-25"
                  style={{ color: 'var(--color-espresso)' }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                disabled={soldOut}
                onClick={handleAddToCart}
                className="flex-1 btn-primary"
                style={{
                  height: '56px',
                  background: added ? 'var(--color-champagne)' : 'var(--color-espresso)',
                  color: added ? '#1C1917' : '#F5F1E8',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.2em',
                }}
              >
                <span>{soldOut ? 'Sold Out' : added ? '✓ Added to Bag' : 'Add to Bag'}</span>
              </button>

              {/* Wishlist Heart Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                className="flex h-[56px] w-[56px] items-center justify-center border rounded-sm transition-all duration-200 flex-shrink-0"
                style={{
                  borderColor: saved ? 'var(--color-champagne)' : 'var(--color-parchment)',
                  color: saved ? 'var(--color-champagne)' : 'var(--color-espresso)',
                  background: saved ? 'var(--color-bg-alt)' : 'transparent',
                }}
              >
                <svg className="h-6 w-6" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Product Specifications & Care Tabs */}
            <div className="pt-8" style={{ borderTop: '1px solid var(--color-parchment)' }}>
              {/* Tab Buttons Bar */}
              <div className="flex items-center gap-8 border-b mb-6" style={{ borderColor: 'var(--color-parchment)' }}>
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'care', label: 'Care Guide' },
                  { id: 'shipping', label: 'Delivery' },
                ].map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className="pb-3 text-xs font-semibold uppercase tracking-[0.2em] transition-all relative"
                      style={{
                        color: active ? 'var(--color-espresso)' : 'var(--color-taupe)',
                      }}
                    >
                      {tab.label}
                      {active && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-0.5 animate-slide-right"
                          style={{ background: 'var(--color-champagne)' }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Box */}
              <div className="min-h-[100px] text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                {activeTab === 'details' && (
                  <p className="animate-fade-in">
                    {product.description || 'A tailored Atelier garment designed with precise proportions, soft hand-feel, and premium finished seams.'}
                  </p>
                )}
                {activeTab === 'care' && (
                  <p className="animate-fade-in">
                    Specialist dry clean only. Store on a wide tailored hanger in a cool, dry garment sleeve. Avoid direct heat or direct perfume spray.
                  </p>
                )}
                {activeTab === 'shipping' && (
                  <p className="animate-fade-in">
                    Complimentary express delivery across Pakistan for orders above PKR 5,000. All orders arrive in signature Noveira Atelier box packaging within 3–5 business days.
                  </p>
                )}
              </div>
            </div>

            {/* Atelier Value Guarantees */}
            <div className="mt-8 pt-6 grid grid-cols-3 gap-4 text-center border-t" style={{ borderColor: 'var(--color-parchment)' }}>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--color-champagne)' }}>📦 Delivery</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--color-taupe)' }}>Complimentary over PKR 5,000</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--color-champagne)' }}>✨ Authenticity</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--color-taupe)' }}>100% Atelier Guaranteed</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--color-champagne)' }}>🔄 Exchanges</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--color-taupe)' }}>Easy 14-Day Return</p>
              </div>
            </div>

          </div>

        </div>

        {/* ── Related Garments ────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-28 pt-16" style={{ borderTop: '1.5px solid var(--color-parchment)' }}>
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-2" style={{ color: 'var(--color-champagne)' }}>Complementary Pieces</p>
              <h2 className="font-heading text-3xl md:text-4xl" style={{ fontWeight: 400, color: 'var(--color-espresso)' }}>
                You May Also Admire
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
              {related.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-full max-w-lg p-8 animate-scale-in rounded-sm"
            style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-parchment)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b" style={{ borderColor: 'var(--color-parchment)' }}>
              <h3 className="font-heading text-2xl" style={{ color: 'var(--color-espresso)' }}>Atelier Sizing Guide</h3>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="text-lg font-bold p-2 transition-opacity hover:opacity-60"
              >
                ✕
              </button>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-charcoal)' }}>
              Noveira garments follow tailored international sizing standards. For a standard tailored fit, select your true size.
            </p>
            <table className="w-full text-xs text-left border-collapse mb-6">
              <thead>
                <tr className="border-b uppercase tracking-wider" style={{ borderColor: 'var(--color-parchment)', color: 'var(--color-taupe)' }}>
                  <th className="py-2.5">Size</th>
                  <th className="py-2.5">Bust/Chest</th>
                  <th className="py-2.5">Waist</th>
                  <th className="py-2.5">Hips</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--color-espresso)' }}>
                <tr className="border-b" style={{ borderColor: 'var(--color-parchment)' }}><td className="py-2 font-semibold">S / 4Y</td><td>34" / 22"</td><td>26" / 20"</td><td>36" / 23"</td></tr>
                <tr className="border-b" style={{ borderColor: 'var(--color-parchment)' }}><td className="py-2 font-semibold">M / 6Y</td><td>36" / 24"</td><td>28" / 21"</td><td>38" / 25"</td></tr>
                <tr className="border-b" style={{ borderColor: 'var(--color-parchment)' }}><td className="py-2 font-semibold">L / 8Y</td><td>38" / 26"</td><td>30" / 22.5"</td><td>40" / 27"</td></tr>
                <tr><td className="py-2 font-semibold">XL / 10Y</td><td>40" / 28"</td><td>32" / 24"</td><td>42" / 29"</td></tr>
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="w-full btn-primary"
            >
              <span>Close Guide</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
