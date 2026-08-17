'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/src/data/products';
import { findOrder, type StoredOrder } from '@/src/lib/orders';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setOrder(findOrder(orderId));
    setHydrated(true);
  }, [orderId]);

  if (!hydrated) {
    return (
      <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-taupe)' }}>Loading order...</p>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md text-center">
        <h1 className="font-heading text-4xl" style={{ color: 'var(--color-espresso)' }}>Order Not Found</h1>
        <p className="mt-3 text-base" style={{ color: 'var(--color-charcoal)' }}>
          We could not find an order reference matching &ldquo;{orderId}&rdquo;.
        </p>
        <Link href="/products" className="mt-8 inline-block btn-primary">
          <span>Browse Collection</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div
        className="p-8 text-center md:p-12"
        style={{
          background: 'var(--color-bg-alt)',
          border: '1.5px solid var(--color-parchment)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.06)'
        }}
      >
        <span className="text-xs uppercase tracking-[0.28em] font-bold" style={{ color: 'var(--color-champagne)' }}>Order Confirmed</span>
        <h1 className="mt-3 font-heading text-4xl sm:text-5xl" style={{ color: 'var(--color-espresso)', fontWeight: 400 }}>Thank You</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
          Your order has been received at Noveira Atelier. Our craftsmen will prepare your items with care.
        </p>

        <div className="mt-8 px-6 py-5" style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-parchment)' }}>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-taupe)' }}>Order Reference</p>
          <p className="mt-2 font-heading text-3xl tracking-[0.15em] font-medium" style={{ color: 'var(--color-espresso)' }}>{order.id}</p>
        </div>

        <ul className="mt-8 text-left">
          {order.items.map((item) => (
            <li
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex items-start justify-between gap-4 py-4 first:border-t"
              style={{ borderBottom: '1px solid var(--color-parchment)', borderColor: 'var(--color-parchment)' }}
            >
              <div>
                <p className="text-base font-heading" style={{ color: 'var(--color-espresso)', fontWeight: 500 }}>{item.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--color-taupe)' }}>
                  Size: {item.size} · Shade: {item.color} · Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-base font-semibold" style={{ color: 'var(--color-espresso)' }}>{item.price}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 text-left text-base space-y-3">
          <div className="flex justify-between">
            <dt style={{ color: 'var(--color-charcoal)' }}>Subtotal</dt>
            <dd className="font-semibold" style={{ color: 'var(--color-espresso)' }}>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt style={{ color: 'var(--color-charcoal)' }}>Shipping</dt>
            <dd className="font-semibold" style={{ color: order.shipping === 0 ? 'var(--color-champagne)' : 'var(--color-espresso)' }}>
              {order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}
            </dd>
          </div>
          <div className="mt-3 flex justify-between pt-4" style={{ borderTop: '1.5px solid var(--color-parchment)' }}>
            <dt className="font-heading text-xl" style={{ color: 'var(--color-espresso)' }}>Total</dt>
            <dd className="font-heading text-2xl font-semibold" style={{ color: 'var(--color-espresso)' }}>{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <dl className="mt-8 pt-6 text-left text-sm space-y-3" style={{ borderTop: '1.5px solid var(--color-parchment)' }}>
          <div className="flex gap-4">
            <dt className="w-28 shrink-0 uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--color-espresso)' }}>Recipient</dt>
            <dd style={{ color: 'var(--color-charcoal)' }}>{order.customer} &mdash; {order.address}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-28 shrink-0 uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--color-espresso)' }}>Payment</dt>
            <dd style={{ color: 'var(--color-charcoal)' }}>{order.paymentMethod}</dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/products" className="btn-primary">
            <span>Continue Shopping</span>
          </Link>
          <Link href="/" className="btn-outline">
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16" style={{ background: 'var(--color-bg)' }}>
      <Suspense
        fallback={
          <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-taupe)' }}>Loading</p>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}
