// src/lib/storage.ts
// SSR-safe localStorage helpers. Every read is guarded and never throws,
// so a corrupt or unavailable store degrades to the fallback instead of
// crashing render.

export const STORAGE_KEYS = {
  cart: "noveira.cart",
  wishlist: "noveira.wishlist",
  recentlyViewed: "noveira.recentlyViewed",
  orders: "noveira.orders",
  adminAuth: "noveira.adminAuth",
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage disabled — non-fatal.
  }
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Non-fatal.
  }
}
