'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/src/components/AdminGuard';
import { getAdminEmail, logoutAdmin } from '@/src/utils/auth';
import { formatPrice, products as initialProducts, Product } from '@/src/data/products';
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
  { id: 'catalogue', label: 'Catalogue & Stock' },
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

const S = {
  bg: 'var(--color-admin-bg)',
  surf: 'var(--color-admin-surf)',
  elev: 'var(--color-admin-elev)',
  border: 'var(--color-admin-border)',
  primary: 'var(--color-text-primary)',
  secondary: 'var(--color-text-secondary)',
  muted: 'var(--color-text-muted)',
  champ: 'var(--color-champagne)',
};

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2Y', '4Y', '6Y', '8Y', '10Y', '48', '50', '52', 'One Size'];

function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'Pending':    return 'badge-pending';
    case 'Processing': return 'badge-processing';
    case 'Shipped':    return 'badge-shipped';
    case 'Delivered':  return 'badge-delivered';
    case 'Cancelled':  return 'badge-cancelled';
    default:           return 'badge-pending';
  }
}

function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Modal states for Product CRUD
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Initial load: fetch orders & products from API routes (Supabase / local fallback)
  useEffect(() => {
    setOrders(sortByNewest(readOrders()));

    // Fetch Products
    fetch('/api/products')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setProductList(res.data);
        }
      })
      .catch((err) => console.error('API products fetch error:', err));

    // Fetch Orders
    fetch('/api/orders')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setOrders(sortByNewest(res.data));
        }
      })
      .catch((err) => console.error('API orders fetch error:', err))
      .finally(() => setHydrated(true));
  }, []);

  const adminEmail = useMemo(() => (hydrated ? getAdminEmail() : null), [hydrated]);

  const handleLogout = useCallback(() => {
    logoutAdmin();
    router.replace('/admin/login');
  }, [router]);

  const handleStatusChange = useCallback(async (id: string, status: OrderStatus) => {
    setOrders(sortByNewest(setOrderStatus(id, status)));
    setNotice(`Order ${id} updated to ${status}.`);

    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.error('API order status update error:', err);
    }
  }, []);

  const handleStockUpdate = useCallback(async (id: number, newStock: number) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
    setNotice(`Stock updated for Product #${id}.`);

    try {
      await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: newStock }),
      });
    } catch (err) {
      console.error('API stock update error:', err);
    }
  }, []);

  const handleSaveProduct = useCallback(async (formData: any, isEdit: boolean) => {
    try {
      const endpoint = '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product');
      }

      if (isEdit) {
        setProductList((prev) =>
          prev.map((p) => (p.id === formData.id ? { ...p, ...formData } : p))
        );
        setNotice(`Product "${formData.name}" updated successfully.`);
      } else {
        if (data.product) {
          setProductList((prev) => [data.product, ...prev]);
        }
        setNotice(`New Product "${formData.name}" added to store & database.`);
      }

      setIsAddModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    }
  }, []);

  const handleDeleteProduct = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete product');
      }

      setProductList((prev) => prev.filter((p) => p.id !== id));
      setNotice(`Product #${id} permanently removed.`);
      setDeletingProduct(null);
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(t);
  }, [notice]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedId) ?? null,
    [orders, selectedId]
  );

  const customers = useMemo(() => {
    const map = new Map<string, Customer>();
    for (const o of orders) {
      const ex = map.get(o.email);
      if (ex) {
        ex.orders += 1;
        ex.totalSpent += o.total;
        if (new Date(o.placedAt) > new Date(ex.lastOrder)) ex.lastOrder = o.placedAt;
      } else {
        map.set(o.email, { email: o.email, name: o.customer, phone: o.phone, orders: 1, totalSpent: o.total, lastOrder: o.placedAt });
      }
    }
    return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const revenue = useMemo(() =>
    orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0),
    [orders]
  );
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const lowStock     = productList.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const soldOut      = productList.filter((p) => p.stock === 0).length;

  const stats = [
    { label: 'Total Orders',    value: String(orders.length),      accent: false },
    { label: 'Pending',         value: String(pendingCount),       accent: pendingCount > 0 },
    { label: 'Revenue',         value: formatPrice(revenue),       accent: true },
    { label: 'Customers',       value: String(customers.length),   accent: false },
    { label: 'Catalog Items',   value: String(productList.length), accent: false },
    { label: 'Low Stock',       value: String(lowStock),           accent: lowStock > 0 },
    { label: 'Sold Out',        value: String(soldOut),            accent: soldOut > 0 },
  ];

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: S.bg }}>
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-2 border-t-transparent border-b-transparent rounded-full animate-spin-slow" style={{ borderColor: S.champ, borderTopColor: 'transparent' }} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: S.muted }}>Loading Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: S.bg, minHeight: '100vh', color: S.primary }}>
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-6 pb-8" style={{ borderBottom: `1px solid ${S.border}` }}>
          <div>
            <p className="font-heading tracking-[0.3em]" style={{ fontSize: '1.25rem', color: S.champ, fontWeight: 400 }}>NOVEIRA</p>
            <h1 className="font-heading mt-1" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: S.primary, fontWeight: 400 }}>Atelier Dashboard</h1>
            <p className="mt-1.5" style={{ fontSize: '0.9rem', color: S.muted }}>
              Signed in as <span style={{ color: S.champ }}>{adminEmail ?? 'admin'}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="btn-admin-outline">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              View Store
            </Link>
            <button type="button" onClick={handleLogout} className="btn-admin-primary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
        </header>

        {/* Notice */}
        {notice && (
          <div className="mt-5 flex items-center gap-2.5 px-4 py-3 animate-fade-in" style={{ background: 'rgba(80,200,100,0.12)', border: '1px solid rgba(80,200,100,0.3)' }}>
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#60C870' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <p style={{ fontSize: '0.9rem', color: '#60C870' }}>{notice}</p>
          </div>
        )}

        {/* Stats grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-5"
              style={{
                background: S.surf,
                border: `1px solid ${stat.accent ? 'rgba(196,163,90,0.3)' : S.border}`,
              }}
            >
              <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: S.muted }}>{stat.label}</p>
              <p className="font-heading mt-2.5" style={{ fontSize: '1.6rem', fontWeight: 400, color: stat.accent ? S.champ : S.primary }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <nav className="mt-10 flex flex-wrap gap-x-0 gap-y-2" style={{ borderBottom: `1px solid ${S.border}` }}>
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={active}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: active ? S.champ : S.secondary,
                  borderBottom: active ? `2px solid ${S.champ}` : '2px solid transparent',
                  marginBottom: '-1px',
                  transition: 'all 0.2s',
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Tab content */}
        <div className="mt-8 pb-24">
          {tab === 'overview' && (
            <OrdersTable
              orders={orders.slice(0, 5)}
              onSelect={setSelectedId}
              onStatusChange={handleStatusChange}
              emptyMessage="No orders placed yet."
              heading="Recent Orders"
            />
          )}
          {tab === 'orders' && (
            <OrdersTable
              orders={orders}
              onSelect={setSelectedId}
              onStatusChange={handleStatusChange}
              emptyMessage="No orders found."
              heading={`All Orders (${orders.length})`}
            />
          )}
          {tab === 'catalogue' && (
            <CatalogueTable
              products={productList}
              onStockUpdate={handleStockUpdate}
              onOpenAdd={() => setIsAddModalOpen(true)}
              onOpenEdit={(p) => setEditingProduct(p)}
              onOpenDelete={(p) => setDeletingProduct(p)}
            />
          )}
          {tab === 'customers' && <CustomersTable customers={customers} />}
        </div>
      </div>

      {/* Order modal */}
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedId(null)} />
      )}

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Delete Product Confirmation Modal */}
      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={() => handleDeleteProduct(deletingProduct.id)}
        />
      )}
    </main>
  );
}

