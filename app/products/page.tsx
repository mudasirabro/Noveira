'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, effectivePrice } from '@/src/data/products';
import ProductCard from '@/src/components/ProductCard';
import SearchBar from '@/src/components/SearchBar';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const GENDER_OPTIONS = ['All', 'Women', 'Men', 'Children'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category');
  const genderParam = searchParams.get('gender');
  const saleOnly = searchParams.get('sale') === 'true';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sortBy, setSortBy] = useState<SortKey>('featured');

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

  // Categories available for current gender selection
  const categories = useMemo(() => {
    let list = allProducts;
    if (selectedGender !== 'All') {
      list = list.filter((p) => p.gender === selectedGender);
    }
    return ['All', ...new Set(list.map((p) => p.category))];
  }, [allProducts, selectedGender]);

  const visibleProducts = useMemo(() => {
    let result = allProducts;

    if (selectedGender !== 'All') {
      result = result.filter((p) => p.gender === selectedGender);
    }
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (saleOnly) {
      result = result.filter((p) => p.isSale);
    }

    const sorted = [...result];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
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
    : selectedGender !== 'All'
    ? `${selectedGender}'s Collection`
    : selectedCategory !== 'All'
    ? selectedCategory
    : 'The Collection';

  return (
    <main className="min-h-screen bg-obsidian text-ivory">
      {/* Header Banner */}
      <section className="border-b border-gold/15 bg-surface py-16 px-6 text-center grain relative">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">Noveira Atelier</p>
          <h1 className="mt-3 font-heading text-4xl sm:text-6xl text-ivory">{pageHeading}</h1>
          <p className="mt-3 text-xs sm:text-sm text-stone">
            {status === 'ready'
              ? `${visibleProducts.length} ${visibleProducts.length === 1 ? 'piece' : 'pieces'} available`
              : 'Loading luxury catalog...'}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <SearchBar />

        {/* Gender Tabs */}
        <div className="mt-8 flex items-center justify-center gap-3 border-b border-gold/15 pb-6 overflow-x-auto">
          {GENDER_OPTIONS.map((g) => {
            const active = selectedGender === g && !saleOnly;
            return (
              <button
                key={g}
                type="button"
                onClick={() => applyFilter(g, 'All', false)}
                className={`px-5 py-2 text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${
                  active
                    ? 'bg-gold text-obsidian font-bold shadow-md'
                    : 'bg-surface text-stone hover:text-ivory border border-gold/10'
                }`}
              >
                {g === 'All' ? 'All Lines' : g}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => applyFilter(selectedGender, 'All', true)}
            className={`px-5 py-2 text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${
              saleOnly
                ? 'bg-gold text-obsidian font-bold shadow-md'
                : 'bg-surface text-gold hover:bg-gold/10 border border-gold/30'
            }`}
          >
            Sale Items
          </button>
        </div>

        {/* Category & Sort controls */}
        <div className="mt-6 flex flex-col gap-4 border-b border-gold/15 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {categories.map((cat) => {
              const active = cat === selectedCategory && !saleOnly;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => applyFilter(selectedGender, cat, false)}
                  className={`text-[11px] uppercase tracking-[0.16em] transition-colors pb-1 border-b ${
                    active
                      ? 'border-gold text-gold font-semibold'
                      : 'border-transparent text-stone hover:text-ivory'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-stone">
            Sort:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-surface border border-gold/20 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-obsidian text-ivory">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Grid Display */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {status === 'loading' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-surface" />
                <div className="mt-4 h-3 w-1/3 bg-surface" />
                <div className="mt-2 h-4 w-2/3 bg-surface" />
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="py-20 text-center">
            <p className="font-heading text-2xl text-ivory">Unable to load collection</p>
            <p className="mt-2 text-xs text-stone">Please refresh your browser.</p>
          </div>
        )}

        {status === 'ready' && visibleProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-heading text-2xl text-ivory">No pieces found</p>
            <p className="mt-2 text-xs text-stone">Try adjusting your filters.</p>
            <button
              type="button"
              onClick={() => applyFilter('All', 'All', false)}
              className="mt-6 btn-primary"
            >
              <span>View All Collection</span>
            </button>
          </div>
        )}

        {status === 'ready' && visibleProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
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
        <main className="flex min-h-screen items-center justify-center bg-obsidian text-stone">
          <p className="text-[11px] uppercase tracking-[0.2em]">Loading Catalog...</p>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
