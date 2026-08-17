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
    <main className="min-h-screen bg-obsidian text-ivory">
      <section className="border-b border-gold/15 bg-surface py-14 px-6 text-center grain relative">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">Atelier Search</p>
          <h1 className="mt-3 font-heading text-4xl sm:text-5xl text-ivory">
            {trimmed ? `“${trimmed}”` : 'Find A Piece'}
          </h1>
          <p className="mt-3 text-xs text-stone">
            {trimmed
              ? `${results.length} ${results.length === 1 ? 'piece' : 'pieces'} found`
              : 'Search Women, Men, Children, Silk, Wool, or Cashmere.'}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <SearchBar />
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="border border-gold/15 bg-surface py-20 text-center rounded-sm">
            <h2 className="font-heading text-2xl text-ivory">
              {trimmed ? 'No matches found' : 'Start with a search'}
            </h2>
            <p className="mt-2 text-xs text-stone">
              {trimmed
                ? 'Try searching for Women, Men, Children, or specific fabrics.'
                : 'Type in a search query above to explore pieces.'}
            </p>
            <Link href="/products" className="mt-8 btn-primary">
              <span>Browse Full Collection</span>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
