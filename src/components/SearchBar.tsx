'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearch } from '@/src/context/SearchContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, searchResults, isSearchOpen, setIsSearchOpen, clearSearch } =
    useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setIsFocused(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
        setIsFocused(true);
        document.getElementById('search-input')?.focus();
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsSearchOpen]);

  const handleResultClick = () => {
    clearSearch();
    setIsFocused(false);
  };

  const isActive = isFocused || isSearchOpen;

  return (
    <div ref={searchRef} className="relative mx-auto w-full max-w-2xl">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 transition-all duration-300`}
        style={{
          background: 'var(--color-bg)',
          border: isActive
            ? '1px solid var(--color-espresso)'
            : '1px solid var(--color-parchment)',
        }}
      >
        <svg
          className="h-4 w-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          style={{ color: 'var(--color-stone)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          id="search-input"
          type="search"
          placeholder="Search Women, Men, Children, Silk, Cashmere..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsSearchOpen(true);
          }}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--color-espresso)' }}
          aria-label="Search products"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearSearch();
            }}
            aria-label="Clear search"
            className="flex-shrink-0 p-1 transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-stone)' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isSearchOpen && searchQuery.trim().length > 0 && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[420px] overflow-y-auto animate-scale-in"
          style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-parchment)',
            borderTop: 'none',
            boxShadow: '0 20px 48px rgba(0,0,0,0.1)',
          }}
        >
          {searchResults.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="font-heading text-xl" style={{ color: 'var(--color-espresso)', fontWeight: 400 }}>
                No results found
              </p>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-taupe)' }}>
                Try searching for Women, Suits, Silk, or Cashmere.
              </p>
            </div>
          ) : (
            <>
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--color-parchment)' }}
              >
                <span className="text-label">
                  {searchResults.length} {searchResults.length === 1 ? 'piece' : 'pieces'} found
                </span>
              </div>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={handleResultClick}
                  className="group flex items-center gap-4 px-5 py-3.5 transition-all duration-200"
                  style={{ borderBottom: '1px solid var(--color-parchment)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-alt)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div
                    className="h-16 w-12 flex-shrink-0 overflow-hidden"
                    style={{ background: 'var(--color-bg-warm)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] uppercase tracking-[0.18em] mb-1" style={{ color: 'var(--color-stone)' }}>
                      {product.gender} · {product.category}
                    </div>
                    <h4
                      className="truncate font-heading text-base transition-opacity group-hover:opacity-70"
                      style={{ color: 'var(--color-espresso)', fontWeight: 400 }}
                    >
                      {product.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-espresso)' }}>
                        {product.salePrice || product.price}
                      </span>
                      {product.salePrice && (
                        <span className="text-xs line-through" style={{ color: 'var(--color-stone)' }}>
                          {product.price}
                        </span>
                      )}
                    </div>
                  </div>
                  {product.isSale && (
                    <span
                      className="flex-shrink-0 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em]"
                      style={{ background: 'var(--color-champagne)', color: 'var(--color-espresso)' }}
                    >
                      Sale
                    </span>
                  )}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
