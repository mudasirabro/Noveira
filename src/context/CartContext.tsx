'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, getProductById, parsePrice } from '@/src/data/products';
import { STORAGE_KEYS, readStorage, writeStorage } from '@/src/lib/storage';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  salePrice?: string;
  image: string;
  quantity: number;
  size: string;
  color: string;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  hydrated: boolean;
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => boolean;
  removeFromCart: (id: number, size?: string, color?: string) => void;
  updateQuantity: (id: number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_STOCK = 15;

function sameLine(item: CartItem, id: number, size?: string, color?: string) {
  if (item.id !== id) return false;
  if (size !== undefined && item.size !== size) return false;
  if (color !== undefined && item.color !== color) return false;
  return true;
}

/** The seed catalog is immutable, so available stock is derived, never mutated. */
function stockFor(id: number): number {
  return getProductById(id)?.stock ?? DEFAULT_STOCK;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read once on mount. Rendering [] on the server and then hydrating keeps
  // markup stable; writes are gated on `hydrated` so the initial empty state
  // can never overwrite a stored cart.
  useEffect(() => {
    const stored = readStorage<CartItem[]>(STORAGE_KEYS.cart, []);
    if (Array.isArray(stored) && stored.length > 0) {
      setCartItems(stored.filter((item) => typeof item?.id === 'number'));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE_KEYS.cart, cartItems);
  }, [cartItems, hydrated]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const addToCart = useCallback(
    (product: Product, quantity: number, size?: string, color?: string): boolean => {
      const stock = product.stock ?? DEFAULT_STOCK;
      if (quantity < 1 || stock < 1) return false;

      const resolvedSize = size ?? product.sizes?.[0] ?? 'One size';
      const resolvedColor = color ?? product.colors?.[0] ?? 'As shown';
      let accepted = false;

      setCartItems((prev) => {
        const index = prev.findIndex((item) => sameLine(item, product.id, resolvedSize, resolvedColor));
        const alreadyInCart = index > -1 ? prev[index].quantity : 0;
        const room = stock - alreadyInCart;

        if (room <= 0) return prev;

        const added = Math.min(quantity, room);
        accepted = true;

        if (index > -1) {
          const next = [...prev];
          next[index] = { ...next[index], quantity: alreadyInCart + added, stock };
          return next;
        }

        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.salePrice ?? product.price,
            salePrice: product.salePrice,
            image: product.image,
            quantity: added,
            size: resolvedSize,
            color: resolvedColor,
            stock,
          },
        ];
      });

      return accepted;
    },
    []
  );
  const removeFromCart = useCallback((id: number, size?: string, color?: string) => {
    setCartItems((prev) => prev.filter((item) => !sameLine(item, id, size, color)));
  }, []);

  const updateQuantity = useCallback(
    (id: number, quantity: number, size?: string, color?: string) => {
      if (quantity < 1) {
        removeFromCart(id, size, color);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          sameLine(item, id, size, color)
            ? { ...item, quantity: Math.min(quantity, stockFor(id)) }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCartItems([]), []);

  const value = useMemo(
    () => ({
      cartItems,
      hydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal: () => cartTotal,
      getCartCount: () => cartCount,
    }),
    [cartItems, hydrated, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
