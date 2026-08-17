'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer style={{ background: 'var(--color-bg-darker)', color: 'var(--color-cream)' }}>
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-20 pb-14">
        <div className="grid gap-12 md:grid-cols-5 md:gap-8">

          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block group">
              <div className="flex flex-col items-start">
                <span
                  className="font-heading text-3xl tracking-[0.28em] transition-opacity group-hover:opacity-75"
                  style={{ color: 'var(--color-ivory)', fontWeight: 400 }}
                >
                  NOVEIRA
                </span>
                <span
                  className="text-[7px] uppercase tracking-[0.5em] mt-0.5"
                  style={{ color: 'rgba(217,208,190,0.5)', letterSpacing: '0.45em' }}
                >
                  Atelier
                </span>
              </div>
            </Link>

            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: 'rgba(217,208,190,0.55)' }}
            >
              A modern luxury fashion house creating timeless garments for Women, Men, and Children.
              Crafted with fine cashmere, silk, and structured wools.
            </p>

            <div className="flex items-center gap-5">
              {['Instagram', 'Pinterest', 'X', 'Facebook'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
                  style={{ color: 'rgba(217,208,190,0.5)' }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4
              className="mb-6 text-[10px] uppercase tracking-[0.28em]"
              style={{ color: 'rgba(217,208,190,0.45)' }}
            >
              Collections
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Women's Collection", href: "/products?gender=Women" },
                { label: "Men's Collection", href: "/products?gender=Men" },
                { label: "Children's Atelier", href: "/products?gender=Children" },
                { label: "Archive & Sale", href: "/products?sale=true" },
                { label: "All Pieces", href: "/products" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm transition-opacity hover:opacity-60"
                    style={{ color: 'rgba(217,208,190,0.6)' }}
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
              className="mb-6 text-[10px] uppercase tracking-[0.28em]"
              style={{ color: 'rgba(217,208,190,0.45)' }}
            >
              Atelier Care
            </h4>
            <ul className="space-y-3">
              {[
                'Complimentary Shipping',
                'Returns & Exchanges',
                'Size & Fit Guide',
                'Bespoke Tailoring',
                'Gift Packaging',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-opacity hover:opacity-60"
                    style={{ color: 'rgba(217,208,190,0.6)' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="mb-6 text-[10px] uppercase tracking-[0.28em]"
              style={{ color: 'rgba(217,208,190,0.45)' }}
            >
              Private Access
            </h4>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: 'rgba(217,208,190,0.55)' }}
            >
              Early access to seasonal drops and exclusive bespoke previews.
            </p>

            {!subscribed ? (
              <form
                className="space-y-2.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="w-full px-4 py-3 text-xs focus:outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(217,208,190,0.15)',
                    color: 'var(--color-ivory)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(217,208,190,0.4)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(217,208,190,0.15)')}
                />
                <button
                  type="submit"
                  className="w-full py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300"
                  style={{
                    background: 'rgba(196,163,90,0.15)',
                    border: '1px solid rgba(196,163,90,0.4)',
                    color: 'var(--color-champagne)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-champagne)';
                    e.currentTarget.style.color = 'var(--color-espresso)';
                    e.currentTarget.style.borderColor = 'var(--color-champagne)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(196,163,90,0.15)';
                    e.currentTarget.style.color = 'var(--color-champagne)';
                    e.currentTarget.style.borderColor = 'rgba(196,163,90,0.4)';
                  }}
                >
                  Request Access
                </button>
              </form>
            ) : (
              <p className="text-sm animate-fade-in" style={{ color: 'var(--color-champagne)' }}>
                Welcome to the Noveira Private List.
              </p>
            )}

            <p className="mt-4 text-[10px]" style={{ color: 'rgba(217,208,190,0.3)', letterSpacing: '0.12em' }}>
              concierge@noveira.com
            </p>
          </div>
        </div>
      </div>

      {/* Fine divider */}
      <div style={{ height: '1px', background: 'rgba(217,208,190,0.08)' }} />

      {/* Bottom bar */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(217,208,190,0.3)' }}>
          © {new Date().getFullYear()} Noveira Atelier. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6">
          {['Privacy Policy', 'Terms of Service', 'Accessibility'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
              style={{ color: 'rgba(217,208,190,0.35)' }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
