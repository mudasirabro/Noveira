'use client';

import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/src/data/products';
import ProductCard from '@/src/components/ProductCard';
import { useEffect, useRef } from 'react';

const womenProducts = products.filter((p) => p.gender === 'Women').slice(0, 4);
const menProducts = products.filter((p) => p.gender === 'Men').slice(0, 4);
const childrenProducts = products.filter((p) => p.gender === 'Children').slice(0, 4);

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

const EDITORIALS = [
  {
    tag: "The Edit",
    title: "The Art of Everyday Elegance",
    subtitle: "Pieces that carry purpose and beauty in equal measure. Crafted from pure Italian silk and un-dyed cashmere.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=85",
    href: "/products?gender=Women",
    align: "left"
  },
  {
    tag: "For Him",
    title: "Considered Tailoring",
    subtitle: "Structure and softness, refined into the modern wardrobe. Sharp shoulders, fluid drape, immaculate seams.",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&h=1000&fit=crop&q=85",
    href: "/products?gender=Men",
    align: "right"
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
    const elements = el.querySelectorAll('.reveal, .reveal-fast');
    elements.forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const pageRef = useReveal();

  return (
    <main ref={pageRef} style={{ background: 'var(--color-bg)', color: 'var(--color-charcoal)' }}>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative" style={{ height: '92vh', minHeight: '620px' }}>
        {/* Background image */}
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
          {/* Gradient overlay — high readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(20,18,16,0.82) 0%, rgba(20,18,16,0.5) 60%, rgba(20,18,16,0.2) 100%)'
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative h-full flex items-center">
          <div className="mx-auto w-full max-w-7xl px-8 md:px-12">
            <div className="max-w-xl">
              <p
                className="text-xs sm:text-sm uppercase tracking-[0.24em] font-semibold mb-5 animate-fade-in"
                style={{ color: 'var(--color-champagne)' }}
              >
                The New Season — 2026
              </p>
              <h1
                className="font-heading animate-fade-up delay-100"
                style={{
                  fontSize: 'clamp(3.25rem, 7.5vw, 6.5rem)',
                  lineHeight: 1.02,
                  color: '#FFFFFF',
                  fontWeight: 400,
                  letterSpacing: '-0.02em'
                }}
              >
                Defined by<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300 }}>form.</em>{' '}
                Designed<br />
                for movement.
              </h1>
              <p
                className="mt-6 text-base sm:text-lg leading-relaxed animate-fade-up delay-200"
                style={{ color: '#F0ECE4', maxWidth: '34rem', fontWeight: 400 }}
              >
                Considered tailoring, fine knitwear, and silhouettes crafted to endure.
                Noveira — where craft meets quiet confidence.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up delay-300">
                <Link
                  href="/products?gender=Women"
                  className="btn-champagne"
                  style={{ minWidth: '180px', justifyContent: 'center' }}
                >
                  <span>Explore Women</span>
                </Link>
                <Link
                  href="/products?gender=Men"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.625rem',
                    padding: '0.875rem 2.25rem',
                    minHeight: '52px',
                    border: '2px solid rgba(255,255,255,0.7)',
                    color: '#FFFFFF',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FFFFFF';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <span>Explore Men</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-700">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Scroll
          </span>
          <div className="h-8 w-0.5" style={{ background: 'rgba(255,255,255,0.4)' }} />
        </div>
      </section>

      {/* ── 2. Marquee ─────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-bg-dark)', borderTop: '1px solid rgba(255,255,255,0.1)' }} className="py-4 overflow-hidden">
        <div className="marquee-track flex whitespace-nowrap gap-16 text-xs uppercase tracking-[0.35em] font-medium animate-marquee"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {['NOVEIRA ATELIER', '·', "WOMEN'S COLLECTION", '·', "MEN'S TAILORING", '·', "CHILDREN'S ATELIER", '·', 'CRAFTED IN SMALL BATCHES', '·', 'COMPLIMENTARY WORLDWIDE SHIPPING', '·', 'NOVEIRA ATELIER', '·', "WOMEN'S COLLECTION", '·', "MEN'S TAILORING", '·', "CHILDREN'S ATELIER", '·', 'CRAFTED IN SMALL BATCHES', '·', 'COMPLIMENTARY WORLDWIDE SHIPPING', '·'].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── 3. Category Trio ────────────────────────────────────────────── */}
      <section style={{ padding: '6.5rem 0', background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 text-center reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: 'var(--color-champagne)' }}>The Collections</p>
            <h2 className="font-heading" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', fontWeight: 400, color: 'var(--color-espresso)' }}>
              Shop by World
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative overflow-hidden block"
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

      {/* ── 4. Women's Collection ───────────────────────────────────────── */}
      <section style={{ padding: '6.5rem 0', background: 'var(--color-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 flex items-end justify-between reveal">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-2" style={{ color: 'var(--color-champagne)' }}>For Her</p>
              <h2 className="font-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 400, color: 'var(--color-espresso)' }}>
                Women&apos;s Collection
              </h2>
            </div>
            <Link
              href="/products?gender=Women"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-espresso)' }}
            >
              View All
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {womenProducts.map((p, i) => (
              <div key={p.id} className="reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                <ProductCard product={p} priority={i < 2} />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link href="/products?gender=Women" className="btn-outline">
              <span>View All Women</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Editorial Feature ────────────────────────────────────────── */}
      {EDITORIALS.map((ed, idx) => (
        <section
          key={ed.title}
          style={{ background: idx % 2 === 0 ? 'var(--color-bg)' : 'var(--color-bg-warm)' }}
        >
          <div className={`mx-auto max-w-7xl flex flex-col ${ed.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch`}>
            {/* Image */}
            <div className="md:w-1/2 relative overflow-hidden" style={{ minHeight: '580px' }}>
              <Image
                src={ed.image}
                alt={ed.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-[1400ms] group-hover:scale-[1.03]"
              />
            </div>
            {/* Text */}
            <div className="md:w-1/2 flex items-center px-8 py-16 md:px-16 md:py-24">
              <div className="max-w-md reveal">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: 'var(--color-champagne)' }}>{ed.tag}</p>
                <h2 className="font-heading mb-6" style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', fontWeight: 400, color: 'var(--color-espresso)' }}>
                  {ed.title}
                </h2>
                <p className="text-base leading-relaxed mb-10" style={{ color: 'var(--color-charcoal)', fontWeight: 400 }}>
                  {ed.subtitle}
                </p>
                <Link href={ed.href} className="btn-outline">
                  <span>Discover More</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── 6. Men's Collection ─────────────────────────────────────────── */}
      <section style={{ padding: '6.5rem 0', background: 'var(--color-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 flex items-end justify-between reveal">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-2" style={{ color: 'var(--color-champagne)' }}>For Him</p>
              <h2 className="font-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 400, color: 'var(--color-espresso)' }}>
                Men&apos;s Collection
              </h2>
            </div>
            <Link
              href="/products?gender=Men"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-espresso)' }}
            >
              View All
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {menProducts.map((p, i) => (
              <div key={p.id} className="reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Children's Collection ────────────────────────────────────── */}
      <section style={{ padding: '6.5rem 0', background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 flex items-end justify-between reveal">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-2" style={{ color: 'var(--color-champagne)' }}>For Little Ones</p>
              <h2 className="font-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 400, color: 'var(--color-espresso)' }}>
                Children&apos;s Atelier
              </h2>
            </div>
            <Link
              href="/products?gender=Children"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-espresso)' }}
            >
              View All
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {childrenProducts.map((p, i) => (
              <div key={p.id} className="reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Brand Story / Philosophy ─────────────────────────────────── */}
      <section className="relative overflow-hidden grain" style={{ background: 'var(--color-bg-dark)' }}>
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=800&fit=crop&q=60")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(50%)'
          }}
        />
        <div className="relative mx-auto max-w-4xl px-8 py-36 text-center">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-6 reveal" style={{ color: 'var(--color-champagne)' }}>The Philosophy</p>
          <h2
            className="font-heading reveal delay-100"
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              color: '#FFFFFF',
              fontWeight: 400,
              lineHeight: 1.15,
              fontStyle: 'italic'
            }}
          >
            &ldquo;Garments should be structured like architecture — refined, pure, and made to endure generations.&rdquo;
          </h2>
          <p
            className="mt-8 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto reveal delay-200"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            At Noveira, every seam is considered. We source cashmere from Mongolia, silk from Como, and wool from Biella.
            We craft in limited runs so that every piece maintains its standard of perfection.
          </p>
          <div className="mt-12 reveal delay-300">
            <Link href="/products" className="btn-champagne">
              <span>Explore The Full Collection</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. Atelier Pillars ──────────────────────────────────────────── */}
      <section style={{ padding: '6.5rem 0', background: 'var(--color-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-0 md:grid-cols-4" style={{ borderTop: '1.5px solid var(--color-parchment)' }}>
            {[
              {
                number: '01',
                label: 'Master Craftsmanship',
                body: 'Hand-finished garments woven from ethically sourced Italian silk, cashmere, and superfine wool.'
              },
              {
                number: '02',
                label: 'Complimentary Delivery',
                body: 'Free shipping across Pakistan on all orders above Rs. 5,000, delivered with extreme care.'
              },
              {
                number: '03',
                label: 'Bespoke Concierge',
                body: 'Personal styling assistance, size guidance, and custom alterations for your perfect fit.'
              },
              {
                number: '04',
                label: 'Seamless Returns',
                body: 'Stress-free 14-day returns and exchanges with full order tracking and dedicated support.'
              }
            ].map((perk, idx) => (
              <div
                key={perk.label}
                className="py-12 pr-8 reveal"
                style={{
                  borderRight: idx < 3 ? '1.5px solid var(--color-parchment)' : 'none',
                  paddingLeft: idx === 0 ? 0 : '2rem',
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <span className="font-heading text-5xl" style={{ color: 'var(--color-champagne)', fontWeight: 400 }}>
                  {perk.number}
                </span>
                <h3 className="mt-5 font-heading text-2xl" style={{ fontWeight: 500, color: 'var(--color-espresso)' }}>
                  {perk.label}
                </h3>
                <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                  {perk.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Newsletter ──────────────────────────────────────────────── */}
      <section style={{ padding: '7.5rem 0', background: 'var(--color-bg-warm)' }}>
        <div className="mx-auto max-w-xl px-6 text-center reveal">
          <p className="text-xs uppercase tracking-[0.24em] font-semibold mb-4" style={{ color: 'var(--color-champagne)' }}>Private List</p>
          <h2 className="font-heading mb-5" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', fontWeight: 400, color: 'var(--color-espresso)' }}>
            Be The First to Know
          </h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: 'var(--color-charcoal)' }}>
            Receive early access to new collections, private events, and seasonal lookbooks.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="input-light flex-1"
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.875rem 2rem', whiteSpace: 'nowrap' }}
            >
              <span>Join List</span>
            </button>
          </form>
          <p className="mt-4 text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--color-taupe)' }}>
            Unsubscribe anytime. Zero spam, ever.
          </p>
        </div>
      </section>

    </main>
  );
}
