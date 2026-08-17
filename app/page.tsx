'use client';

import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/src/data/products';
import ProductCard from '@/src/components/ProductCard';
import { useEffect, useRef, useState } from 'react';

const saleProducts = products.filter((p) => p.isSale).slice(0, 4);

const CATEGORIES = [
  {
    name: "Women",
    subtitle: "Autumn / Winter 2026",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&h=1200&fit=crop&q=85",
    href: "/products?gender=Women",
    cta: "Explore Women"
  },
  {
    name: "Men",
    subtitle: "Autumn / Winter 2026",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=1200&fit=crop&q=85",
    href: "/products?gender=Men",
    cta: "Explore Men"
  },
  {
    name: "Children",
    subtitle: "The Little Atelier",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&h=1200&fit=crop&q=85",
    href: "/products?gender=Children",
    cta: "Explore Children"
  }
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.08 }
    );
    const elements = el.querySelectorAll('.reveal');
    elements.forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const pageRef = useReveal();
  const [activeCategoryTab, setActiveCategoryTab] = useState('Women');

  return (
    <main ref={pageRef} style={{ background: 'var(--color-bg)', color: 'var(--color-charcoal)' }}>

      {/* ── 1. HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: '92vh', minHeight: '640px' }}>
        {/* Cinematic Background Visual */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&h=1200&fit=crop&q=90"
            alt="NOVEIRA Campaign — The New Season"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            style={{ transform: 'scale(1.02)' }}
          />
          {/* Subtle Vignette Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(20,18,16,0.85) 0%, rgba(20,18,16,0.55) 55%, rgba(20,18,16,0.2) 100%)'
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="mx-auto w-full max-w-7xl px-8 md:px-16">
            <div className="max-w-2xl">
              <p
                className="text-xs sm:text-sm uppercase tracking-[0.28em] font-semibold mb-6 animate-fade-in"
                style={{ color: 'var(--color-champagne)' }}
              >
                The Atelier Collection — 2026
              </p>

              {/* Split-word Headline Reveal */}
              <h1
                className="font-heading animate-fade-up delay-100"
                style={{
                  fontSize: 'clamp(3.5rem, 8vw, 6.75rem)',
                  lineHeight: 1.02,
                  color: '#FFFFFF',
                  fontWeight: 400,
                  letterSpacing: '-0.02em'
                }}
              >
                <span className="block">Defined by</span>
                <span className="block font-italic font-normal text-[var(--color-champ-light)]">
                  form.
                </span>
                <span className="block">Designed for movement.</span>
              </h1>

              <p
                className="mt-6 text-base sm:text-lg leading-relaxed animate-fade-up delay-200"
                style={{ color: '#F7F3EC', maxWidth: '34rem', fontWeight: 400 }}
              >
                Considered tailoring, fine cashmere, and fluid silhouettes.
                Noveira — where Italian craftsmanship meets modern elegance.
              </p>

              {/* Single Clear CTA */}
              <div className="mt-10 animate-fade-up delay-300">
                <Link
                  href="/products"
                  className="btn-champagne"
                  style={{ minWidth: '220px', justifyContent: 'center' }}
                >
                  <span>Explore Collection</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-500">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Scroll
          </span>
          <div className="h-8 w-0.5" style={{ background: 'rgba(255,255,255,0.4)' }} />
        </div>
      </section>

      {/* ── 2. CATEGORY NAVIGATION ───────────────────────────────────────── */}
      <section style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-parchment)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-6">
          <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
            {[
              { id: 'Women', label: "Women's Collection", href: '/products?gender=Women' },
              { id: 'Men', label: "Men's Tailoring", href: '/products?gender=Men' },
              { id: 'Children', label: "Children's Atelier", href: '/products?gender=Children' },
              { id: 'New', label: "New Arrivals", href: '/products' },
              { id: 'Sale', label: "Archive & Sale", href: '/products?sale=true' },
            ].map((cat) => {
              const active = activeCategoryTab === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`pill-tab ${active ? 'active' : ''}`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. SALE HIGHLIGHTS (PRODUCT GRID - 4 COLS) ────────────────── */}
      <section style={{ padding: '6.5rem 0', background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-14 text-center reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: 'var(--color-champagne)' }}>Limited Edition</p>
            <h2 className="font-heading" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 400, color: 'var(--color-espresso)' }}>
              Archive & Sale Highlights
            </h2>
            <p className="mt-3 text-base leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--color-charcoal)' }}>
              Curated garments from previous seasons offered at exclusive prices.
            </p>
          </div>

          {/* 4-column Product Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {saleProducts.map((p, i) => (
              <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <ProductCard product={p} priority={i < 2} />
              </div>
            ))}
          </div>

          <div className="mt-14 text-center reveal">
            <Link href="/products?sale=true" className="btn-outline">
              <span>View All Sale Pieces</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. BRAND STORY (ATELIER) ────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 text-center" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="mx-auto max-w-4xl px-8">

          {/* Animated Expanding Top Line */}
          <div
            className="h-0.5 mx-auto mb-10 transition-all duration-1000 reveal"
            style={{ background: 'var(--color-champagne)', maxWidth: '120px' }}
          />

          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-4 reveal" style={{ color: 'var(--color-champagne)' }}>
            The Noveira Heritage
          </p>

          <h2
            className="font-heading reveal"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              color: 'var(--color-espresso)',
              fontWeight: 400,
              lineHeight: 1.15,
              fontStyle: 'italic'
            }}
          >
            &ldquo;Garments should be structured like architecture — refined, pure, and made to endure generations.&rdquo;
          </h2>

          <p
            className="mt-8 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto reveal"
            style={{ color: 'var(--color-charcoal)' }}
          >
            Every seam is considered. We source cashmere from Mongolia, silk from Como, and wool from Biella.
            Crafted in small runs to preserve immaculate standard and perfection.
          </p>

          {/* Animated Expanding Bottom Line */}
          <div
            className="h-0.5 mx-auto mt-10 transition-all duration-1000 reveal"
            style={{ background: 'var(--color-champagne)', maxWidth: '120px' }}
          />

        </div>
      </section>

      {/* ── 5. WORLD CATEGORIES ───────────────────────────────────────── */}
      <section style={{ padding: '6.5rem 0', background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative overflow-hidden block rounded-sm reveal"
                style={{ aspectRatio: '3/4' }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(to top, rgba(20,18,16,0.85) 0%, rgba(20,18,16,0.2) 55%, transparent 100%)'
                  }}
                />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-xs uppercase tracking-[0.24em] font-semibold mb-2" style={{ color: 'var(--color-champagne)' }}>
                    {cat.subtitle}
                  </p>
                  <h3 className="font-heading text-4xl mb-4" style={{ color: '#FFFFFF', fontWeight: 400 }}>
                    {cat.name}
                  </h3>
                  <div
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-300 group-hover:gap-4"
                    style={{ color: '#FFFFFF' }}
                  >
                    <span>{cat.cta}</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
