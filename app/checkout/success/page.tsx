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
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Loading order...</p>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md text-center">
        <h1 className="font-heading text-3xl text-ivory">Order Not Found</h1>
        <p className="mt-3 text-xs text-stone">
          We could not find an order reference matching "{orderId}".
        </p>
        <Link href="/products" className="mt-8 btn-primary">
          <span>Browse Collection</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="border border-gold/20 bg-surface p-8 text-center md:p-12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Order Confirmed</span>
        <h1 className="mt-3 font-heading text-4xl sm:text-5xl text-ivory">Thank You</h1>
        <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-stone">
          Your order has been received at Noveira Atelier. Our craftsmen will prepare your items with care.
        </p>

        <div className="mt-8 border-y border-gold/15 bg-muted/60 px-6 py-5 rounded-sm">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">Order Reference</p>
          <p className="mt-2 font-heading text-3xl tracking-[0.15em] text-ivory">{order.id}</p>
        </div>

        <ul className="mt-8 text-left">
          {order.items.map((item) => (
            <li
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex items-start justify-between gap-4 border-b border-gold/10 py-3.5 first:border-t"
            >
              <div>
                <p className="text-sm font-heading text-ivory">{item.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-stone">
                  Size: {item.size} &middot; Shade: {item.color} &middot; Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-xs font-semibold text-gold">{item.price}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <dt className="text-stone">Subtotal</dt>
            <dd className="text-ivory font-medium">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Shipping</dt>
            <dd className="text-gold font-medium">
              {order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-gold/15 pt-3">
            <dt className="font-heading text-base text-ivory">Total</dt>
            <dd className="font-heading text-lg text-gold font-bold">{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <dl className="mt-7 border-t border-gold/15 pt-6 text-left text-xs space-y-2">
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 uppercase tracking-[0.14em] text-gold font-medium">Recipient</dt>
            <dd className="text-stone">{order.customer} &mdash; {order.address}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 uppercase tracking-[0.14em] text-gold font-medium">Payment</dt>
            <dd className="text-stone">{order.paymentMethod}</dd>
          </div>
        </dl>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
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
    <main className="flex min-h-screen items-center justify-center bg-obsidian text-ivory px-6 py-14">
      <Suspense
        fallback={
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Loading</p>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}
