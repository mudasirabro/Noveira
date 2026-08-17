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

/**
 * Uploads a base64 image or file data to the Supabase Storage bucket 'product-images'
 * and returns the public CDN URL.
 */
export async function uploadProductImageToStorage(imageData: string, productName: string): Promise<string> {
  const client = getSupabaseServerClient();
  if (!client || !imageData) return imageData;

  // If it's already an HTTP URL (e.g. Unsplash), no need to re-upload unless desired
  if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
    return imageData;
  }

  // Handle Base64 Data URLs (e.g. data:image/png;base64,iVBORw0KGgo...)
  if (imageData.startsWith('data:image/')) {
    try {
      const match = imageData.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (!match) return imageData;

      const contentType = match[1];
      const base64Data = match[2];
      const extension = contentType.split('/')[1]?.split('+')[0] || 'jpg';
      const buffer = Buffer.from(base64Data, 'base64');

      const sanitizedName = productName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
      const fileName = `garment-${sanitizedName}-${Date.now()}.${extension}`;

      const { data, error } = await client.storage
        .from('product-images')
        .upload(fileName, buffer, {
          contentType,
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Supabase Storage Upload Error:', error);
        return imageData; // Fallback to base64 if bucket doesn't exist or policy blocks
      }

      const { data: publicUrlData } = client.storage
        .from('product-images')
        .getPublicUrl(data.path);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    } catch (err) {
      console.error('Failed to upload image to Supabase Storage:', err);
    }
  }

  return imageData;
}

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
