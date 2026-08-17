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
  { name: 'fullName', label: 'Full Name', type: 'text', autoComplete: 'name', placeholder: 'e.g. Ayesha Khan' },
  { name: 'email', label: 'Email Address', type: 'email', autoComplete: 'email', placeholder: 'ayesha@example.com' },
  { name: 'phone', label: 'Phone Number', type: 'tel', autoComplete: 'tel', placeholder: '+92 300 1234567' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2', placeholder: 'e.g. Lahore' },
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      city: formData.city,
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

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
    } catch (err) {
      console.error('API order submit error:', err);
    }

    const existing = readOrders();
    writeOrders([...existing, order]);

    clearCart();
    router.push(`/checkout/success?id=${order.id}`);
  };

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-taupe)' }}>Loading checkout...</p>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-md text-center">
          <h1 className="font-heading text-4xl" style={{ color: 'var(--color-espresso)' }}>Your Shopping Bag is Empty</h1>
          <p className="mt-3 text-base" style={{ color: 'var(--color-charcoal)' }}>
            Add items to your bag before checking out.
          </p>
          <Link href="/products" className="mt-8 inline-block btn-primary">
            <span>Browse Collections</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-heading text-4xl sm:text-5xl" style={{ color: 'var(--color-espresso)', fontWeight: 400 }}>
          Atelier Checkout
        </h1>

        {/* Progress steps */}
        <ol className="mt-8 flex items-center gap-4">
          {['Shipping Details', 'Payment Option'].map((label, index) => {
            const number = index + 1;
            const active = step >= number;
            return (
              <li key={label} className="flex flex-1 items-center gap-3 last:flex-none">
                <span
                  className="flex h-9 w-9 items-center justify-center text-sm font-bold rounded-full transition-colors"
                  style={{
                    background: active ? 'var(--color-espresso)' : 'transparent',
                    color: active ? '#F5F1E8' : 'var(--color-taupe)',
                    border: active ? '2px solid var(--color-espresso)' : '1.5px solid var(--color-parchment)'
                  }}
                >
                  {number}
                </span>
                <span
                  className="text-xs uppercase tracking-[0.18em] font-semibold"
                  style={{ color: active ? 'var(--color-espresso)' : 'var(--color-taupe)' }}
                >
                  {label}
                </span>
                {index === 0 && (
                  <span
                    className="h-0.5 flex-1"
                    style={{ background: step >= 2 ? 'var(--color-espresso)' : 'var(--color-parchment)' }}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <form
          onSubmit={handleSubmit}
          className="mt-10 p-8 md:p-10"
          style={{
            background: 'var(--color-bg-alt)',
            border: '1.5px solid var(--color-parchment)'
          }}
        >
          {step === 1 && (
            <>
              <h2 className="font-heading text-3xl mb-6" style={{ color: 'var(--color-espresso)', fontWeight: 400 }}>
                Delivery Details
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {FIELDS.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-xs uppercase tracking-[0.16em] font-semibold"
                      style={{ color: 'var(--color-espresso)' }}
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
                      placeholder={field.placeholder}
                      className="input-light"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="address"
                  className="mb-2 block text-xs uppercase tracking-[0.16em] font-semibold"
                  style={{ color: 'var(--color-espresso)' }}
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
                  placeholder="House / Apartment number, Street name"
                  className="input-light"
                />
              </div>

              <div className="mt-6 md:w-1/2">
                <label
                  htmlFor="zipCode"
                  className="mb-2 block text-xs uppercase tracking-[0.16em] font-semibold"
                  style={{ color: 'var(--color-espresso)' }}
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
                  placeholder="e.g. 54000"
                  className="input-light"
                />
              </div>

              <button
                type="submit"
                className="mt-10 w-full btn-primary justify-center"
              >
                <span>Continue to Payment</span>
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-heading text-3xl mb-6" style={{ color: 'var(--color-espresso)', fontWeight: 400 }}>
                Payment Option
              </h2>

              <fieldset className="mt-6">
                <legend className="sr-only">Payment method</legend>
                {[
                  { value: 'cod', title: 'Cash on Delivery', hint: 'Pay upon receiving your order at your doorstep.' },
                  { value: 'card', title: 'Card / Bank Transfer', hint: 'Payment instructions will be sent via concierge.' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="mb-4 flex cursor-pointer items-start gap-4 p-5 transition-all duration-200 border"
                    style={{
                      borderColor: formData.paymentMethod === option.value ? 'var(--color-espresso)' : 'var(--color-parchment)',
                      background: formData.paymentMethod === option.value ? 'var(--color-bg)' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={formData.paymentMethod === option.value}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 accent-[var(--color-espresso)]"
                    />
                    <span>
                      <span className="block text-base font-semibold" style={{ color: 'var(--color-espresso)' }}>{option.title}</span>
                      <span className="mt-1 block text-sm" style={{ color: 'var(--color-charcoal)' }}>{option.hint}</span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <dl className="mt-8 border-t border-parchment pt-6 text-base space-y-3" style={{ borderTop: '1.5px solid var(--color-parchment)' }}>
                <div className="flex justify-between">
                  <dt style={{ color: 'var(--color-charcoal)' }}>
                    Subtotal ({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})
                  </dt>
                  <dd className="font-semibold" style={{ color: 'var(--color-espresso)' }}>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: 'var(--color-charcoal)' }}>Shipping</dt>
                  <dd className="font-semibold" style={{ color: shipping === 0 ? 'var(--color-champagne)' : 'var(--color-espresso)' }}>
                    {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="mt-3 flex justify-between pt-4" style={{ borderTop: '1.5px solid var(--color-parchment)' }}>
                  <dt className="font-heading text-xl" style={{ color: 'var(--color-espresso)' }}>Total</dt>
                  <dd className="font-heading text-2xl font-semibold" style={{ color: 'var(--color-espresso)' }}>{formatPrice(total)}</dd>
                </div>
              </dl>

              <div className="mt-10 flex gap-4">
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
