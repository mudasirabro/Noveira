'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAdminEmail, logoutAdmin } from '@/src/utils/auth';
import { products, formatPrice } from '@/src/data/products';
import {
  ORDER_STATUSES,
  formatOrderDate,
  readOrders,
  writeOrders,
  type OrderStatus,
  type StoredOrder,
} from '@/src/lib/orders';

type Tab = 'overview' | 'orders' | 'catalogue' | 'customers';

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'orders', label: 'Orders' },
  { key: 'catalogue', label: 'Catalogue' },
  { key: 'customers', label: 'Customers' },
];

interface CustomerSummary {
  email: string;
  name: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'border-gold/50 bg-gold/20 text-gold',
  Processing: 'border-gold/30 bg-muted text-ivory',
  Shipped: 'border-gold/40 bg-surface text-gold',
  Delivered: 'border-gold bg-gold text-obsidian font-bold',
  Cancelled: 'border-stone/40 bg-surface text-stone',
};

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setOrders(readOrders());
    setAdminEmail(getAdminEmail());
    setHydrated(true);
  }, []);

  const updateStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((previous) => {
      const next = previous.map((order) =>
        order.id === orderId ? { ...order, status } : order
      );
      writeOrders(next);
      return next;
    });
  }, []);

  const handleLogout = useCallback(() => {
    logoutAdmin();
    router.replace('/admin/login');
  }, [router]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
      ),
    [orders]
  );

  const customers = useMemo(() => {
    const map = new Map<string, CustomerSummary>();

    for (const order of orders) {
      const existing = map.get(order.email);
      if (existing) {
        existing.orders += 1;
        existing.totalSpent += order.total;
        if (new Date(order.placedAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = order.placedAt;
        }
      } else {
        map.set(order.email, {
          email: order.email,
          name: order.customer,
          phone: order.phone,
          orders: 1,
          totalSpent: order.total,
          lastOrder: order.placedAt,
        });
      }
    }

    return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((order) => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0);

    return [
      { label: 'Orders', value: String(orders.length) },
      {
        label: 'Awaiting dispatch',
        value: String(orders.filter((o) => o.status === 'Pending').length),
      },
      { label: 'Revenue', value: formatPrice(revenue) },
      { label: 'Customers', value: String(customers.length) },
      { label: 'Pieces', value: String(products.length) },
      {
        label: 'Low stock',
        value: String(products.filter((p) => p.stock > 0 && p.stock <= 5).length),
      },
    ];
  }, [orders, customers.length]);

  const selectedOrder = useMemo(
    () => sortedOrders.find((order) => order.id === selectedId) ?? null,
    [sortedOrders, selectedId]
  );

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian text-stone">
        <p className="text-[11px] uppercase tracking-[0.2em]">Loading dashboard</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-obsidian text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-gold/15 pb-6">
          <div>
            <p className="font-heading text-2xl tracking-[0.3em] text-gold">NOVEIRA</p>
            <h1 className="mt-2 font-heading text-4xl text-ivory">Atelier Admin</h1>
            <p className="mt-2 text-xs text-stone">
              Signed in as <span className="text-gold">{adminEmail ?? 'admin'}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="btn-outline"
            >
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

        <dl className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface border border-gold/15 p-5 rounded-sm">
              <dt className="text-[9px] uppercase tracking-[0.18em] text-stone">{stat.label}</dt>
              <dd className="mt-2 font-heading text-2xl text-gold">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <nav className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-b border-gold/15">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-current={active}
                className={`-mb-px border-b-2 pb-3 text-xs uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? 'border-gold text-gold font-bold'
                    : 'border-transparent text-stone hover:text-ivory'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
