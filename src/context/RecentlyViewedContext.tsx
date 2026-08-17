'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/src/data/products';
import { STORAGE_KEYS, readStorage, writeStorage } from '@/src/lib/storage';

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  hydrated: boolean;
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENTLY_VIEWED = 4;

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage<Product[]>(STORAGE_KEYS.recentlyViewed, []);
    if (Array.isArray(stored) && stored.length > 0) {
      setRecentlyViewed(stored.filter((item) => typeof item?.id === 'number').slice(0, MAX_RECENTLY_VIEWED));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE_KEYS.recentlyViewed, recentlyViewed);
  }, [recentlyViewed, hydrated]);

  const addRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => [
      product,
      ...prev.filter((p) => p.id !== product.id),
    ].slice(0, MAX_RECENTLY_VIEWED));
  }, []);

  const clearRecentlyViewed = useCallback(() => setRecentlyViewed([]), []);

  const value = useMemo(
    () => ({ recentlyViewed, hydrated, addRecentlyViewed, clearRecentlyViewed }),
    [recentlyViewed, hydrated, addRecentlyViewed, clearRecentlyViewed]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
