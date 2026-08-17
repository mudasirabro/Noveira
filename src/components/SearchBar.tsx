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
        className={`flex items-center gap-3 bg-surface border px-5 py-3.5 transition-all duration-300 ${
          isActive ? 'border-gold shadow-[0_0_25px_rgba(201,165,90,0.15)]' : 'border-gold/20 hover:border-gold/40'
        }`}
      >
        <svg
          className="h-5 w-5 flex-shrink-0 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
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
          className="flex-1 bg-transparent text-sm text-ivory outline-none placeholder:text-stone/70"
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
            className="flex-shrink-0 p-1 text-stone transition-colors hover:text-gold"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isSearchOpen && searchQuery.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[450px] overflow-y-auto border border-gold/20 bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-scale-in">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-heading text-lg text-ivory">No results found</p>
              <p className="mt-1 text-xs text-stone">
                Try searching for Women, Men, Suits, Silk, or Cashmere.
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-gold/15 bg-muted px-4 py-2.5">
                <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                  {searchResults.length} {searchResults.length === 1 ? 'piece' : 'pieces'} found
                </span>
              </div>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={handleResultClick}
                  className="group flex items-center gap-4 border-b border-gold/10 px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/70"
                >
                  <div className="h-16 w-14 flex-shrink-0 overflow-hidden bg-void">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-stone">
                      <span>{product.gender}</span>
                      <span>·</span>
                      <span>{product.category}</span>
                    </div>
                    <h4 className="truncate font-heading text-base text-ivory group-hover:text-gold transition-colors">{product.name}</h4>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-gold">{product.salePrice || product.price}</span>
                      {product.salePrice && (
                        <span className="text-[11px] text-stone line-through">{product.price}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    {product.isSale && (
                      <span className="bg-gold px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-obsidian">
                        Sale
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
