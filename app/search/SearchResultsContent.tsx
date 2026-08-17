'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/src/components/ProductCard';
import SearchBar from '@/src/components/SearchBar';
import { searchProducts } from '@/src/context/SearchContext';

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const results = useMemo(() => searchProducts(query), [query]);
  const trimmed = query.trim();

  return (
    <main style={{ background: 'var(--color-bg)', color: 'var(--color-charcoal)', minHeight: '100vh' }}>
      {/* Header */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: 'var(--color-bg-alt)', borderBottom: '1.5px solid var(--color-parchment)' }}
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: 'var(--color-champagne)' }}>Atelier Search</p>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', fontWeight: 400, color: 'var(--color-espresso)' }}>
            {trimmed ? `“${trimmed}”` : 'Find A Piece'}
          </h1>
          <p className="mt-3 text-base" style={{ color: 'var(--color-charcoal)' }}>
            {trimmed
              ? `${results.length} ${results.length === 1 ? 'piece' : 'pieces'} found`
              : 'Search Women, Men, Children, Silk, Wool, or Cashmere.'}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 md:px-10 py-10">
        <SearchBar />
      </div>

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-28">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center" style={{ borderTop: '1.5px solid var(--color-parchment)' }}>
            <h2 className="font-heading text-3xl mb-3" style={{ color: 'var(--color-espresso)', fontWeight: 400 }}>
              {trimmed ? 'No matches found' : 'Start with a search'}
            </h2>
            <p className="text-base mb-8" style={{ color: 'var(--color-charcoal)' }}>
              {trimmed
                ? 'Try searching for Women, Men, Children, or specific fabrics like Silk and Cashmere.'
                : 'Type in a search query above to explore pieces.'}
            </p>
            <Link href="/products" className="btn-primary">
              <span>Browse Full Collection</span>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
