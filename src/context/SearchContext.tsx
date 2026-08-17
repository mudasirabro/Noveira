'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Product, products } from '@/src/data/products';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Product[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function searchProducts(query: string): Product[] {
  const term = query.toLowerCase().trim();
  if (term.length === 0) return [];

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      (product.description?.toLowerCase().includes(term) ?? false)
  );
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // The catalog is a static import, so results are derived — no fetch, no effect.
  const searchResults = useMemo(() => searchProducts(searchQuery), [searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearchOpen,
      setIsSearchOpen,
      clearSearch,
    }),
    [searchQuery, searchResults, isSearchOpen, clearSearch]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
