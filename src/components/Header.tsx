'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';

interface DropItem { href: string; label: string; }

const NAV: { label: string; href?: string; items?: DropItem[] }[] = [
  {
    label: 'Women',
    items: [
      { href: '/products?gender=Women', label: 'All Women' },
      { href: '/products?gender=Women&category=Dresses', label: 'Dresses' },
      { href: '/products?gender=Women&category=Blouses', label: 'Blouses' },
      { href: '/products?gender=Women&category=Blazers', label: 'Blazers' },
      { href: '/products?gender=Women&category=Knitwear', label: 'Knitwear' },
      { href: '/products?gender=Women&category=Evening', label: 'Evening' },
      { href: '/products?gender=Women&category=Skirts', label: 'Skirts' },
      { href: '/products?gender=Women&category=Accessories', label: 'Accessories' },
    ],
  },
  {
    label: 'Men',
    items: [
      { href: '/products?gender=Men', label: 'All Men' },
      { href: '/products?gender=Men&category=Suits', label: 'Suits' },
      { href: '/products?gender=Men&category=Shirts', label: 'Shirts' },
      { href: '/products?gender=Men&category=Trousers', label: 'Trousers' },
      { href: '/products?gender=Men&category=Knitwear', label: 'Knitwear' },
      { href: '/products?gender=Men&category=Footwear', label: 'Footwear' },
    ],
  },
  {
    label: 'Children',
    items: [
      { href: '/products?gender=Children', label: 'All Children' },
      { href: '/products?gender=Children&category=Dresses', label: 'Dresses' },
      { href: '/products?gender=Children&category=Knitwear', label: 'Knitwear' },
      { href: '/products?gender=Children&category=Trousers', label: 'Trousers' },
      { href: '/products?gender=Children&category=Playsuits', label: 'Playsuits' },
    ],
  },
  { label: 'New Arrivals', href: '/products' },
  { label: 'Sale', href: '/products?sale=true' },
];

