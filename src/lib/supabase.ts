import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables provided by Vercel Supabase integration
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  supabaseAnonKey;

// Utility boolean to check if active Supabase connection credentials exist
export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseServiceKey || supabaseAnonKey));

let clientInstance: SupabaseClient | null = null;
let serverInstance: SupabaseClient | null = null;

// Public Client (for client-side reads)
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return clientInstance;
}

// Secure Server Client (for API Routes — uses Service Role Key if available to bypass RLS safely)
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!serverInstance) {
    serverInstance = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return serverInstance;
}

export const supabase = getSupabaseServerClient() || getSupabaseClient();

/* ────────────────────────────────────────────────────────────────────────── */
/* TypeScript Interfaces for Supabase Database Tables                         */
/* ────────────────────────────────────────────────────────────────────────── */

export interface DbProduct {
  id: number;
  name: string;
  gender: 'Women' | 'Men' | 'Children';
  category: string;
  price: string;
  price_num: number;
  sale_price?: string | null;
  is_sale: boolean;
  image: string;
  description: string;
  stock: number;
  sizes: string[];
  colors: string[];
  rating: number;
  reviews_count: number;
  created_at?: string;
}

export interface DbOrder {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  placed_at: string;
  created_at?: string;
}

export interface DbOrderItem {
  id?: string;
  order_id: string;
  product_id: number;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: string;
  created_at?: string;
}

export interface DbNewsletterSubscriber {
  id?: string;
  email: string;
  subscribed_at?: string;
}