/* ─── Orders Table ─────────────────────────────────────────────────── */
function OrdersTable({
  orders, onSelect, onStatusChange, emptyMessage, heading,
}: {
  orders: StoredOrder[];
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  emptyMessage: string;
  heading: string;
}) {
  const S = { border: 'var(--color-admin-border)', surf: 'var(--color-admin-surf)', elev: 'var(--color-admin-elev)', primary: 'var(--color-text-primary)', secondary: 'var(--color-text-secondary)', muted: 'var(--color-text-muted)', champ: 'var(--color-champagne)' };

  return (
    <div>
      <h2 className="font-heading mb-5" style={{ fontSize: '1.35rem', color: S.primary, fontWeight: 400 }}>{heading}</h2>
      {orders.length === 0 ? (
        <div className="py-20 text-center" style={{ background: S.surf, border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: '0.9375rem', color: S.muted }}>{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto" style={{ background: S.surf, border: `1px solid ${S.border}` }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${S.border}`, background: 'var(--color-admin-elev)' }}>
                {['Order Ref', 'Customer', 'Date', 'Total', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="admin-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: `1px solid ${S.border}`, transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'var(--color-admin-elev)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td className="admin-td">
                    <span className="font-mono text-sm" style={{ color: S.champ, fontWeight: 500 }}>{order.id}</span>
                  </td>
                  <td className="admin-td">
                    <span className="block font-medium" style={{ color: S.primary }}>{order.customer}</span>
                    <span className="mt-0.5 block text-sm" style={{ color: S.muted }}>{order.email}</span>
                  </td>
                  <td className="admin-td" style={{ color: S.secondary, whiteSpace: 'nowrap' }}>
                    {formatOrderDate(order.placedAt)}
                  </td>
                  <td className="admin-td" style={{ fontWeight: 600, color: S.champ, whiteSpace: 'nowrap' }}>
                    {formatPrice(order.total)}
                  </td>
                  <td className="admin-td">
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 text-sm rounded-sm cursor-pointer focus:outline-none ${statusBadgeClass(order.status)}`}
                      style={{ background: 'transparent', fontWeight: 500 }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s} style={{ background: 'var(--color-admin-elev)', color: 'var(--color-text-primary)' }}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="admin-td">
                    <button
                      type="button"
                      onClick={() => onSelect(order.id)}
                      style={{ fontSize: '0.8125rem', fontWeight: 500, color: S.champ, letterSpacing: '0.08em', textDecoration: 'underline', textDecorationColor: 'rgba(196,163,90,0.4)', textUnderlineOffset: '3px', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Catalogue & Stock Management Table ───────────────────────────── */
function CatalogueTable({
  products,
  onStockUpdate,
  onOpenAdd,
  onOpenEdit,
  onOpenDelete,
}: {
  products: Product[];
  onStockUpdate: (id: number, stock: number) => void;
  onOpenAdd: () => void;
  onOpenEdit: (product: Product) => void;
  onOpenDelete: (product: Product) => void;
}) {
  const S = { border: 'var(--color-admin-border)', surf: 'var(--color-admin-surf)', elev: 'var(--color-admin-elev)', primary: 'var(--color-text-primary)', secondary: 'var(--color-text-secondary)', muted: 'var(--color-text-muted)', champ: 'var(--color-champagne)' };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading" style={{ fontSize: '1.35rem', color: S.primary, fontWeight: 400 }}>Product Catalogue & Stock Control</h2>
          <p className="mt-1 text-sm" style={{ color: S.muted }}>
            Manage store garments, add new items, edit pricing, or remove pieces live in Supabase.
          </p>
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={onOpenAdd}
          className="btn-admin-primary flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      <div className="overflow-x-auto" style={{ background: S.surf, border: `1px solid ${S.border}` }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: `1px solid ${S.border}`, background: S.elev }}>
              {['ID', 'Garment', 'Gender', 'Category', 'Price', 'Sale Price', 'Stock Control', 'Status', 'Actions'].map((h) => (
                <th key={h} className="admin-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <StockRow
                key={product.id}
                product={product}
                onUpdate={onStockUpdate}
                onEdit={() => onOpenEdit(product)}
                onDelete={() => onOpenDelete(product)}
                S={S}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StockRow({
  product, onUpdate, onEdit, onDelete, S
}: {
  product: Product;
  onUpdate: (id: number, stock: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  S: Record<string, string>;
}) {
  const [stockVal, setStockVal] = useState(product.stock);

  useEffect(() => {
    setStockVal(product.stock);
  }, [product.stock]);

  const stockStatus = stockVal === 0 ? 'soldout' : stockVal <= 5 ? 'lowstock' : 'instock';
  const stockLabel  = stockVal === 0 ? 'Sold Out' : stockVal <= 5 ? 'Low Stock' : 'In Stock';

  const handleAdjust = (delta: number) => {
    const next = Math.max(0, stockVal + delta);
    setStockVal(next);
    onUpdate(product.id, next);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseInt(e.target.value || '0', 10);
    const next = Math.max(0, Number.isNaN(val) ? 0 : val);
    setStockVal(next);
    onUpdate(product.id, next);
  };

  return (
    <tr
      style={{ borderBottom: `1px solid ${S.border}`, transition: 'background 0.15s' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = S.elev; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
    >
      <td className="admin-td" style={{ color: S.muted }}>{product.id}</td>
      <td className="admin-td font-heading" style={{ color: S.primary, fontWeight: 500, fontSize: '0.9375rem' }}>
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-8 flex-shrink-0 bg-stone-800 overflow-hidden rounded-sm">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <span>{product.name}</span>
        </div>
      </td>
      <td className="admin-td" style={{ color: S.champ, fontWeight: 500 }}>{product.gender}</td>
      <td className="admin-td" style={{ color: S.secondary }}>{product.category}</td>
      <td className="admin-td" style={{ color: S.primary, whiteSpace: 'nowrap' }}>{product.price}</td>
      <td className="admin-td" style={{ color: S.champ, whiteSpace: 'nowrap' }}>{product.salePrice ?? '—'}</td>

      {/* Stock Control Cell */}
      <td className="admin-td">
        <div className="flex items-center gap-1.5" style={{ background: S.elev, padding: '3px 6px', borderRadius: '4px', border: `1px solid ${S.border}`, width: 'fit-content' }}>
          <button
            type="button"
            onClick={() => handleAdjust(-1)}
            aria-label={`Decrease stock for ${product.name}`}
            className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-[var(--color-admin-border)] font-bold text-sm"
            style={{ color: S.primary }}
          >
            −
          </button>

          <input
            type="number"
            min="0"
            value={stockVal}
            onChange={handleChange}
            className="w-12 text-center bg-transparent text-sm font-semibold focus:outline-none"
            style={{ color: S.champ }}
            aria-label={`Stock count for ${product.name}`}
          />

          <button
            type="button"
            onClick={() => handleAdjust(1)}
            aria-label={`Increase stock for ${product.name}`}
            className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-[var(--color-admin-border)] font-bold text-sm"
            style={{ color: S.primary }}
          >
            +
          </button>
        </div>
      </td>

      <td className="admin-td">
        <span className={`inline-block px-2.5 py-1 text-xs rounded-sm font-semibold badge-${stockStatus}`}>
          {stockLabel}
        </span>
      </td>

      {/* Actions (Edit / Delete) */}
      <td className="admin-td">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition-colors rounded"
            style={{ border: `1px solid ${S.border}`, color: S.champ, background: S.elev }}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition-colors rounded"
            style={{ border: '1px solid rgba(200,80,80,0.3)', color: '#E07070', background: 'rgba(200,80,80,0.1)' }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─── Add / Edit Product Form Modal ────────────────────────────────── */
function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (formData: any, isEdit: boolean) => void;
}) {
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [gender, setGender] = useState<string>(product?.gender || 'Women');
  const [category, setCategory] = useState(product?.category || 'Dresses');
  const [price, setPrice] = useState(product?.price || 'Rs.15,000.00 PKR');
  const [salePrice, setSalePrice] = useState(product?.salePrice || '');
  const [stock, setStock] = useState<number>(product?.stock ?? 10);
  const [image, setImage] = useState(product?.image || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop&q=80');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [description, setDescription] = useState(product?.description || '');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(product?.sizes || ['S', 'M', 'L']);
  const [colorsText, setColorsText] = useState(product?.colors?.join(', ') || 'Ivory, Onyx');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setSaving(true);

    const colorsArr = colorsText.split(',').map((c) => c.trim()).filter(Boolean);

    await onSave(
      {
        id: product?.id,
        name,
        gender,
        category,
        price,
        salePrice: salePrice || undefined,
        stock: Number(stock),
        image,
        description,
        sizes: selectedSizes,
        colors: colorsArr,
      },
      isEdit
    );

    setSaving(false);
  };

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(14,12,10,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto p-8 animate-scale-in"
        style={{ background: S.surf, border: `1px solid ${S.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
      >
        <div className="flex items-center justify-between pb-6 mb-6" style={{ borderBottom: `1px solid ${S.border}` }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: S.champ }}>
              Atelier Catalogue Manager
            </p>
            <h2 className="font-heading mt-1" style={{ fontSize: '1.6rem', color: S.primary, fontWeight: 400 }}>
              {isEdit ? `Edit Garment: ${product?.name}` : 'Add New Luxury Garment'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-60"
            style={{ color: S.muted, background: S.elev, border: `1px solid ${S.border}` }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Gender */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Garment Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Silk Wrap Dress"
                className="input-dark"
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Gender World</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input-dark cursor-pointer"
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Children">Children</option>
              </select>
            </div>
          </div>

          {/* Category & Stock */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Category (Type any custom category or choose)</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Jacket, Dresses, Suits, Knitwear"
                className="input-dark"
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                <option value="Jacket" />
                <option value="Dresses" />
                <option value="Suits" />
                <option value="Shirts" />
                <option value="Trousers" />
                <option value="Blazers" />
                <option value="Blouses" />
                <option value="Knitwear" />
                <option value="Outerwear" />
                <option value="Evening" />
                <option value="Skirts" />
                <option value="Accessories" />
                <option value="Footwear" />
                <option value="Playsuits" />
              </datalist>
            </div>
            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Stock Quantity</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="input-dark"
              />
            </div>
          </div>

          {/* Price & Sale Price */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Regular Price (PKR)</label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. Rs.14,300.00 PKR"
                className="input-dark"
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Sale Price (Optional)</label>
              <input
                type="text"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="e.g. Rs.9,800.00 PKR"
                className="input-dark"
              />
            </div>
          </div>

          {/* Photo Image Field (Upload from Device OR URL) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Garment Photo Image</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className="px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] rounded border transition-colors"
                  style={{
                    background: imageMode === 'upload' ? S.champ : S.elev,
                    color: imageMode === 'upload' ? '#1E1916' : S.secondary,
                    borderColor: imageMode === 'upload' ? S.champ : S.border,
                  }}
                >
                  📁 Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className="px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] rounded border transition-colors"
                  style={{
                    background: imageMode === 'url' ? S.champ : S.elev,
                    color: imageMode === 'url' ? '#1E1916' : S.secondary,
                    borderColor: imageMode === 'url' ? S.champ : S.border,
                  }}
                >
                  🔗 Image URL
                </button>
              </div>
            </div>

            {imageMode === 'upload' ? (
              <div>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded cursor-pointer transition-colors hover:border-[var(--color-champagne)]" style={{ background: S.elev, borderColor: S.border }}>
                  <svg className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: S.champ }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-semibold" style={{ color: S.primary }}>Click to Choose Image File from Device</p>
                  <p className="mt-1 text-xs" style={{ color: S.muted }}>PNG, JPG, WEBP, or GIF supported</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            setImage(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <input
                type="url"
                required={!image}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="input-dark"
              />
            )}

            {image && (
              <div className="mt-3 flex items-center justify-between p-3 rounded" style={{ background: S.elev, border: `1px solid ${S.border}` }}>
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-12 flex-shrink-0 overflow-hidden rounded">
                    {/* eslint-disable-next-html-element-suppression */}
                    <img src={image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: S.champ }}>Image Ready</p>
                    <p className="text-xs truncate max-w-xs" style={{ color: S.muted }}>
                      {image.startsWith('data:') ? 'Local Image File Loaded' : image}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="px-2.5 py-1 text-xs font-semibold uppercase text-[#E07070] hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Sizes */}
          <div>
            <label className="block mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className="px-3 py-1.5 text-xs font-semibold rounded border transition-colors"
                    style={{
                      background: active ? S.champ : S.elev,
                      color: active ? '#1E1916' : S.secondary,
                      borderColor: active ? S.champ : S.border,
                    }}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Available Shades / Colors (Comma separated)</label>
            <input
              type="text"
              value={colorsText}
              onChange={(e) => setColorsText(e.target.value)}
              placeholder="e.g. Ivory, Slate, Onyx"
              className="input-dark"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: S.muted }}>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the garment fabric, tailoring details, and fit..."
              className="input-dark"
              style={{ minHeight: '80px' }}
            />
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-4" style={{ borderTop: `1px solid ${S.border}` }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-admin-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-admin-primary"
            >
              {saving ? 'Saving to Database...' : isEdit ? 'Save Changes' : 'Add to Catalogue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirmation Modal ─────────────────────────────────────── */
function DeleteConfirmModal({
  product,
  onClose,
  onConfirm,
}: {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(14,12,10,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-8 animate-scale-in"
        style={{ background: S.surf, border: `1px solid ${S.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4 text-[#E07070]">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h3 className="font-heading text-2xl font-normal" style={{ color: S.primary }}>
            Confirm Deletion
          </h3>
        </div>

        <p style={{ color: S.secondary, fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: S.primary }}>&quot;{product.name}&quot;</strong> (Product #{product.id})? This action will permanently remove the item from your store and Supabase database.
        </p>

        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={onClose} className="btn-admin-outline">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] rounded transition-colors"
            style={{ background: '#E07070', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Customers Table ──────────────────────────────────────────────── */
function CustomersTable({ customers }: { customers: Customer[] }) {
  const S = { border: 'var(--color-admin-border)', surf: 'var(--color-admin-surf)', elev: 'var(--color-admin-elev)', primary: 'var(--color-text-primary)', secondary: 'var(--color-text-secondary)', muted: 'var(--color-text-muted)', champ: 'var(--color-champagne)' };

  return (
    <div>
      <h2 className="font-heading mb-5" style={{ fontSize: '1.35rem', color: S.primary, fontWeight: 400 }}>Customers ({customers.length})</h2>
      {customers.length === 0 ? (
        <div className="py-20 text-center" style={{ background: S.surf, border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: '0.9375rem', color: S.muted }}>No customer records yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto" style={{ background: S.surf, border: `1px solid ${S.border}` }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${S.border}`, background: S.elev }}>
                {['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Last Order'].map((h) => (
                  <th key={h} className="admin-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.email}
                  style={{ borderBottom: `1px solid ${S.border}`, transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = S.elev; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td className="admin-td" style={{ fontWeight: 500, color: S.primary }}>{c.name}</td>
                  <td className="admin-td" style={{ color: S.secondary }}>{c.email}</td>
                  <td className="admin-td" style={{ color: S.secondary }}>{c.phone}</td>
                  <td className="admin-td" style={{ color: S.primary, fontWeight: 500 }}>{c.orders}</td>
                  <td className="admin-td" style={{ color: S.champ, fontWeight: 600, whiteSpace: 'nowrap' }}>{formatPrice(c.totalSpent)}</td>
                  <td className="admin-td" style={{ color: S.muted, whiteSpace: 'nowrap' }}>{formatOrderDate(c.lastOrder)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Order Modal ──────────────────────────────────────────────────── */
function OrderModal({ order, onClose }: { order: StoredOrder; onClose: () => void }) {
  const S = { border: 'var(--color-admin-border)', surf: 'var(--color-admin-surf)', elev: 'var(--color-admin-elev)', primary: 'var(--color-text-primary)', secondary: 'var(--color-text-secondary)', muted: 'var(--color-text-muted)', champ: 'var(--color-champagne)' };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Order details: ${order.id}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(14,12,10,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto animate-scale-in"
        style={{ background: S.surf, border: `1px solid ${S.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 p-7 pb-5" style={{ borderBottom: `1px solid ${S.border}` }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: S.champ }}>Order Details</p>
            <h2 className="font-heading mt-1.5" style={{ fontSize: '1.5rem', color: S.primary, fontWeight: 400 }}>{order.id}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-60"
            style={{ color: S.muted, background: S.elev, border: `1px solid ${S.border}` }}
            aria-label="Close modal"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-7">
          {/* Order meta */}
          <dl className="grid gap-5 sm:grid-cols-2">
            {[
              { label: 'Placed On',       value: formatOrderDate(order.placedAt) },
              { label: 'Status',          value: order.status, accent: true },
              { label: 'Payment Method',  value: order.paymentMethod },
              { label: 'Phone',           value: order.phone },
            ].map((item) => (
              <div key={item.label}>
                <dt style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: S.muted, marginBottom: '0.375rem' }}>{item.label}</dt>
                <dd style={{ fontSize: '0.9375rem', color: item.accent ? S.champ : S.primary, fontWeight: item.accent ? 600 : 400 }}>{item.value}</dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: S.muted, marginBottom: '0.375rem' }}>Delivery Address</dt>
              <dd style={{ fontSize: '0.9375rem', color: S.primary }}>{order.customer} — {order.address}</dd>
            </div>
          </dl>

          {/* Order items */}
          <ul className="mt-7" style={{ borderTop: `1px solid ${S.border}`, paddingTop: '1.25rem' }}>
            {order.items.map((item) => (
              <li
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex items-start justify-between gap-4 py-3.5"
                style={{ borderBottom: `1px solid ${S.border}` }}
              >
                <div>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: S.primary }}>{item.name}</p>
                  <p className="mt-1" style={{ fontSize: '0.8125rem', color: S.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Size: {item.size} · Shade: {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: S.champ, flexShrink: 0 }}>{item.price}</p>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <dl className="mt-5 space-y-3" style={{ borderTop: `1px solid ${S.border}`, paddingTop: '1.25rem' }}>
            <div className="flex justify-between" style={{ fontSize: '0.9rem' }}>
              <dt style={{ color: S.secondary }}>Subtotal</dt>
              <dd style={{ color: S.primary }}>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between" style={{ fontSize: '0.9rem' }}>
              <dt style={{ color: S.secondary }}>Delivery</dt>
              <dd style={{ color: order.shipping === 0 ? S.champ : S.primary }}>
                {order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}
              </dd>
            </div>
            <div className="flex justify-between pt-3" style={{ borderTop: `1px solid ${S.border}`, fontSize: '1.0625rem' }}>
              <dt className="font-heading" style={{ color: S.primary, fontWeight: 500 }}>Total</dt>
              <dd className="font-heading" style={{ color: S.champ, fontWeight: 600 }}>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
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
