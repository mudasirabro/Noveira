'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/src/components/AdminGuard';
import { getAdminEmail, logoutAdmin } from '@/src/utils/auth';
import { formatPrice, products } from '@/src/data/products';
import {
  ORDER_STATUSES,
  formatOrderDate,
  readOrders,
  setOrderStatus,
  sortByNewest,
  type OrderStatus,
  type StoredOrder,
} from '@/src/lib/orders';

type Tab = 'overview' | 'orders' | 'catalogue' | 'customers';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'catalogue', label: 'Catalogue' },
  { id: 'customers', label: 'Customers' },
];

interface Customer {
  email: string;
  name: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

const thClass =
  'px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-gold';
const tdClass = 'px-4 py-3 text-xs text-ivory';

function statusClass(status: OrderStatus): string {
  switch (status) {
    case 'Delivered':
      return 'border-gold bg-gold text-obsidian font-bold';
    case 'Cancelled':
      return 'border-stone/40 bg-surface text-stone';
    case 'Pending':
      return 'border-gold/50 bg-gold/20 text-gold';
    default:
      return 'border-gold/30 bg-muted text-ivory';
  }
}

function AdminDashboard() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setOrders(sortByNewest(readOrders()));
    setHydrated(true);
  }, []);

  const adminEmail = useMemo(() => (hydrated ? getAdminEmail() : null), [hydrated]);

  const handleLogout = useCallback(() => {
    logoutAdmin();
    router.replace('/admin/login');
  }, [router]);

  const handleStatusChange = useCallback((id: string, status: OrderStatus) => {
    setOrders(sortByNewest(setOrderStatus(id, status)));
    setNotice(`Order ${id} marked ${status.toLowerCase()}.`);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedId) ?? null,
    [orders, selectedId]
  );

  useEffect(() => {
    if (!selectedOrder) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedOrder]);

  const customers = useMemo(() => {
    const byEmail = new Map<string, Customer>();

    for (const order of orders) {
      const existing = byEmail.get(order.email);
      if (existing) {
        existing.orders += 1;
        existing.totalSpent += order.total;
        if (new Date(order.placedAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = order.placedAt;
        }
      } else {
        byEmail.set(order.email, {
          email: order.email,
          name: order.customer,
          phone: order.phone,
          orders: 1,
          totalSpent: order.total,
          lastOrder: order.placedAt,
        });
      }
    }

    return [...byEmail.values()].sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const revenue = useMemo(
    () =>
      orders
        .filter((order) => order.status !== 'Cancelled')
        .reduce((sum, order) => sum + order.total, 0),
    [orders]
  );

  const pendingCount = orders.filter((order) => order.status === 'Pending').length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const soldOut = products.filter((p) => p.stock === 0).length;

  const stats = [
    { label: 'Orders', value: String(orders.length) },
    { label: 'Pending', value: String(pendingCount) },
    { label: 'Revenue', value: formatPrice(revenue) },
    { label: 'Customers', value: String(customers.length) },
    { label: 'Total Items', value: String(products.length) },
    { label: 'Low Stock', value: String(lowStock) },
    { label: 'Sold Out', value: String(soldOut) },
  ];

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian text-stone">
        <p className="text-[11px] uppercase tracking-[0.2em]">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-obsidian text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-gold/15 pb-7">
          <div>
            <p className="font-heading text-2xl tracking-[0.3em] text-gold">NOVEIRA</p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl text-ivory">Atelier Dashboard</h1>
            <p className="mt-1.5 text-xs text-stone">
              Logged in as <span className="text-gold">{adminEmail ?? 'admin'}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn-outline">
              <span>View Store</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-primary"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {notice && (
          <p aria-live="polite" className="mt-4 text-xs text-gold animate-fade-in font-medium">
            ✓ {notice}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface border border-gold/15 p-4 rounded-sm">
              <p className="text-[9px] uppercase tracking-[0.18em] text-stone">{stat.label}</p>
              <p className="mt-2 font-heading text-2xl text-gold">{stat.value}</p>
            </div>
          ))}
        </div>

        <nav className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-gold/15">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={active}
                className={`-mb-px border-b-2 pb-3 text-xs uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? 'border-gold text-gold font-bold'
                    : 'border-transparent text-stone hover:text-ivory'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-8">
          {tab === 'overview' && (
            <OrdersTable
              orders={orders.slice(0, 5)}
              onSelect={setSelectedId}
              onStatusChange={handleStatusChange}
              emptyMessage="No orders placed yet."
            />
          )}

          {tab === 'orders' && (
            <OrdersTable
              orders={orders}
              onSelect={setSelectedId}
              onStatusChange={handleStatusChange}
              emptyMessage="No orders found."
            />
          )}

          {tab === 'catalogue' && <CatalogueTable />}

          {tab === 'customers' && <CustomersTable customers={customers} />}
        </div>
      </div>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedId(null)} />
      )}
    </main>
  );
}

function OrdersTable({
  orders,
  onSelect,
  onStatusChange,
  emptyMessage,
}: {
  orders: StoredOrder[];
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  emptyMessage: string;
}) {
  if (orders.length === 0) {
    return (
      <div className="border border-gold/15 bg-surface py-16 text-center rounded-sm">
        <p className="text-xs text-stone">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gold/15 bg-surface rounded-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gold/15 bg-muted">
            <th className={thClass}>Reference</th>
            <th className={thClass}>Customer</th>
            <th className={thClass}>Placed</th>
            <th className={thClass}>Total</th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gold/10 last:border-b-0 hover:bg-muted/40 transition-colors">
              <td className={`${tdClass} whitespace-nowrap font-mono text-gold`}>{order.id}</td>
              <td className={tdClass}>
                <span className="block font-medium text-ivory">{order.customer}</span>
                <span className="mt-0.5 block text-[11px] text-stone">{order.email}</span>
              </td>
              <td className={`${tdClass} whitespace-nowrap text-stone`}>
                {formatOrderDate(order.placedAt)}
              </td>
              <td className={`${tdClass} whitespace-nowrap font-semibold text-gold`}>{formatPrice(order.total)}</td>
              <td className={tdClass}>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                  className={`border px-2.5 py-1 text-xs rounded-sm focus:outline-none ${statusClass(order.status)}`}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status} className="bg-surface text-ivory">
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className={tdClass}>
                <button
                  type="button"
                  onClick={() => onSelect(order.id)}
                  className="text-[10px] uppercase tracking-[0.16em] text-gold hover:text-gold-light transition-colors underline decoration-gold/30 underline-offset-4"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CatalogueTable() {
  return (
    <>
      <p className="mb-4 border border-gold/15 bg-muted px-4 py-3 text-xs text-stone rounded-sm">
        Catalog is statically structured in <code className="text-gold">src/data/products.ts</code> for Women, Men, and Children lines.
      </p>

      <div className="overflow-x-auto border border-gold/15 bg-surface rounded-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gold/15 bg-muted">
              <th className={thClass}>ID</th>
              <th className={thClass}>Garment</th>
              <th className={thClass}>Gender</th>
              <th className={thClass}>Category</th>
              <th className={thClass}>Price</th>
              <th className={thClass}>Sale</th>
              <th className={thClass}>Stock</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status =
                product.stock === 0
                  ? 'Sold out'
                  : product.stock <= 5
                  ? 'Low stock'
                  : 'In stock';
              return (
                <tr key={product.id} className="border-b border-gold/10 last:border-b-0 hover:bg-muted/40 transition-colors">
                  <td className={`${tdClass} text-stone`}>{product.id}</td>
                  <td className={`${tdClass} font-heading text-sm text-ivory`}>{product.name}</td>
                  <td className={`${tdClass} text-gold font-semibold`}>{product.gender}</td>
                  <td className={`${tdClass} text-stone`}>{product.category}</td>
                  <td className={`${tdClass} whitespace-nowrap text-ivory`}>{product.price}</td>
                  <td className={`${tdClass} whitespace-nowrap text-gold`}>
                    {product.salePrice ?? '—'}
                  </td>
                  <td className={tdClass}>{product.stock}</td>
                  <td className={tdClass}>
                    <span
                      className={`inline-block border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] rounded-sm ${
                        product.stock === 0
                          ? 'border-stone/40 bg-surface text-stone'
                          : product.stock <= 5
                          ? 'border-gold/50 bg-gold/20 text-gold'
                          : 'border-gold/30 bg-muted text-ivory'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CustomersTable({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return (
      <div className="border border-gold/15 bg-surface py-16 text-center rounded-sm">
        <p className="text-xs text-stone">No customer records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gold/15 bg-surface rounded-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gold/15 bg-muted">
            <th className={thClass}>Name</th>
            <th className={thClass}>Email</th>
            <th className={thClass}>Phone</th>
            <th className={thClass}>Orders</th>
            <th className={thClass}>Total Spent</th>
            <th className={thClass}>Last Order</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.email} className="border-b border-gold/10 last:border-b-0 hover:bg-muted/40 transition-colors">
              <td className={`${tdClass} font-medium text-ivory`}>{customer.name}</td>
              <td className={`${tdClass} text-stone`}>{customer.email}</td>
              <td className={`${tdClass} text-stone`}>{customer.phone}</td>
              <td className={tdClass}>{customer.orders}</td>
              <td className={`${tdClass} whitespace-nowrap text-gold font-semibold`}>
                {formatPrice(customer.totalSpent)}
              </td>
              <td className={`${tdClass} whitespace-nowrap text-stone`}>
                {formatOrderDate(customer.lastOrder)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderModal({ order, onClose }: { order: StoredOrder; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-gold/20 bg-surface p-7 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gold/15 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">Order Details</p>
            <h2 className="mt-1 font-heading text-2xl tracking-[0.1em] text-ivory">{order.id}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] uppercase tracking-[0.18em] text-stone hover:text-gold transition-colors"
          >
            Close ✕
          </button>
        </div>

        <dl className="mt-5 grid gap-4 text-xs sm:grid-cols-2">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-gold">Placed On</dt>
            <dd className="mt-1 text-ivory">{formatOrderDate(order.placedAt)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-gold">Status</dt>
            <dd className="mt-1 text-ivory font-semibold">{order.status}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-gold">Payment Method</dt>
            <dd className="mt-1 text-ivory">{order.paymentMethod}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-gold">Phone</dt>
            <dd className="mt-1 text-ivory">{order.phone}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[10px] uppercase tracking-[0.14em] text-gold">Delivery Address</dt>
            <dd className="mt-1 text-ivory">
              {order.customer} &mdash; {order.address}
            </dd>
          </div>
        </dl>

        <ul className="mt-6 border-t border-gold/15 pt-4">
          {order.items.map((item) => (
            <li
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex items-start justify-between gap-4 border-b border-gold/10 py-3 last:border-b-0"
            >
              <div>
                <p className="text-xs font-medium text-ivory">{item.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-stone">
                  Size: {item.size} &middot; Shade: {item.color} &middot; Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-xs text-gold font-semibold">{item.price}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-5 border-t border-gold/15 pt-4 text-xs space-y-2">
          <div className="flex justify-between">
            <dt className="text-stone">Subtotal</dt>
            <dd className="text-ivory">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Delivery</dt>
            <dd className="text-gold">
              {order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-gold/15 pt-3">
            <dt className="font-heading text-base text-ivory">Total</dt>
            <dd className="font-heading text-lg text-gold font-bold">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
