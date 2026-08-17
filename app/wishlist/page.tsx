'use client';

import Link from 'next/link';
import { useWishlist } from '@/src/context/WishlistContext';
import ProductCard from '@/src/components/ProductCard';

export default function WishlistPage() {
  const { wishlistItems, clearWishlist, hydrated } = useWishlist();

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian text-stone">
        <p className="text-[11px] uppercase tracking-[0.2em]">Loading wishlist...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-obsidian text-ivory">
      <section className="border-b border-gold/15 bg-surface py-14 px-6 text-center grain relative">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">Personal Selection</p>
          <h1 className="mt-3 font-heading text-4xl sm:text-5xl text-ivory">Wishlist</h1>
          <p className="mt-3 text-xs text-stone">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'piece' : 'pieces'} saved in your atelier list
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-14">
        {wishlistItems.length === 0 ? (
          <div className="border border-gold/15 bg-surface py-20 text-center rounded-sm">
            <h2 className="font-heading text-2xl text-ivory">Nothing saved yet</h2>
            <p className="mt-2 text-xs text-stone">
              Click the heart on any item in our Women, Men, or Children collections to save it here.
            </p>
            <Link href="/products" className="mt-8 btn-primary">
              <span>Browse The Collection</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-end border-b border-gold/15 pb-4">
              <button
                type="button"
                onClick={clearWishlist}
                className="text-[10px] uppercase tracking-[0.18em] text-stone hover:text-gold transition-colors underline decoration-gold/20 underline-offset-4"
              >
                Clear All Saved
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {wishlistItems.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>

            <div className="mt-14 text-center">
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
