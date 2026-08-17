'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/src/data/products';
import { STORAGE_KEYS, readStorage, writeStorage } from '@/src/lib/storage';

interface WishlistContextType {
  wishlistItems: Product[];
  hydrated: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage<Product[]>(STORAGE_KEYS.wishlist, []);
    if (Array.isArray(stored) && stored.length > 0) {
      setWishlistItems(stored.filter((item) => typeof item?.id === 'number'));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE_KEYS.wishlist, wishlistItems);
  }, [wishlistItems, hydrated]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) =>
      prev.some((item) => item.id === product.id) ? prev : [...prev, product]
    );
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const clearWishlist = useCallback(() => setWishlistItems([]), []);

  const value = useMemo(
    () => ({
      wishlistItems,
      hydrated,
      addToWishlist,
      removeFromWishlist,
      isInWishlist: (productId: number) => wishlistItems.some((item) => item.id === productId),
      toggleWishlist,
      clearWishlist,
      getWishlistCount: () => wishlistItems.length,
    }),
    [wishlistItems, hydrated, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
