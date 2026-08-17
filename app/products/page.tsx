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

const GENDER_OPTIONS = [
  { value: 'All', label: 'All Lines' },
  { value: 'Women', label: 'Women' },
  { value: 'Men', label: 'Men' },
  { value: 'Children', label: 'Children' },
];

const COLLECTION_DESCRIPTIONS: Record<string, string> = {
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

      {/* ── Collection Banner ─────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 px-6 text-center"
        style={{
          background: 'linear-gradient(180deg, var(--color-bg-alt) 0%, var(--color-bg) 100%)',
          borderBottom: '1px solid var(--color-parchment)'
        }}
      >
        <div className="mx-auto max-w-3xl animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: 'var(--color-champagne)' }}>NOVEIRA ATELIER</p>
          <h1
            className="font-heading"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 4.75rem)', fontWeight: 400, color: 'var(--color-espresso)', lineHeight: 1.05 }}
          >
            {pageHeading}
          </h1>
          <p className="mt-2.5 font-heading text-xl italic" style={{ color: 'var(--color-charcoal)', fontWeight: 400 }}>
            Autumn / Winter 2026
          </p>

          <div className="w-16 h-0.5 mx-auto my-6" style={{ background: 'var(--color-champagne)', opacity: 0.6 }} />

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--color-charcoal)', maxWidth: '38rem', margin: '0 auto', fontWeight: 400 }}>
            {pageDescription}
          </p>

          {status === 'ready' && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-parchment bg-bg-alt">
              <span className="h-2 w-2 rounded-full bg-[var(--color-champagne)] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-espresso)' }}>
                {visibleProducts.length} {visibleProducts.length === 1 ? 'Piece Available' : 'Pieces Available'}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Filter Bar (Pill Tabs + Spaced Layout) ─────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--color-parchment)', background: 'var(--color-bg)' }} className="sticky top-[73px] z-30 backdrop-blur-md bg-white/95">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-4 space-y-4">

          {/* Row 1: Line Selection (Gender & Sale Pills) */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {GENDER_OPTIONS.map((g) => {
                const active = selectedGender === g.value && !saleOnly;
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => applyFilter(g.value, 'All', false)}
                    className={`pill-tab ${active ? 'active' : ''}`}
                  >
                    {g.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => applyFilter(selectedGender, 'All', true)}
                className={`pill-tab ${saleOnly ? 'active' : ''}`}
                style={{
                  color: saleOnly ? '#1C1917' : 'var(--color-champagne)',
                  borderColor: saleOnly ? 'var(--color-champagne)' : 'rgba(196,163,90,0.3)',
                }}
              >
                Sale
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex-shrink-0 relative">
              <button
                type="button"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-parchment bg-bg-alt text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 hover:border-espresso"
                style={{ color: 'var(--color-espresso)' }}
              >
                <span>Sort: {currentSortLabel}</span>
                <svg className={`h-3.5 w-3.5 transition-transform duration-300 ${showSortMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSortMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 py-2.5 z-40 animate-scale-in rounded-lg"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1.5px solid var(--color-parchment)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.14)'
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

          {/* Row 2: Category Sub-filters (Horizontal scrollable pill list) */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-parchment/60">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold mr-2 flex-shrink-0" style={{ color: 'var(--color-taupe)' }}>
                Category:
              </span>
              {categories.map((cat) => {
                const active = cat === selectedCategory && !saleOnly;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => applyFilter(selectedGender, cat, false)}
                    className={`pill-tab-dark text-xs ${active ? 'active' : ''}`}
                    style={{ padding: '0.4rem 1rem' }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

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
          <div className="py-32 text-center animate-fade-in">
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
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 animate-fade-in">
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
            <p className="text-xs uppercase tracking-[0.24em] font-semibold" style={{ color: 'var(--color-taupe)' }}>Loading Atelier Collection...</p>
          </div>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
