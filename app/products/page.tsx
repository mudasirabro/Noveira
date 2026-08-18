'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, effectivePrice } from '@/src/data/products';
import ProductCard from '@/src/components/ProductCard';

type SortKey = 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const GENDER_OPTIONS = [
  { value: 'All', label: 'All Lines' },
  { value: 'Women', label: 'Women' },
  { value: 'Men', label: 'Men' },
  { value: 'Children', label: 'Children' },
];

const COLLECTION_DESCRIPTIONS: Record<string, string> = {
  "New Arrivals": "Explore our latest seasonal releases, fresh tailoring, and newly added garments.",
  Women: "From fluid silk blouses to sculpted evening wear — the full spectrum of feminine dressing.",
  Men: "Italian wool suiting, fine knitwear, and considered tailoring for the modern gentleman.",
  Children: "Pure linen playsuits, cashmere knitwear, and thoughtful dressing for little ones.",
  "Archive & Sale": "Exceptional pieces from previous seasons, offered at a reduced price.",
  "The Collection": "Explore the complete NOVEIRA Atelier catalog across all lines.",
};

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="shimmer rounded-sm" style={{ aspectRatio: '3/4', width: '100%' }} />
      <div className="mt-4 space-y-2.5">
        <div className="shimmer h-3 w-1/3 rounded" />
        <div className="shimmer h-5 w-3/4 rounded" />
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
  const isNewArrivals = searchParams.get('new') === 'true' || searchParams.get('sort') === 'newest';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sortBy, setSortBy] = useState<SortKey>(isNewArrivals ? 'newest' : 'featured');
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
    if (isNewArrivals || sortBy === 'newest') {
      sorted.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (sortBy === 'price-low') {
      sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [allProducts, selectedGender, selectedCategory, saleOnly, isNewArrivals, sortBy]);

  const applyFilter = (gender: string, category: string, sale: boolean, isNew: boolean = false) => {
    const params = new URLSearchParams();
    if (isNew) params.set('new', 'true');
    if (gender !== 'All') params.set('gender', gender);
    if (category !== 'All') params.set('category', category);
    if (sale) params.set('sale', 'true');
    const query = params.toString();
    router.replace(query ? `/products?${query}` : '/products', { scroll: false });
  };

  const pageHeading = isNewArrivals
    ? 'New Arrivals'
    : saleOnly
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

      {/* ── Collection Banner ─────────────────────────────────────────── */}
      <section
        className="pt-20 pb-14 md:pt-28 md:pb-20 px-6 text-center"
        style={{
          background: 'linear-gradient(180deg, var(--color-bg-alt) 0%, var(--color-bg) 100%)',
          borderBottom: '1px solid var(--color-parchment)'
        }}
      >
        <div className="mx-auto max-w-3xl animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: 'var(--color-champagne)' }}>NOVEIRA ATELIER</p>
          <h1
            className="font-heading"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', fontWeight: 400, color: 'var(--color-espresso)', lineHeight: 1.1 }}
          >
            {pageHeading}
          </h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--color-charcoal)' }}>
            {pageDescription}
          </p>
        </div>
      </section>

      {/* ── Filter & Sort Bar ────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--color-parchment)', background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex flex-wrap items-center justify-between gap-6">

          {/* Gender Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.18em] font-semibold mr-2" style={{ color: 'var(--color-taupe)' }}>World:</span>
            {GENDER_OPTIONS.map((g) => {
              const active = selectedGender === g.value && !saleOnly && !isNewArrivals;
              return (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => applyFilter(g.value, 'All', false, false)}
                  className={`pill-tab ${active ? 'active' : ''}`}
                >
                  {g.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => applyFilter('All', 'All', false, true)}
              className={`pill-tab ${isNewArrivals ? 'active' : ''}`}
            >
              New Arrivals
            </button>
            <button
              type="button"
              onClick={() => applyFilter('All', 'All', true, false)}
              className={`pill-tab ${saleOnly ? 'active' : ''}`}
            >
              Sale
            </button>
          </div>

          {/* Category Filter Pills (if active gender has categories) */}
          {categories.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-xs uppercase tracking-[0.18em] font-semibold mr-1" style={{ color: 'var(--color-taupe)' }}>Category:</span>
              {categories.map((c) => {
                const active = selectedCategory === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => applyFilter(selectedGender, c, saleOnly, isNewArrivals)}
                    className={`pill-tab ${active ? 'active' : ''}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSortMenu((v) => !v)}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] py-2.5 px-4 rounded-sm transition-colors"
              style={{ border: '1.5px solid var(--color-espresso)', color: 'var(--color-espresso)', background: 'transparent' }}
            >
              <span>Sort: {currentSortLabel}</span>
              <svg className={`h-4 w-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showSortMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-48 py-2 rounded-sm z-30 animate-scale-in"
                style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-parchment)', boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowSortMenu(false);
                    }}
                    className="block w-full px-5 py-2.5 text-left text-xs uppercase tracking-[0.14em] font-medium transition-colors hover:bg-[var(--color-bg-alt)]"
                    style={{ color: sortBy === opt.value ? 'var(--color-champagne)' : 'var(--color-espresso)', fontWeight: sortBy === opt.value ? 700 : 500 }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Product Grid Section ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-16">
        {status === 'loading' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {status === 'ready' && visibleProducts.length === 0 && (
          <div className="py-24 text-center">
            <h3 className="font-heading text-3xl mb-3" style={{ color: 'var(--color-espresso)', fontWeight: 400 }}>
              No garments found
            </h3>
            <p className="text-sm max-w-md mx-auto mb-8" style={{ color: 'var(--color-charcoal)' }}>
              No pieces match your selected combination. Try clearing some filters.
            </p>
            <button
              type="button"
              onClick={() => applyFilter('All', 'All', false, false)}
              className="btn-outline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {status === 'ready' && visibleProducts.length > 0 && (
          <div>
            <div className="mb-8 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-taupe)' }}>
              <span>Showing {visibleProducts.length} {visibleProducts.length === 1 ? 'Garment' : 'Garments'}</span>
              {(selectedGender !== 'All' || selectedCategory !== 'All' || saleOnly || isNewArrivals) && (
                <button
                  type="button"
                  onClick={() => applyFilter('All', 'All', false, false)}
                  className="underline hover:opacity-75"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
              {visibleProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
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
        <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-bg)' }}>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-taupe)' }}>
            Loading Collection...
          </p>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
