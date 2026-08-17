'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { useRecentlyViewed } from '@/src/context/RecentlyViewedContext';
import { useWishlist } from '@/src/context/WishlistContext';
import ProductCard from '@/src/components/ProductCard';
import { getProductById, products, parsePrice } from '@/src/data/products';

export default function ProductDetailsPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { addRecentlyViewed } = useRecentlyViewed();
  const { toggleWishlist, isInWishlist, hydrated: wishlistHydrated } = useWishlist();

  const id = Number.parseInt(params.id as string, 10);
  const product = useMemo(() => getProductById(id) ?? null, [id]);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  const hasLoggedView = useRef(false);

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
    const sameGender = products.filter(
      (p) => p.gender === product.gender && p.id !== product.id
    );
    if (sameGender.length >= 4) return sameGender.slice(0, 4);
    const others = products.filter((p) => p.id !== product.id);
    return [...sameGender, ...others].slice(0, 4);
  }, [product]);

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
              className="relative overflow-hidden"
              style={{ aspectRatio: '3/4', background: 'var(--color-bg-warm)' }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = `https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80`;
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

            {/* Zoom hint */}
            <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--color-taupe)' }}>
              Hover image to inspect detail
            </p>
          </div>

          {/* ── Right: Product Info ───────────────────────────────────── */}
          <div className="flex flex-col">
            {/* Category / gender label */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: 'var(--color-champagne)' }}>
              <span>{product.gender}</span>
              <span style={{ color: 'var(--color-parchment)' }}>—</span>
              <span>{product.category}</span>
            </div>

            {/* Product name */}
            <h1
              className="font-heading"
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                color: 'var(--color-espresso)',
                fontWeight: 400,
                lineHeight: 1.08
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3.5 flex items-center gap-3">
              <span style={{ color: 'var(--color-champagne)', fontSize: '1rem' }}>
                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
              </span>
              <span className="text-xs font-medium" style={{ color: 'var(--color-charcoal)' }}>
                {product.rating.toFixed(1)} · {product.reviews} Customer Reviews
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3" style={{ borderTop: '1.5px solid var(--color-parchment)', paddingTop: '1.75rem' }}>
              <span
                className="font-heading text-3xl"
                style={{ color: 'var(--color-espresso)', fontWeight: 500 }}
              >
                {product.salePrice ?? product.price}
              </span>
              {product.salePrice && (
                <span className="text-lg line-through font-normal" style={{ color: 'var(--color-taupe)' }}>
                  {product.price}
                </span>
              )}
            </div>

            {/* Stock status */}
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: soldOut ? '#B04040' : product.stock <= 5 ? 'var(--color-champagne)' : 'var(--color-taupe)' }}>
              {soldOut
                ? 'Out of Stock'
                : product.stock <= 5
                ? `Only ${product.stock} left`
                : 'In Stock — Ships Next Business Day'}
            </p>

            {/* Description */}
            <p className="mt-6 text-base leading-relaxed" style={{ color: 'var(--color-charcoal)', fontWeight: 400 }}>
              {product.description ?? 'Crafted with extreme care in small batches by Noveira Atelier.'}
            </p>

            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <fieldset className="mt-8">
                <legend className="text-xs uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: 'var(--color-espresso)' }}>
                  Shade: <span style={{ color: 'var(--color-champagne)', fontWeight: 600 }}>{selectedColor || product.colors[0]}</span>
                </legend>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      disabled={soldOut}
                      aria-pressed={selectedColor === color || (!selectedColor && color === product.colors![0])}
                      className="px-5 py-3 text-xs uppercase tracking-[0.14em] font-semibold transition-all duration-200 border"
                      style={{
                        borderColor: (selectedColor === color || (!selectedColor && color === product.colors![0]))
                          ? 'var(--color-espresso)'
                          : 'var(--color-parchment)',
                        color: (selectedColor === color || (!selectedColor && color === product.colors![0]))
                          ? 'var(--color-espresso)'
                          : 'var(--color-charcoal)',
                        background: (selectedColor === color || (!selectedColor && color === product.colors![0]))
                          ? 'var(--color-bg-alt)'
                          : 'transparent',
                        opacity: soldOut ? 0.4 : 1,
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <fieldset className="mt-7">
                <div className="flex items-center justify-between mb-3">
                  <legend className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--color-espresso)' }}>
                    Size: <span style={{ color: 'var(--color-champagne)', fontWeight: 600 }}>{selectedSize || 'Select Size'}</span>
                  </legend>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.16em] font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
                    style={{ color: 'var(--color-taupe)' }}
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      disabled={soldOut}
                      aria-pressed={selectedSize === size}
                      className="min-w-[3.5rem] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 border"
                      style={{
                        borderColor: selectedSize === size ? 'var(--color-espresso)' : 'var(--color-parchment)',
                        color: selectedSize === size ? 'var(--color-ivory)' : 'var(--color-charcoal)',
                        background: selectedSize === size ? 'var(--color-espresso)' : 'transparent',
                        opacity: soldOut ? 0.4 : 1,
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Quantity + Add to Bag */}
            <div className="mt-8 flex gap-3">
              {/* Quantity */}
              <div
                className="flex items-center border"
                style={{ borderColor: 'var(--color-parchment)', minHeight: '52px' }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={soldOut || quantity <= 1}
                  className="px-4 py-3 transition-opacity hover:opacity-60 disabled:opacity-30 font-semibold"
                  style={{ color: 'var(--color-espresso)', fontSize: '1.2rem' }}
                >
                  −
                </button>
                <span className="w-10 text-center text-base font-semibold" style={{ color: 'var(--color-espresso)' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={soldOut || quantity >= product.stock}
                  className="px-4 py-3 transition-opacity hover:opacity-60 disabled:opacity-30 font-semibold"
                  style={{ color: 'var(--color-espresso)', fontSize: '1.2rem' }}
                >
                  +
                </button>
              </div>

              {/* Add to bag */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={soldOut}
                className="flex-1 btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ minHeight: '52px', fontSize: '0.875rem' }}
              >
                <span>{soldOut ? 'Sold Out' : added ? '✓ Added to Bag' : 'Add to Bag'}</span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-pressed={saved}
                className="px-5 border transition-all duration-200 flex items-center justify-center"
                style={{
                  borderColor: saved ? 'var(--color-champagne)' : 'var(--color-parchment)',
                  color: saved ? 'var(--color-champagne)' : 'var(--color-charcoal)',
                  background: 'transparent',
                  minHeight: '52px',
                }}
                onMouseEnter={(e) => {
                  if (!saved) e.currentTarget.style.borderColor = 'var(--color-espresso)';
                }}
                onMouseLeave={(e) => {
                  if (!saved) e.currentTarget.style.borderColor = 'var(--color-parchment)';
                }}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {added && (
              <p className="mt-3 text-sm font-semibold animate-fade-in" style={{ color: 'var(--color-champagne)' }}>
                ✓ Added to your shopping bag.
              </p>
            )}

            {/* Details tabs */}
            <div className="mt-12" style={{ borderTop: '1.5px solid var(--color-parchment)', paddingTop: '1.75rem' }}>
              {/* Tab headers */}
              <div className="flex gap-0" style={{ borderBottom: '1px solid var(--color-parchment)' }}>
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'care', label: 'Material & Care' },
                  { id: 'shipping', label: 'Shipping & Returns' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className="px-0 py-3.5 mr-8 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200"
                    style={{
                      color: activeTab === tab.id ? 'var(--color-espresso)' : 'var(--color-taupe)',
                      borderBottom: activeTab === tab.id ? '2px solid var(--color-espresso)' : '2px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="mt-6 text-base leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                {activeTab === 'details' && (
                  <div className="space-y-3 animate-fade-in">
                    <p>{product.description ?? 'Crafted in small batches by our Noveira atelier team.'}</p>
                    {product.sizes && <p><strong style={{ color: 'var(--color-espresso)' }}>Sizes:</strong> {product.sizes.join(', ')}</p>}
                    {product.colors && <p><strong style={{ color: 'var(--color-espresso)' }}>Shades:</strong> {product.colors.join(', ')}</p>}
                  </div>
                )}
                {activeTab === 'care' && (
                  <div className="space-y-3 animate-fade-in">
                    <p>Dry clean or hand wash in cold water with mild silk/wool detergent.</p>
                    <p>Store folded or on a padded hanger. Iron on low heat with a pressing cloth.</p>
                    <p>Made from premium natural fibres — treat with care for lasting quality.</p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] font-semibold mb-1" style={{ color: 'var(--color-espresso)' }}>Delivery</p>
                      <p>Complimentary express shipping across Pakistan on orders above PKR 5,000.</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] font-semibold mb-1" style={{ color: 'var(--color-espresso)' }}>Returns</p>
                      <p>14-day hassle-free return window. Items must be unworn with original tags intact.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-32" style={{ borderTop: '1.5px solid var(--color-parchment)', paddingTop: '4.5rem' }}>
            <div className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-2" style={{ color: 'var(--color-champagne)' }}>You May Also Like</p>
              <h2 className="font-heading text-4xl" style={{ fontWeight: 400, color: 'var(--color-espresso)' }}>
                Related Pieces
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
