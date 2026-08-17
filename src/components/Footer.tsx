'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer style={{ background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}>
      {/* Top Divider */}
      <div style={{ height: '1px', background: 'var(--color-admin-border)' }} />

      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 pt-20 pb-16">
        <div className="grid gap-12 lg:grid-cols-5 md:gap-10">

          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block group animate-scale-in">
              <div className="flex flex-col items-start">
                <span
                  className="font-heading text-3xl tracking-[0.28em] transition-opacity group-hover:opacity-75"
                  style={{ color: '#F7F3EC', fontWeight: 500 }}
                >
                  NOVEIRA
                </span>
                <span
                  className="text-[9px] uppercase tracking-[0.45em] mt-1 font-semibold"
                  style={{ color: 'var(--color-champagne)' }}
                >
                  Atelier
                </span>
              </div>
            </Link>

            <p
              className="text-base leading-relaxed max-w-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              A modern luxury fashion house creating timeless garments for Women, Men, and Children.
              Crafted with Italian cashmere, silk, and structured wools.
            </p>

            <div className="flex items-center gap-6 pt-2">
              {['Instagram', 'Pinterest', 'X', 'Facebook'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs uppercase tracking-[0.2em] font-medium transition-colors hover:text-[var(--color-champagne)]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4
              className="mb-6 text-xs uppercase tracking-[0.26em] font-semibold"
              style={{ color: 'var(--color-champagne)' }}
            >
              Collections
            </h4>
            <ul className="space-y-3.5">
              {[
                { label: "Women's Collection", href: "/products?gender=Women" },
                { label: "Men's Tailoring", href: "/products?gender=Men" },
                { label: "Children's Atelier", href: "/products?gender=Children" },
                { label: "Archive & Sale", href: "/products?sale=true" },
                { label: "Full Collection", href: "/products" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-[var(--color-champagne)]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier Care */}
          <div>
            <h4
              className="mb-6 text-xs uppercase tracking-[0.26em] font-semibold"
              style={{ color: 'var(--color-champagne)' }}
            >
              Atelier Care
            </h4>
            <ul className="space-y-3.5">
              {[
                'Complimentary Shipping',
                'Returns & Exchanges',
                'Size & Fit Guide',
                'Bespoke Tailoring',
                'Admin Portal',
              ].map((item) => (
                <li key={item}>
                  {item === 'Admin Portal' ? (
                    <Link
                      href="/admin/login"
                      className="text-sm font-semibold transition-colors hover:text-[var(--color-champagne)]"
                      style={{ color: 'var(--color-champagne)' }}
                    >
                      {item}
                    </Link>
                  ) : (
                    <a
                      href="#"
                      className="text-sm transition-colors hover:text-[var(--color-champagne)]"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4
              className="mb-6 text-xs uppercase tracking-[0.26em] font-semibold flex items-center gap-2"
              style={{ color: 'var(--color-champagne)' }}
            >
              <span className="h-2 w-2 rounded-full bg-[var(--color-champagne)] animate-pulse" />
              Early Access
            </h4>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Receive early invitations to private sales, seasonal lookbooks, and limited drops.
            </p>

            {!subscribed ? (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="input-dark text-xs"
                  style={{ minHeight: '48px', padding: '0.75rem 1rem' }}
                />
                <button
                  type="submit"
                  className="w-full btn-admin-primary"
                  style={{ minHeight: '48px', fontSize: '0.8125rem' }}
                >
                  Request Early Access
                </button>
              </form>
            ) : (
              <div className="p-4 rounded border border-gold/30 bg-gold/10 animate-fade-in">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-champagne)' }}>
                  ✓ Welcome to the Noveira Private List.
                </p>
              </div>
            )}

            <p className="mt-4 text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
              concierge@noveira.com
            </p>
          </div>

        </div>
      </div>

      {/* Fine divider */}
      <div style={{ height: '1px', background: 'var(--color-admin-border)' }} />

      {/* Bottom bar */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} Noveira Atelier. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6">
          {['Privacy Policy', 'Terms of Service', 'Accessibility'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs uppercase tracking-[0.18em] transition-colors hover:text-[var(--color-champagne)]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
