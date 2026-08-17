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
    const onScroll = () => setScrolled(window.scrollY > 20);
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-obsidian/95 backdrop-blur-xl shadow-[0_4px_40px_rgba(0,0,0,0.5)]'
          : 'bg-obsidian/80 backdrop-blur-md'
      }`}
      style={{ borderBottom: '1px solid rgba(201,165,90,0.12)' }}
    >
      {/* Announcement bar */}
      <div
        className="text-center py-2 text-[10px] uppercase tracking-[0.28em]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,165,90,0.08), transparent)',
          borderBottom: '1px solid rgba(201,165,90,0.08)',
          color: 'var(--color-gold)',
        }}
      >
        Free delivery on orders above Rs.&thinsp;5,000 &nbsp;·&nbsp; New arrivals: Women · Men · Children
      </div>

      <div ref={navRef} className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">

        {/* Logo */}
        <Link href="/" aria-label="Noveira home" className="group flex items-baseline gap-2.5 flex-shrink-0">
          <span
            className="font-heading text-2xl leading-none tracking-[0.32em] transition-colors duration-300"
            style={{ color: 'var(--color-gold)' }}
          >
            NOVEIRA
          </span>
          <span className="hidden text-[9px] uppercase tracking-[0.38em] sm:block" style={{ color: 'var(--color-stone)' }}>
            Atelier
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map((item) =>
            item.items ? (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  className="nav-link flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors duration-200"
                  style={{ color: openMenu === item.label ? 'var(--color-gold)' : 'var(--color-cream)' }}
                >
                  {item.label}
                  <svg className={`h-3 w-3 transition-transform duration-200 ${openMenu === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openMenu === item.label && (
                  <div
                    className="absolute left-0 top-full mt-3 w-52 py-2 animate-scale-in"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid rgba(201,165,90,0.18)',
                      boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                    }}
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setOpenMenu(null)}
                        className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-all duration-200"
                        style={{ color: 'var(--color-cream)' }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-gold)';
                          (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '1.5rem';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-cream)';
                          (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '1rem';
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
                className="nav-link text-[11px] uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ color: 'var(--color-cream)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-cream)')}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative transition-colors duration-200"
            aria-label={`Wishlist, ${wishlistCount} items`}
            style={{ color: 'var(--color-stone)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-stone)')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                style={{ background: 'var(--color-gold)', color: 'var(--color-obsidian)' }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative transition-colors duration-200"
            aria-label={`Cart, ${cartCount} items`}
            style={{ color: 'var(--color-stone)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-stone)')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                style={{ background: 'var(--color-gold)', color: 'var(--color-obsidian)' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin */}
          <Link
            href="/admin/login"
            className="hidden transition-colors duration-200 md:block"
            aria-label="Admin"
            style={{ color: 'var(--color-stone)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-stone)')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileOpen((v) => !v)}
            className="transition-colors duration-200 md:hidden"
            aria-label="Toggle menu"
            style={{ color: 'var(--color-stone)' }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div
          className="border-t px-4 py-4 md:hidden animate-fade-in"
          style={{ background: 'var(--color-surface)', borderColor: 'rgba(201,165,90,0.12)' }}
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((item) =>
              item.items ? (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className="flex w-full items-center justify-between py-3 text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: 'var(--color-cream)', borderBottom: '1px solid rgba(201,165,90,0.08)' }}
                  >
                    {item.label}
                    <svg className={`h-3 w-3 transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="ml-4 flex flex-col gap-1 pb-2">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="py-2 text-[11px] uppercase tracking-[0.14em]"
                          style={{ color: 'var(--color-stone)' }}
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
                  className="py-3 text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: 'var(--color-cream)', borderBottom: '1px solid rgba(201,165,90,0.08)' }}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/wishlist"
              onClick={() => setIsMobileOpen(false)}
              className="py-3 text-[11px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--color-cream)' }}
            >
              Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
