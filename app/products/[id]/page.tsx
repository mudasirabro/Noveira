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
      <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-bg)' }}>
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
        className="flex min-h-screen items-center justify-center px-6"
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
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-6 md:px-10 pt-8 pb-3 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em]"
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

      {/* Product Detail Grid */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 pb-28">
        <div className="grid gap-12 md:grid-cols-2 lg:gap-20 items-start">

          {/* ── Left: Image ──────────────────────────────────────────── */}
          <div className="md:sticky md:top-24">
            <div
              className="relative overflow-hidden rounded-sm"
              style={{ aspectRatio: '3/4', background: 'var(--color-bg-warm)' }}
            >
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={product.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80'}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80';
                }}
              />

              {/* Badges */}
              <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
                {soldOut ? (
                  <span
                    className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ background: 'var(--color-espresso)', color: 'var(--color-ivory)' }}
                  >
                    Sold Out
                  </span>
                ) : (
                  product.isSale && (
                    <span
                      className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em]"
                      style={{ background: 'var(--color-champagne)', color: 'var(--color-espresso)' }}
                    >
                      Sale — Save {discount}%
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Details & Purchase Form ────────────────────────── */}
          <div className="flex flex-col">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-taupe)' }}
              >
                {product.gender} · {product.category}
              </span>
              {product.rating > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--color-champagne)' }}>
                  <span>{'★'.repeat(Math.round(product.rating))}</span>
                  <span style={{ color: 'var(--color-taupe)' }}>({product.reviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-heading mt-3"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400,
                color: 'var(--color-espresso)',
                lineHeight: 1.15,
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="font-heading text-3xl font-semibold" style={{ color: 'var(--color-espresso)' }}>
                {product.salePrice ?? product.price}
              </span>
              {product.salePrice && (
                <span className="text-lg line-through" style={{ color: 'var(--color-taupe)' }}>
                  {product.price}
                </span>
              )}
            </div>

            <div className="my-8 divider" />

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--color-espresso)' }}>
                    Select Size
                  </span>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.14em] underline hover:opacity-75"
                    style={{ color: 'var(--color-taupe)' }}
                    onClick={() => alert('Sizing Guide: Standard Atelier Tailored Fit. Order your usual international size.')}
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size || (!selectedSize && size === product.sizes?.[0]);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className="flex h-12 min-w-[52px] items-center justify-center px-4 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200"
                        style={{
                          border: `1.5px solid ${isSelected ? 'var(--color-espresso)' : 'var(--color-parchment)'}`,
                          background: isSelected ? 'var(--color-espresso)' : 'transparent',
                          color: isSelected ? '#F5F1E8' : 'var(--color-espresso)',
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors / Shades */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--color-espresso)' }}>
                  Shade / Color: <span style={{ color: 'var(--color-taupe)', fontWeight: 400 }}>{selectedColor || product.colors[0]}</span>
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color || (!selectedColor && color === product.colors?.[0]);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className="px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-all duration-200"
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

            {/* Quantity Selector & Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center border" style={{ borderColor: 'var(--color-parchment)', minHeight: '52px' }}>
                <button
                  type="button"
                  disabled={quantity <= 1 || soldOut}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-lg font-semibold transition-opacity hover:opacity-60 disabled:opacity-30"
                  style={{ color: 'var(--color-espresso)' }}
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold" style={{ color: 'var(--color-espresso)' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={soldOut}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-3 text-lg font-semibold transition-opacity hover:opacity-60 disabled:opacity-30"
                  style={{ color: 'var(--color-espresso)' }}
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
                  background: added ? 'var(--color-champagne)' : 'var(--color-espresso)',
                  color: added ? '#1C1917' : '#F5F1E8',
                }}
              >
                <span>{soldOut ? 'Sold Out' : added ? '✓ Added to Bag' : 'Add to Bag'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                className="flex h-[52px] w-[52px] items-center justify-center border transition-colors duration-200 flex-shrink-0"
                style={{
                  borderColor: saved ? 'var(--color-champagne)' : 'var(--color-parchment)',
                  color: saved ? 'var(--color-champagne)' : 'var(--color-espresso)',
                  background: saved ? 'var(--color-bg-alt)' : 'transparent',
                }}
              >
                <svg className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Description & Accordion Tabs */}
            <div className="mt-4 pt-6" style={{ borderTop: '1px solid var(--color-parchment)' }}>
              <div className="flex border-b" style={{ borderColor: 'var(--color-parchment)' }}>
                {(['details', 'care', 'shipping'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="py-3 px-5 text-xs font-semibold uppercase tracking-[0.18em] transition-all capitalize"
                    style={{
                      color: activeTab === tab ? 'var(--color-espresso)' : 'var(--color-taupe)',
                      borderBottom: activeTab === tab ? '2px solid var(--color-espresso)' : '2px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="py-6 text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                {activeTab === 'details' && (
                  <p>{product.description || 'A tailored Atelier garment designed with precise proportions and premium materials.'}</p>
                )}
                {activeTab === 'care' && (
                  <p>Specialist dry clean only. Store on a wide tailored hanger in a cool, dry garment sleeve. Avoid direct contact with perfume or heat.</p>
                )}
                {activeTab === 'shipping' && (
                  <p>Complimentary express delivery across Pakistan for orders above PKR 5,000. Orders delivered in custom signature Noveira Atelier box packaging within 3–5 business days.</p>
                )}
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
    </main>
  );
}
