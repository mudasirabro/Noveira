'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/src/data/products';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  badge?: string;
  priority?: boolean;
}

export default function ProductCard({ product, badge, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, hydrated } = useWishlist();

  const soldOut = product.stock === 0;
  const saved = hydrated && isInWishlist(product.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-sm transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-void">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            priority={priority}
            className="product-card-img object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        {/* Badges */}
        {(badge || product.isSale || soldOut) && (
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5 z-10">
            {soldOut ? (
              <span className="bg-obsidian/90 border border-stone/30 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur-md">
                Sold Out
              </span>
            ) : (
              <>
                {badge && (
                  <span className="bg-obsidian/90 border border-gold/40 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur-md">
                    {badge}
                  </span>
                )}
                {product.isSale && (
                  <span className="bg-gold text-obsidian px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] shadow-md">
                    Sale
                  </span>
                )}
              </>
            )}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-obsidian/70 backdrop-blur-md text-ivory border border-gold/20 transition-all duration-300 hover:bg-gold hover:text-obsidian hover:scale-110"
        >
          <svg
            className="h-4 w-4"
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

        {/* Quick Add Button */}
        {!soldOut && (
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-2 bg-gold/90 backdrop-blur-md py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-obsidian opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-gold shadow-lg"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Quick Add
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow pt-3.5 pb-2 px-1">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-stone">
          <span>{product.gender}</span>
          <span>{product.category}</span>
        </div>

        <h3 className="mt-1.5 font-heading text-lg leading-snug text-ivory transition-colors group-hover:text-gold">
          <Link href={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-gold">
            {product.salePrice ?? product.price}
          </span>
          {product.salePrice && (
            <span className="text-xs text-stone line-through">{product.price}</span>
          )}
        </div>
      </div>
    </article>
  );
}
