import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/src/data/products';
import ProductCard from '@/src/components/ProductCard';

const womenProducts = products.filter((p) => p.gender === 'Women').slice(0, 4);
const menProducts = products.filter((p) => p.gender === 'Men').slice(0, 4);
const childrenProducts = products.filter((p) => p.gender === 'Children').slice(0, 4);
const saleProducts = products.filter((p) => p.isSale).slice(0, 4);

const PERKS = [
  {
    icon: (
      <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13C10.832 21 4.786 21 3 13.5 3 6 12 3 12 3s9 3 9 10.5c-1.786 7.5-7.832 7.5-9 7.5z" />
      </svg>
    ),
    label: 'Master Craftsmanship',
    body: 'Hand-finished garments woven from ethically sourced Italian silk, cashmere, and superfine wool.'
  },
  {
    icon: (
      <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    label: 'Express Delivery',
    body: 'Complimentary shipping across Pakistan on all orders over Rs. 5,000.'
  },
  {
    icon: (
      <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: 'Bespoke Concierge',
    body: 'Personal styling assistance, size guidance, and custom alterations for your perfect fit.'
  },
  {
    icon: (
      <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    label: 'Seamless Returns',
    body: 'Enjoy stress-free 14-day returns and exchanges with full order tracking.'
  },
];

const CATEGORIES = [
  {
    name: "Women's Collection",
    gender: "Women",
    subtitle: "Draped Silk & Sculpted Tailoring",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop",
    href: "/products?gender=Women"
  },
  {
    name: "Men's Collection",
    gender: "Men",
    subtitle: "Italian Wool Suits & Fine Knitwear",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    href: "/products?gender=Men"
  },
  {
    name: "Children's Collection",
    gender: "Children",
    subtitle: "Pure Linen Playsuits & Soft Cashmere",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1000&fit=crop",
    href: "/products?gender=Children"
  }
];

export default function Home() {
  return (
    <main className="bg-obsidian text-ivory selection:bg-gold selection:text-obsidian overflow-hidden">
      
      {/* ── 1. Hero Section ───────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center border-b border-gold/15 grain">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gold-dim/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-surface/80 px-4 py-1.5 backdrop-blur-md mb-8 animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
              The 2026 Collection — Women · Men · Children
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-ivory max-w-5xl mx-auto animate-fade-up">
            Elegance Designed <br className="hidden sm:block" />
            <span className="text-gold-gradient italic font-serif">For Every Generation.</span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-stone animate-fade-up delay-100">
            Considered tailoring, pure cashmere knitwear, and floor-length evening silhouttes. Designed in house and crafted to endure.
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up delay-200">
            <Link href="/products?gender=Women" className="btn-primary">
              <span>Shop Women</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/products?gender=Men" className="btn-outline">
              <span>Shop Men</span>
            </Link>
            <Link href="/products?gender=Children" className="btn-outline">
              <span>Shop Children</span>
            </Link>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="mt-16 pt-12 border-t border-gold/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <p className="font-heading text-3xl text-gold">100%</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone mt-1">Ethical Italian Silk & Cashmere</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-gold">3 World</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone mt-1">Lines: Women, Men, Kids</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-gold">14-Day</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone mt-1">Hassle-Free Returns</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-gold">4.9★</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone mt-1">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Infinite Marquee Banner ─────────────────────────────────── */}
      <div className="border-b border-gold/15 bg-surface py-3.5 overflow-hidden">
        <div className="marquee-track flex whitespace-nowrap gap-12 text-[11px] uppercase tracking-[0.3em] text-gold font-medium animate-marquee">
          <span>NOVEIRA ATELIER</span>
          <span>•</span>
          <span>WOMEN’S HAUTE COUTURE</span>
          <span>•</span>
          <span>MEN’S BESPOKE TAILORING</span>
          <span>•</span>
          <span>CHILDREN’S LUXURY WEAR</span>
          <span>•</span>
          <span>CRAFTED IN SMALL BATCHES</span>
          <span>•</span>
          <span>WORLDWIDE EXPRESS SHIPPING</span>
          <span>•</span>
          <span>NOVEIRA ATELIER</span>
          <span>•</span>
          <span>WOMEN’S HAUTE COUTURE</span>
          <span>•</span>
          <span>MEN’S BESPOKE TAILORING</span>
          <span>•</span>
          <span>CHILDREN’S LUXURY WEAR</span>
          <span>•</span>
        </div>
      </div>

      {/* ── 3. Collections Spotlight Grid ───────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
            Curated Lines
          </span>
          <h2 className="mt-3 font-heading text-4xl sm:text-5xl text-ivory">
            Explore By Category
          </h2>
          <div className="w-16 h-0.5 bg-gold/40 mx-auto mt-4" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/20 bg-surface flex flex-col justify-end p-8"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
              
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
                  {cat.gender}
                </span>
                <h3 className="mt-1 font-heading text-3xl text-ivory group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-xs text-stone leading-relaxed">
                  {cat.subtitle}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore Line</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Women's Spotlight ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-surface border-y border-gold/15">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
                For Her
              </span>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl text-ivory">
                Women's Essentials
              </h2>
            </div>
            <Link
              href="/products?gender=Women"
              className="text-xs uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors flex items-center gap-2"
            >
              <span>View All Women</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {womenProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Men's Spotlight ───────────────────────────────────────── */}
      <section className="py-20 px-6 border-b border-gold/15">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
                For Him
              </span>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl text-ivory">
                Men's Tailoring & Knitwear
              </h2>
            </div>
            <Link
              href="/products?gender=Men"
              className="text-xs uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors flex items-center gap-2"
            >
              <span>View All Men</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {menProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Children's Spotlight ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-surface border-b border-gold/15">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
                For Little Ones
              </span>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl text-ivory">
                Children's Collection
              </h2>
            </div>
            <Link
              href="/products?gender=Children"
              className="text-xs uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors flex items-center gap-2"
            >
              <span>View All Children</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {childrenProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Sale / Archive Banner ─────────────────────────────────── */}
      {saleProducts.length > 0 && (
        <section className="py-20 px-6 border-b border-gold/15">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">Limited Access</span>
                <h2 className="mt-2 font-heading text-3xl sm:text-4xl text-ivory">Archive & Sale</h2>
              </div>
              <Link href="/products?sale=true" className="text-xs uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors">
                View All Sale &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {saleProducts.map((p) => (
                <ProductCard key={p.id} product={p} badge="Sale" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. Heritage / Brand Story Banner ─────────────────────────── */}
      <section className="relative py-28 px-6 bg-void grain border-b border-gold/15 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-semibold">
            The Philosophy
          </span>
          <h2 className="mt-4 font-heading text-4xl sm:text-6xl text-ivory leading-tight">
            "Clothing should be built like architecture — <br className="hidden sm:block" />
            <span className="text-gold-gradient italic">structured, refined, and made to last."</span>
          </h2>
          <p className="mt-6 text-sm sm:text-base text-stone max-w-2xl mx-auto leading-relaxed">
            At Noveira, every seam is considered. We source our cashmere from Mongolia, our silks from Como, and our wools from Biella. We craft in limited runs so that every piece maintains its standard of perfection.
          </p>
          <div className="mt-10">
            <Link href="/products" className="btn-primary">
              <span>Explore The Full Collection</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. Perks / Atelier Standards ───────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(({ icon, label, body }) => (
            <div key={label} className="p-6 rounded-sm bg-surface/50 border border-gold/10 hover:border-gold/30 transition-all duration-300">
              <div className="mb-4 inline-flex p-3 rounded-full bg-gold/10">
                {icon}
              </div>
              <h3 className="font-heading text-xl text-ivory">{label}</h3>
              <p className="mt-2 text-xs text-stone leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
