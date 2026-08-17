'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { formatPrice } from '@/src/data/products';
import {
  createOrderId,
  readOrders,
  writeOrders,
  type StoredOrder,
} from '@/src/lib/orders';

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FLAT_RATE = 200;

const FIELDS = [
  { name: 'fullName', label: 'Full Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email Address', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone Number', type: 'tel', autoComplete: 'tel' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart, hydrated } = useCart();

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (cartItems.length === 0 || submitting) return;
    setSubmitting(true);

    const order: StoredOrder = {
      id: createOrderId(),
      customer: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      subtotal,
      shipping,
      total,
      status: 'Pending',
      paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card',
      placedAt: new Date().toISOString(),
    };

    const existing = readOrders();
    writeOrders([...existing, order]);

    clearCart();
    router.push(`/checkout/success?id=${order.id}`);
  };

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian text-stone">
        <p className="text-[11px] uppercase tracking-[0.2em]">Loading checkout...</p>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian px-6 text-ivory">
        <div className="max-w-md text-center">
          <h1 className="font-heading text-3xl text-ivory">Your Shopping Bag is Empty</h1>
          <p className="mt-3 text-xs text-stone">
            Add items to your bag before checking out.
          </p>
          <Link href="/products" className="mt-8 btn-primary">
            <span>Browse Collections</span>
          </Link>
        </div>
      </main>
    );
  }

  const inputClass =
    'w-full border border-gold/20 bg-surface px-4 py-3 text-xs text-ivory placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors rounded-sm';

  return (
    <main className="min-h-screen bg-obsidian text-ivory">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="font-heading text-4xl sm:text-5xl text-ivory">Atelier Checkout</h1>

        {/* Progress steps */}
        <ol className="mt-8 flex items-center gap-4">
          {['Shipping', 'Payment'].map((label, index) => {
            const number = index + 1;
            const active = step >= number;
            return (
              <li key={label} className="flex flex-1 items-center gap-3 last:flex-none">
                <span
                  className={`flex h-8 w-8 items-center justify-center border text-xs font-bold rounded-full ${
                    active
                      ? 'border-gold bg-gold text-obsidian'
                      : 'border-gold/20 bg-surface text-stone'
                  }`}
                >
                  {number}
                </span>
                <span
                  className={`text-[11px] uppercase tracking-[0.18em] ${
                    active ? 'text-gold font-semibold' : 'text-stone'
                  }`}
                >
                  {label}
                </span>
                {index === 0 && (
                  <span
                    className={`h-px flex-1 ${step >= 2 ? 'bg-gold' : 'bg-gold/20'}`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <form onSubmit={handleSubmit} className="mt-10 border border-gold/15 bg-surface p-7 md:p-9 rounded-sm">
          {step === 1 && (
            <>
              <h2 className="font-heading text-2xl text-ivory">Delivery Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {FIELDS.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-gold font-semibold"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      required
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="address"
                  className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-gold font-semibold"
                >
                  Street Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="mt-5 md:w-1/2">
                <label
                  htmlFor="zipCode"
                  className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-gold font-semibold"
                >
                  Postal Code
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  autoComplete="postal-code"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="mt-8 w-full btn-primary justify-center"
              >
                <span>Continue to Payment</span>
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-heading text-2xl text-ivory">Payment Option</h2>

              <fieldset className="mt-6">
                <legend className="sr-only">Payment method</legend>
                {[
                  { value: 'cod', title: 'Cash on Delivery', hint: 'Pay upon receiving your order.' },
                  { value: 'card', title: 'Card / Bank Transfer', hint: 'Payment details confirmed with concierge.' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`mb-3 flex cursor-pointer items-start gap-4 border p-4 transition-all duration-200 rounded-sm ${
                      formData.paymentMethod === option.value
                        ? 'border-gold bg-muted/80'
                        : 'border-gold/15 bg-void hover:border-gold/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={formData.paymentMethod === option.value}
                      onChange={handleChange}
                      className="mt-1 accent-gold"
                    />
                    <span>
                      <span className="block text-xs font-semibold text-ivory">{option.title}</span>
                      <span className="mt-0.5 block text-[11px] text-stone">{option.hint}</span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <dl className="mt-7 border-t border-gold/15 pt-6 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <dt className="text-stone">
                    Subtotal ({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})
                  </dt>
                  <dd className="text-ivory font-semibold">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone">Shipping</dt>
                  <dd className="text-gold font-semibold">
                    {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="mt-2 flex justify-between border-t border-gold/15 pt-3">
                  <dt className="font-heading text-lg text-ivory">Total</dt>
                  <dd className="font-heading text-xl text-gold font-bold">{formatPrice(total)}</dd>
                </div>
              </dl>

              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 btn-outline justify-center"
                >
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary justify-center disabled:opacity-60"
                >
                  <span>{submitting ? 'Placing Order...' : 'Place Order'}</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