export default function Header() {
  const { getCartCount, hydrated: cartHydrated } = useCart();
  const { getWishlistCount, hydrated: wishlistHydrated } = useWishlist();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const cartCount = cartHydrated ? getCartCount() : 0;
  const wishlistCount = wishlistHydrated ? getWishlistCount() : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenMenu(null); setIsMobileOpen(false); }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', esc);
    };
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/98 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.08),0_4px_20px_rgba(0,0,0,0.04)]'
            : 'bg-[#FAF8F5]/98 backdrop-blur-sm'
        }`}
      >
        {/* Top Announcement Bar */}
        <div
          className="text-center py-2.5 text-xs sm:text-sm uppercase tracking-[0.22em] font-semibold"
          style={{ background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
        >
          Complimentary Delivery on Orders Above PKR 5,000
        </div>

        <div ref={navRef} className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 relative">

          {/* Logo with fade + scale on load */}
          <Link href="/" aria-label="Noveira home" className="flex-shrink-0 group animate-scale-in">
            <div className="flex flex-col items-start leading-none">
              <span
                className="font-heading text-3xl tracking-[0.28em] transition-opacity duration-300 group-hover:opacity-75"
                style={{ color: 'var(--color-espresso)', fontWeight: 500 }}
              >
                NOVEIRA
              </span>
              <span
                className="text-[9px] uppercase tracking-[0.45em] mt-1 font-semibold"
                style={{ color: 'var(--color-taupe)' }}
              >
                Atelier
              </span>
            </div>
          </Link>

          {/* Desktop nav — centered with staggered slide-in */}
          <nav className="hidden absolute left-1/2 -translate-x-1/2 items-center gap-10 md:flex" aria-label="Main navigation">
            {NAV.map((item, idx) =>
              item.items ? (
                <div key={item.label} className="relative animate-slide-down" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <button
                    type="button"
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    className="nav-link flex items-center gap-1.5 text-sm uppercase tracking-[0.18em] transition-colors duration-200 py-1"
                    style={{ color: 'var(--color-espresso)', fontWeight: 500 }}
                  >
                    {item.label}
                    <svg
                      className={`h-3 w-3 transition-transform duration-300 ${openMenu === item.label ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {openMenu === item.label && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 py-3 animate-slide-down rounded-sm"
                      style={{
                        background: 'var(--color-bg)',
                        border: '1.5px solid var(--color-parchment)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                      }}
                      onMouseEnter={() => setOpenMenu(item.label)}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setOpenMenu(null)}
                          className="block px-6 py-2.5 text-xs uppercase tracking-[0.14em] font-medium transition-all duration-200 hover:pl-8"
                          style={{ color: 'var(--color-charcoal)' }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-espresso)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-charcoal)';
                          }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="nav-link text-sm uppercase tracking-[0.18em] transition-colors duration-200 py-1 animate-slide-down"
                  style={{ color: 'var(--color-espresso)', fontWeight: 500, animationDelay: `${idx * 0.08}s` }}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <Link
              href="/search"
              className="hidden md:flex items-center p-2 transition-opacity duration-200 hover:opacity-60"
              aria-label="Search"
              style={{ color: 'var(--color-espresso)' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 transition-opacity duration-200 hover:opacity-60"
              aria-label={`Wishlist, ${wishlistCount} items`}
              style={{ color: 'var(--color-espresso)' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                  style={{ background: 'var(--color-espresso)', color: 'var(--color-ivory)' }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 transition-opacity duration-200 hover:opacity-60"
              aria-label={`Cart, ${cartCount} items`}
              style={{ color: 'var(--color-espresso)' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                  style={{ background: 'var(--color-espresso)', color: 'var(--color-ivory)' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Portal link */}
            <Link
              href="/admin/login"
              className="hidden md:flex items-center gap-1.5 p-2 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity duration-200 hover:opacity-60"
              aria-label="Admin Portal"
              style={{ color: 'var(--color-espresso)' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen((v) => !v)}
              className="flex flex-col gap-[6px] p-2 transition-opacity hover:opacity-60 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${isMobileOpen ? 'translate-y-[8px] rotate-45' : ''}`}
                style={{ background: 'var(--color-espresso)' }}
              />
              <span
                className={`block h-0.5 w-5 transition-all duration-300 ${isMobileOpen ? 'opacity-0' : ''}`}
                style={{ background: 'var(--color-espresso)' }}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${isMobileOpen ? '-translate-y-[8px] -rotate-45' : ''}`}
                style={{ background: 'var(--color-espresso)' }}
              />
            </button>
          </div>
        </div>

        {/* Fine border line */}
        <div style={{ height: '1px', background: 'var(--color-parchment)' }} />
      </header>

      {/* Mobile Full-Screen Drawer Overlay — Renders ONLY when isMobileOpen is true */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col md:hidden animate-fade-in"
          style={{ background: 'var(--color-bg)' }}
          aria-modal="true"
        >
          {/* Mobile Header */}
          <div
            className="flex items-center justify-between px-6 py-5"
            style={{ borderBottom: '1.5px solid var(--color-parchment)' }}
          >
            <Link href="/" onClick={() => setIsMobileOpen(false)}>
              <span className="font-heading text-3xl tracking-[0.28em]" style={{ color: 'var(--color-espresso)' }}>
                NOVEIRA
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="p-2 transition-opacity hover:opacity-60"
              aria-label="Close menu"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-espresso)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Nav Links */}
          <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile navigation">
            <div className="flex flex-col">
              {NAV.map((item) =>
                item.items ? (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between py-5 text-left"
                      style={{ borderBottom: '1px solid var(--color-parchment)' }}
                    >
                      <span
                        className="font-heading text-3xl"
                        style={{ color: 'var(--color-espresso)' }}
                      >
                        {item.label}
                      </span>
                      <svg
                        className={`h-5 w-5 transition-transform duration-300 ${mobileExpanded === item.label ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        style={{ color: 'var(--color-charcoal)' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="py-4 pl-4 flex flex-col gap-2 animate-fade-in">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="py-3 text-sm uppercase tracking-[0.16em] font-semibold transition-colors hover:opacity-60"
                            style={{ color: 'var(--color-charcoal)' }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    onClick={() => setIsMobileOpen(false)}
                    className="py-5 font-heading text-3xl transition-opacity hover:opacity-60"
                    style={{ color: 'var(--color-espresso)', borderBottom: '1px solid var(--color-parchment)' }}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <Link
                href="/wishlist"
                onClick={() => setIsMobileOpen(false)}
                className="py-5 font-heading text-3xl transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-espresso)', borderBottom: '1px solid var(--color-parchment)' }}
              >
                Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsMobileOpen(false)}
                className="py-5 font-heading text-3xl transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-espresso)', borderBottom: '1px solid var(--color-parchment)' }}
              >
                Bag{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setIsMobileOpen(false)}
                className="py-5 font-heading text-3xl transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-champagne)' }}
              >
                Admin Portal
              </Link>
            </div>
          </nav>

          {/* Mobile Footer */}
          <div
            className="px-6 py-6 flex items-center gap-6"
            style={{ borderTop: '1px solid var(--color-parchment)' }}
          >
            {['Instagram', 'Pinterest', 'X'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs uppercase tracking-[0.2em] font-semibold transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-charcoal)' }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
