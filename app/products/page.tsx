'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, effectivePrice } from '@/src/data/products';
import ProductCard from '@/src/components/ProductCard';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const GENDER_OPTIONS = ['All', 'Women', 'Men', 'Children'];

const COLLECTION_DESCRIPTIONS: Record<string, string> = {
  Women: "From fluid silk blouses to sculpted evening wear — the full spectrum of feminine dressing.",
  Men: "Italian wool suiting, fine knitwear, and considered tailoring for the modern gentleman.",
  Children: "Pure linen playsuits, cashmere knitwear, and thoughtful dressing for little ones.",
  "Archive & Sale": "Exceptional pieces from previous seasons, offered at a reduced price.",
  "The Collection": "Explore the complete NOVEIRA Atelier catalog across all lines.",
};

function SkeletonCard() {
  return (
    <div>
      <div className="shimmer" style={{ aspectRatio: '3/4', width: '100%' }} />
      <div className="mt-4 space-y-3">
        <div className="shimmer h-3 w-1/3 rounded" />
        <div className="shimmer h-5 w-2/3 rounded" />
        <div className="shimmer h-4 w-1/4 rounded" />
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category');
  const genderParam = searchParams.get('gender');
  const saleOnly = searchParams.get('sale') === 'true';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.success && Array.isArray(data.data)) {
          setAllProducts(data.data);
          setStatus('ready');
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedGender = genderParam ?? 'All';
  const selectedCategory = categoryParam ?? 'All';

  const categories = useMemo(() => {
    let list = allProducts;
    if (selectedGender !== 'All') {
      list = list.filter((p) => p.gender === selectedGender);
    }
    return ['All', ...new Set(list.map((p) => p.category))];
  }, [allProducts, selectedGender]);

  const visibleProducts = useMemo(() => {
    let result = allProducts;
    if (selectedGender !== 'All') result = result.filter((p) => p.gender === selectedGender);
    if (selectedCategory !== 'All') result = result.filter((p) => p.category === selectedCategory);
    if (saleOnly) result = result.filter((p) => p.isSale);

    const sorted = [...result];
    if (sortBy === 'price-low') sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    else if (sortBy === 'price-high') sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    else if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [allProducts, selectedGender, selectedCategory, saleOnly, sortBy]);

  const applyFilter = (gender: string, category: string, sale: boolean) => {
    const params = new URLSearchParams();
    if (gender !== 'All') params.set('gender', gender);
    if (category !== 'All') params.set('category', category);
    if (sale) params.set('sale', 'true');
    const query = params.toString();
    router.replace(query ? `/products?${query}` : '/products', { scroll: false });
  };

  const pageHeading = saleOnly
    ? 'Archive & Sale'
    : selectedCategory !== 'All'
    ? selectedCategory
    : selectedGender !== 'All'
    ? selectedGender
    : 'The Collection';

  const pageDescription = COLLECTION_DESCRIPTIONS[pageHeading] ?? COLLECTION_DESCRIPTIONS['The Collection'];

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Featured';

  return (
    <main style={{ background: 'var(--color-bg)', color: 'var(--color-charcoal)', minHeight: '100vh' }}>

      {/* ── Collection Header ─────────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: 'var(--color-bg-alt)', borderBottom: '1.5px solid var(--color-parchment)' }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: 'var(--color-champagne)' }}>NOVEIRA ATELIER</p>
          <h1
            className="font-heading"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 4.75rem)', fontWeight: 400, color: 'var(--color-espresso)' }}
          >
            {pageHeading}
          </h1>
          <p className="mt-2 font-heading text-xl italic" style={{ color: 'var(--color-charcoal)', fontWeight: 400 }}>
            Autumn / Winter 2026
          </p>
          <div className="w-12 h-0.5 mx-auto my-6" style={{ background: 'var(--color-champagne)', opacity: 0.6 }} />
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-charcoal)', maxWidth: '38rem', margin: '0 auto', fontWeight: 400 }}>
            {pageDescription}
          </p>
          {status === 'ready' && (
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--color-taupe)' }}>
              {visibleProducts.length} {visibleProducts.length === 1 ? 'piece' : 'pieces'} available
            </p>
          )}
        </div>
      </section>

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1.5px solid var(--color-parchment)', background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">

          {/* Gender filter row */}
          <div
            className="flex items-center gap-0 overflow-x-auto"
            style={{ borderBottom: '1px solid var(--color-parchment)' }}
          >
            {GENDER_OPTIONS.map((g) => {
              const active = selectedGender === g && !saleOnly;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => applyFilter(g, 'All', false)}
                  className="flex-shrink-0 px-7 py-4.5 text-xs sm:text-sm uppercase tracking-[0.18em] transition-all duration-200 relative"
                  style={{
                    color: active ? 'var(--color-espresso)' : 'var(--color-taupe)',
                    fontWeight: active ? 600 : 500,
                    borderBottom: active ? '2.5px solid var(--color-espresso)' : '2.5px solid transparent',
                    marginBottom: '-1px',
                  }}
                >
                  {g === 'All' ? 'All Lines' : g}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => applyFilter(selectedGender, 'All', true)}
              className="flex-shrink-0 px-7 py-4.5 text-xs sm:text-sm uppercase tracking-[0.18em] transition-all duration-200 relative"
              style={{
                color: saleOnly ? 'var(--color-champagne)' : 'var(--color-taupe)',
                fontWeight: saleOnly ? 600 : 500,
                borderBottom: saleOnly ? '2.5px solid var(--color-champagne)' : '2.5px solid transparent',
                marginBottom: '-1px',
              }}
            >
              Sale
            </button>
          </div>

          {/* Category + Sort row */}
          <div className="flex items-center justify-between py-5 gap-6 overflow-x-auto">
            {/* Category filters */}
            <div className="flex items-center gap-7 overflow-x-auto">
              {categories.map((cat) => {
                const active = cat === selectedCategory && !saleOnly;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => applyFilter(selectedGender, cat, false)}
                    className="flex-shrink-0 text-xs uppercase tracking-[0.16em] transition-colors duration-200 pb-1"
                    style={{
                      color: active ? 'var(--color-espresso)' : 'var(--color-taupe)',
                      fontWeight: active ? 600 : 500,
                      borderBottom: active ? '2px solid var(--color-espresso)' : '2px solid transparent',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="flex-shrink-0 relative">
              <button
                type="button"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-espresso)' }}
              >
                <span>Sort: {currentSortLabel}</span>
                <svg className={`h-3.5 w-3.5 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSortMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 py-3 z-30 animate-scale-in"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1.5px solid var(--color-parchment)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.12)'
                  }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                      className="block w-full text-left px-5 py-3 text-xs uppercase tracking-[0.14em] transition-colors hover:bg-[var(--color-bg-alt)]"
                      style={{ color: sortBy === opt.value ? 'var(--color-espresso)' : 'var(--color-charcoal)', fontWeight: sortBy === opt.value ? 600 : 400 }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Grid ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 py-16 pb-32">
        {status === 'loading' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {status === 'error' && (
          <div className="py-32 text-center">
            <h2 className="font-heading text-3xl" style={{ color: 'var(--color-espresso)' }}>
              Unable to Load Collection
            </h2>
            <p className="mt-4 text-base" style={{ color: 'var(--color-taupe)' }}>
              Please refresh your browser to try again.
            </p>
          </div>
        )}

        {status === 'ready' && visibleProducts.length === 0 && (
          <div className="py-32 text-center">
            <h2 className="font-heading text-4xl" style={{ color: 'var(--color-espresso)' }}>
              No Pieces Found
            </h2>
            <p className="mt-4 text-base" style={{ color: 'var(--color-taupe)' }}>
              Try adjusting your filters to explore more of the collection.
            </p>
            <button
              type="button"
              onClick={() => applyFilter('All', 'All', false)}
              className="mt-10 btn-outline"
            >
              <span>View All Collection</span>
            </button>
          </div>
        )}

        {status === 'ready' && visibleProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main
          className="flex min-h-screen items-center justify-center"
          style={{ background: 'var(--color-bg)' }}
        >
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-taupe)' }}>Loading Collection...</p>
          </div>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
