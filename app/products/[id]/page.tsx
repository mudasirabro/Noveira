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
  const { addRecentlyViewed, recentlyViewed } = useRecentlyViewed();
  const { toggleWishlist, isInWishlist, hydrated: wishlistHydrated } = useWishlist();

  const id = Number.parseInt(params.id as string, 10);
  const product = useMemo(() => getProductById(id) ?? null, [id]);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);

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
    setZoomed(false);
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

  const alsoViewed = useMemo(
    () => recentlyViewed.filter((p) => p.id !== id).slice(0, 4),
    [recentlyViewed, id]
  );

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian text-ivory px-6">
        <div className="max-w-md text-center">
          <h1 className="font-heading text-4xl text-ivory">Piece Not Found</h1>
          <p className="mt-4 text-xs text-stone">
            This garment is no longer in our active atelier catalog.
          </p>
          <Link href="/products" className="mt-8 btn-primary">
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
    <main className="min-h-screen bg-obsidian text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone">
          <Link href="/" className="transition-colors hover:text-gold">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/products?gender=${product.gender}`} className="transition-colors hover:text-gold">
            {product.gender}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="transition-colors hover:text-gold">
            {product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-gold font-semibold">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid gap-12 md:grid-cols-2 items-start">
          
          {/* Image viewer */}
          <div>
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
              className={`relative block aspect-[3/4] w-full overflow-hidden rounded-sm border border-gold/20 bg-void ${
                zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className={`object-cover transition-transform duration-500 ease-out ${
                  zoomed ? 'scale-[1.8]' : 'scale-100'
                }`}
              />

              <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
                {soldOut ? (
                  <span className="bg-obsidian/90 border border-stone/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cream backdrop-blur-md">
                    Sold Out
                  </span>
                ) : (
                  product.isSale && (
                    <span className="bg-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian shadow-md">
                      Sale
                    </span>
                  )
                )}
              </div>
            </button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-stone">
              {zoomed ? 'Tap to zoom out' : 'Tap image to inspect weave & details'}
            </p>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
              <span>{product.gender}</span>
              <span>·</span>
              <span>{product.category}</span>
            </div>

            <h1 className="mt-2 font-heading text-4xl sm:text-5xl text-ivory leading-tight">
              {product.name}
            </h1>

            <p className="mt-3 text-xs text-stone">
              ★ {product.rating.toFixed(1)} &middot; {product.reviews} Atelier Reviews
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <span className="font-heading text-3xl text-gold">
                {product.salePrice ?? product.price}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-base text-stone line-through">{product.price}</span>
                  <span className="bg-gold/20 border border-gold/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-stone">
              {soldOut
                ? 'Out of stock'
                : product.stock <= 5
                ? `Low stock — Only ${product.stock} left in atelier`
                : 'In stock — Ships next business day'}
            </p>

            <p className="mt-6 border-t border-gold/15 pt-6 text-sm leading-relaxed text-stone">
              {product.description ?? 'Crafted with extreme care in small batches by Noveira.'}
            </p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <fieldset className="mt-8">
                <legend className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                  Select Size
                </legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      disabled={soldOut}
                      aria-pressed={selectedSize === size}
                      className={`min-w-12 px-4 py-2.5 text-xs uppercase tracking-[0.14em] transition-all duration-200 border rounded-sm disabled:opacity-30 ${
                        selectedSize === size
                          ? 'border-gold bg-gold text-obsidian font-bold shadow-md'
                          : 'border-gold/20 bg-surface text-ivory hover:border-gold/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <fieldset className="mt-6">
                <legend className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                  Select Shade
                </legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      disabled={soldOut}
                      aria-pressed={selectedColor === color}
                      className={`px-4 py-2.5 text-xs uppercase tracking-[0.14em] transition-all duration-200 border rounded-sm disabled:opacity-30 ${
                        selectedColor === color
                          ? 'border-gold bg-gold text-obsidian font-bold shadow-md'
                          : 'border-gold/20 bg-surface text-ivory hover:border-gold/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-stretch gap-4">
              <div className="flex items-center border border-gold/20 bg-surface rounded-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={soldOut || quantity <= 1}
                  className="px-4 py-3 text-gold transition-colors hover:text-ivory disabled:opacity-30"
                >
                  &minus;
                </button>
                <span className="w-10 text-center text-sm font-semibold text-ivory">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={soldOut || quantity >= product.stock}
                  className="px-4 py-3 text-gold transition-colors hover:text-ivory disabled:opacity-30"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={soldOut}
                className="flex-1 btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{soldOut ? 'Sold Out' : added ? 'Added To Bag' : 'Add To Bag'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-pressed={saved}
                className="border border-gold/20 bg-surface px-4 text-gold transition-colors hover:border-gold hover:text-gold-light rounded-sm"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill={saved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {added && (
              <p className="mt-3 text-xs text-gold font-medium animate-fade-in">
                ✓ Added to your shopping bag.
              </p>
            )}

            {/* Atelier Guarantees */}
            <dl className="mt-10 border-t border-gold/15 pt-6 text-xs text-stone space-y-3">
              <div className="flex gap-4">
                <dt className="w-28 shrink-0 uppercase tracking-[0.16em] text-gold font-medium">Shipping</dt>
                <dd>Complimentary shipping on orders above Rs. 5,000 across Pakistan.</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-28 shrink-0 uppercase tracking-[0.16em] text-gold font-medium">Returns</dt>
                <dd>14-day return window. Unworn, with original tags intact.</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-gold/15 pt-16">
            <h2 className="font-heading text-3xl text-ivory">You May Also Like</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
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
