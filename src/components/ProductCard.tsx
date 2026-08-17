'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/src/data/products';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  badge?: string;
  priority?: boolean;
}

export default function ProductCard({ product, badge, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, hydrated } = useWishlist();
  const [added, setAdded] = useState(false);
  const [wishAnimating, setWishAnimating] = useState(false);

  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const saved = hydrated && isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addToCart(product, 1, product.sizes?.[0], product.colors?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setWishAnimating(true);
    setTimeout(() => setWishAnimating(false), 400);
  };

  return (
    <article className="product-card group relative flex flex-col">
      {/* Image container */}
      <div
        className="relative w-full overflow-hidden rounded-sm"
        style={{ aspectRatio: '3/4', background: 'var(--color-bg-warm)' }}
      >
        <Link href={`/products/${product.id}`} className="block h-full w-full" aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            priority={priority}
            className="product-card-img object-cover object-center"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = `https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop&q=80`;
            }}
          />

          {/* Hover overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{ background: 'rgba(28,25,23,0.05)' }}
          />
        </Link>

        {/* Badges — top left */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5 z-10">
          {soldOut ? (
            <span
              className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ background: 'var(--color-espresso)', color: '#F7F3EC' }}
            >
              Sold Out
            </span>
          ) : (
            <>
              {badge && (
                <span
                  className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ background: 'var(--color-espresso)', color: '#F7F3EC' }}
                >
                  {badge}
                </span>
              )}
              {product.isSale && (
                <span
                  className="px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]"
                  style={{ background: 'var(--color-champagne)', color: '#1C1917' }}
                >
                  Sale
                </span>
              )}
              {lowStock && !product.isSale && (
                <span
                  className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ background: 'rgba(28,25,23,0.85)', color: 'var(--color-champagne)' }}
                >
                  Only {product.stock} Left
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist button — top right */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${wishAnimating ? 'animate-heart-pop' : ''}`}
          style={{
            background: 'rgba(250,248,245,0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,0,0,0.08)',
            color: saved ? '#C4A35A' : 'var(--color-charcoal)',
            opacity: saved ? 1 : 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.color = saved ? '#8A6D35' : 'var(--color-espresso)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = saved ? '1' : '0';
            e.currentTarget.style.color = saved ? '#C4A35A' : 'var(--color-charcoal)';
          }}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Quick Add — slides up on hover */}
        {!soldOut && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="absolute inset-x-0 bottom-0 z-10 min-h-[48px] py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 transform translate-y-full group-hover:translate-y-0"
            style={{
              background: added ? 'var(--color-champagne)' : 'var(--color-espresso)',
              color: added ? '#1C1917' : '#F7F3EC',
            }}
          >
            {added ? '✓ Added to Bag' : 'Quick Add'}
          </button>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col pt-4 pb-2">
        <div
          className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] mb-1.5"
          style={{ color: 'var(--color-taupe)' }}
        >
          <span>{product.category}</span>
          {product.rating > 0 && (
            <span style={{ color: 'var(--color-champagne)' }}>
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            </span>
          )}
        </div>

        <h3
          className="font-heading text-lg leading-snug transition-opacity duration-200 group-hover:opacity-75"
          style={{ color: 'var(--color-espresso)', fontWeight: 500 }}
        >
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="text-base font-semibold" style={{ color: 'var(--color-espresso)' }}>
            {product.salePrice ?? product.price}
          </span>
          {product.salePrice && (
            <span className="text-sm line-through font-normal" style={{ color: 'var(--color-taupe)' }}>
              {product.price}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
