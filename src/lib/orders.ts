// src/lib/orders.ts
// Shared order model. Orders are placed at checkout, read back on the success
// page, and managed in the admin dashboard — all through localStorage.

import { STORAGE_KEYS, readStorage, writeStorage } from "@/src/lib/storage";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  size: string;
  color: string;
}

export interface StoredOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  placedAt: string;
}

export function createOrderId(): string {
  const timestamp = Date.now().toString(36).slice(-6).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NOV-${timestamp}${random}`;
}

export function readOrders(): StoredOrder[] {
  const orders = readStorage<StoredOrder[]>(STORAGE_KEYS.orders, []);
  return Array.isArray(orders) ? orders : [];
}

export function writeOrders(orders: StoredOrder[]): void {
  writeStorage(STORAGE_KEYS.orders, orders);
}

export function findOrder(id: string | null): StoredOrder | null {
  if (!id) return null;
  return readOrders().find((order) => order.id === id) ?? null;
}

export function setOrderStatus(id: string, status: OrderStatus): StoredOrder[] {
  const next = readOrders().map((order) =>
    order.id === id ? { ...order, status } : order
  );
  writeOrders(next);
  return next;
}

/** Newest first — checkout appends, so the stored array is oldest first. */
export function sortByNewest(orders: StoredOrder[]): StoredOrder[] {
  return [...orders].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  );
}

/** Client-only — call after hydration so server and client markup agree. */
export function formatOrderDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
