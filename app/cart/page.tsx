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
      <main className="flex min-h-screen items-center justify-center bg-obsidian text-stone">
        <p className="text-[11px] uppercase tracking-[0.2em]">Loading shopping bag...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-obsidian text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <h1 className="font-heading text-4xl sm:text-5xl text-ivory">Shopping Bag</h1>

        {cartItems.length === 0 ? (
          <div className="mt-12 border border-gold/15 bg-surface py-20 text-center rounded-sm">
            <h2 className="font-heading text-2xl text-ivory">Your shopping bag is empty</h2>
            <p className="mt-2 text-xs text-stone">
              Explore our Women, Men, and Children collections to add items.
            </p>
            <Link href="/products" className="mt-8 btn-primary">
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            <ul className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <li
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex gap-5 border border-gold/15 bg-surface p-4 rounded-sm"
                >
                  <Link
                    href={`/products/${item.id}`}
                    className="relative h-32 w-24 shrink-0 overflow-hidden bg-void rounded-sm"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.id}`}
                      className="font-heading text-xl text-ivory transition-colors hover:text-gold"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-stone">
                      Size: {item.size} &middot; Shade: {item.color}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gold">{item.price}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-5 pt-4">
                      <div className="flex items-center border border-gold/20 bg-void rounded-sm">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, item.size, item.color)
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="px-3 py-1.5 text-gold transition-colors hover:text-ivory"
                        >
                          &minus;
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-ivory">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, item.size, item.color)
                          }
                          disabled={item.quantity >= item.stock}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="px-3 py-1.5 text-gold transition-colors hover:text-ivory disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-[10px] uppercase tracking-[0.16em] text-stone hover:text-gold transition-colors underline decoration-gold/20 underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-gold/20 bg-surface p-7 lg:sticky lg:top-28 rounded-sm">
              <h2 className="font-heading text-2xl text-ivory">Order Summary</h2>

              <dl className="mt-6 space-y-4 text-xs">
                <div className="flex justify-between">
                  <dt className="text-stone">Subtotal ({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})</dt>
                  <dd className="text-ivory font-semibold">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone">Shipping</dt>
                  <dd className="text-gold font-semibold">
                    {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-gold/15 pt-4">
                  <dt className="font-heading text-lg text-ivory">Total</dt>
                  <dd className="font-heading text-xl text-gold font-bold">{formatPrice(total)}</dd>
                </div>
              </dl>

              {shipping > 0 && (
                <p className="mt-4 text-[11px] text-stone">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more to qualify for complimentary delivery.
                </p>
              )}

              <button
                type="button"
                onClick={() => router.push('/checkout')}
                className="mt-7 w-full btn-primary justify-center"
              >
                <span>Proceed to Checkout</span>
              </button>

              <Link
                href="/products"
                className="mt-4 block text-center text-[10px] uppercase tracking-[0.18em] text-stone hover:text-gold transition-colors"
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
