'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="border-t border-gold/15 bg-obsidian text-cream pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 grid gap-12 md:grid-cols-5">
        
        {/* Brand info */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-heading text-3xl tracking-[0.32em] text-gold">
              NOVEIRA
            </span>
            <span className="block text-[9px] uppercase tracking-[0.4em] text-stone mt-1">
              Atelier
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-stone max-w-sm">
            Noveira is a modern luxury fashion house creating timeless garments for Women, Men, and Children. Crafted with fine cashmere, silk, and structured wools designed for generations.
          </p>
          <div className="pt-2 flex items-center gap-4 text-stone">
            {['Instagram', 'Pinterest', 'X', 'Facebook'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs uppercase tracking-[0.14em] transition-colors hover:text-gold"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="mb-4 font-heading text-sm uppercase tracking-[0.2em] text-gold">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs text-stone">
            <li>
              <Link href="/products?gender=Women" className="transition-colors hover:text-ivory">
                Women's Collection
              </Link>
            </li>
            <li>
              <Link href="/products?gender=Men" className="transition-colors hover:text-ivory">
                Men's Collection
              </Link>
            </li>
            <li>
              <Link href="/products?gender=Children" className="transition-colors hover:text-ivory">
                Children's Collection
              </Link>
            </li>
            <li>
              <Link href="/products?sale=true" className="transition-colors hover:text-gold">
                Archive & Sale
              </Link>
            </li>
            <li>
              <Link href="/products" className="transition-colors hover:text-ivory">
                All Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Client Care */}
        <div>
          <h4 className="mb-4 font-heading text-sm uppercase tracking-[0.2em] text-gold">
            Atelier Care
          </h4>
          <ul className="space-y-2.5 text-xs text-stone">
            <li>
              <a href="#" className="transition-colors hover:text-ivory">
                Complimentary Shipping
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-ivory">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-ivory">
                Size & Fit Guide
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-ivory">
                Bespoke Tailoring
              </a>
            </li>
            <li>
              <p className="mt-3 text-gold-light font-mono text-[11px]">concierge@noveira.com</p>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-4 font-heading text-sm uppercase tracking-[0.2em] text-gold">
            Private List
          </h4>
          <p className="text-xs text-stone leading-relaxed">
            Subscribe for private access to seasonal drops and bespoke previews.
          </p>
          <form
            className="mt-4 flex flex-col gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="bg-surface border border-gold/20 px-3.5 py-2.5 text-xs text-ivory placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-gold px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-gold-light"
            >
              Request Access
            </button>
            {subscribed && (
              <p className="text-[11px] text-gold animate-fade-in" role="status">
                Welcome to the Noveira Private List.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl border-t border-gold/10 px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone">
        <p>&copy; {new Date().getFullYear()} Noveira Atelier. All Rights Reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gold transition-colors">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
