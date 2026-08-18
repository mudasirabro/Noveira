'use client';

import Link from 'next/link';
import { useWishlist } from '@/src/context/WishlistContext';
import ProductCard from '@/src/components/ProductCard';

export default function WishlistPage() {
  const { wishlistItems, clearWishlist, hydrated } = useWishlist();

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <p className="text-label" style={{ color: 'var(--color-stone)' }}>Loading wishlist...</p>
      </main>
    );
  }

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div
        className="pt-20 pb-14 md:pt-28 md:pb-16 px-6 text-center"
        style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-parchment)' }}
      >
        <p className="text-label mb-3">Personal Selection</p>
        <h1
          className="font-heading"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, color: 'var(--color-espresso)' }}
        >
          Wishlist
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--color-taupe)' }}>
          {wishlistItems.length} {wishlistItems.length === 1 ? 'piece' : 'pieces'} saved
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10 py-14">
        {wishlistItems.length === 0 ? (
          <div className="py-24 text-center" style={{ borderTop: '1px solid var(--color-parchment)' }}>
            <h2 className="font-heading text-3xl mb-4" style={{ fontWeight: 400, color: 'var(--color-espresso)' }}>
              Nothing saved yet
            </h2>
            <p className="text-sm mb-10" style={{ color: 'var(--color-taupe)' }}>
              Click the heart on any item to save it to your wishlist.
            </p>
            <Link href="/products" className="btn-primary">
              <span>Browse the Collection</span>
            </Link>
          </div>
        ) : (
          <>
            <div
              className="mb-10 flex items-center justify-end pb-4"
              style={{ borderBottom: '1px solid var(--color-parchment)' }}
            >
              <button
                type="button"
                onClick={clearWishlist}
                className="text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-60 underline underline-offset-4"
                style={{ color: 'var(--color-stone)', textDecorationColor: 'var(--color-parchment)' }}
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {wishlistItems.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/products" className="btn-outline">
                <span>Continue Shopping</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
