'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { formatPrice } from '@/src/data/products';

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FLAT_RATE = 200;

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, hydrated } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal === 0 || subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <p className="text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-taupe)' }}>Loading shopping bag...</p>
      </main>
    );
  }

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div
        className="py-16 px-6 text-center"
        style={{ background: 'var(--color-bg-alt)', borderBottom: '1.5px solid var(--color-parchment)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: 'var(--color-champagne)' }}>Your Selection</p>
        <h1
          className="font-heading"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, color: 'var(--color-espresso)' }}
        >
          Shopping Bag
        </h1>
        {itemCount > 0 && (
          <p className="mt-3 text-base font-medium" style={{ color: 'var(--color-charcoal)' }}>
            {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16">
        {cartItems.length === 0 ? (
          <div className="py-28 text-center" style={{ borderTop: '1.5px solid var(--color-parchment)' }}>
            <h2 className="font-heading text-4xl mb-4" style={{ fontWeight: 400, color: 'var(--color-espresso)' }}>
              Your bag is empty
            </h2>
            <p className="text-base mb-10" style={{ color: 'var(--color-charcoal)' }}>
              Explore our Women, Men, and Children collections to find your next piece.
            </p>
            <Link href="/products" className="btn-primary">
              <span>Explore the Collection</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Cart items */}
            <ul className="lg:col-span-2 space-y-0" style={{ borderTop: '1.5px solid var(--color-parchment)' }}>
              {cartItems.map((item) => (
                <li
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex gap-6 py-8"
                  style={{ borderBottom: '1px solid var(--color-parchment)' }}
                >
                  <Link
                    href={`/products/${item.id}`}
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ width: '6.5rem', height: '8.5rem', background: 'var(--color-bg-warm)' }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="104px"
                      className="object-cover transition-transform duration-500 hover:scale-[1.04]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=260&fit=crop';
                      }}
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.id}`}
                      className="font-heading text-2xl transition-opacity hover:opacity-75"
                      style={{ color: 'var(--color-espresso)', fontWeight: 400 }}
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--color-taupe)' }}>
                      {item.size && `Size: ${item.size}`}{item.size && item.color && ' · '}{item.color && `Shade: ${item.color}`}
                    </p>
                    <p className="mt-2 text-base font-semibold" style={{ color: 'var(--color-espresso)' }}>
                      {item.price}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-6 pt-4">
                      {/* Quantity */}
                      <div className="flex items-center border" style={{ borderColor: 'var(--color-parchment)', minHeight: '44px' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="px-3.5 py-1.5 transition-opacity hover:opacity-60 font-semibold"
                          style={{ color: 'var(--color-espresso)', fontSize: '1.2rem' }}
                        >
                          −
                        </button>
                        <span
                          className="w-8 text-center text-sm font-semibold"
                          style={{ color: 'var(--color-espresso)' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          disabled={item.quantity >= item.stock}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="px-3.5 py-1.5 transition-opacity hover:opacity-60 disabled:opacity-30 font-semibold"
                          style={{ color: 'var(--color-espresso)', fontSize: '1.2rem' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-xs font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-60 underline underline-offset-4"
                        style={{ color: 'var(--color-taupe)', textDecorationColor: 'var(--color-parchment)' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Order Summary */}
            <aside
              className="h-fit p-8 lg:sticky lg:top-28"
              style={{ background: 'var(--color-bg-alt)', border: '1.5px solid var(--color-parchment)' }}
            >
              <h2 className="font-heading text-3xl mb-8" style={{ fontWeight: 400, color: 'var(--color-espresso)' }}>
                Order Summary
              </h2>

              <dl className="space-y-4" style={{ borderTop: '1.5px solid var(--color-parchment)', paddingTop: '1.75rem' }}>
                <div className="flex justify-between text-base">
                  <dt style={{ color: 'var(--color-charcoal)' }}>Subtotal ({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})</dt>
                  <dd className="font-semibold" style={{ color: 'var(--color-espresso)' }}>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-base">
                  <dt style={{ color: 'var(--color-charcoal)' }}>Shipping</dt>
                  <dd
                    className="font-semibold"
                    style={{ color: shipping === 0 ? 'var(--color-champagne)' : 'var(--color-espresso)' }}
                  >
                    {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                  </dd>
                </div>
                <div
                  className="flex justify-between pt-5"
                  style={{ borderTop: '1.5px solid var(--color-parchment)' }}
                >
                  <dt className="font-heading text-xl" style={{ color: 'var(--color-espresso)' }}>Total</dt>
                  <dd className="font-heading text-2xl font-semibold" style={{ color: 'var(--color-espresso)' }}>
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              {shipping > 0 && (
                <p className="mt-4 text-xs font-medium leading-relaxed" style={{ color: 'var(--color-taupe)' }}>
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for complimentary delivery.
                </p>
              )}

              <button
                type="button"
                onClick={() => router.push('/checkout')}
                className="mt-8 w-full btn-primary justify-center"
                style={{ minHeight: '52px', fontSize: '0.875rem' }}
              >
                <span>Proceed to Checkout</span>
              </button>

              <Link
                href="/products"
                className="mt-5 block text-center text-xs font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-taupe)' }}
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
