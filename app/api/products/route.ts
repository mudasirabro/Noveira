import { NextResponse } from 'next/server';
import { products as fallbackProducts, updateStock } from '@/src/data/products';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: 'supabase', data });
      }
    }

    return NextResponse.json({ success: true, source: 'local', data: fallbackProducts });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ success: true, source: 'local', data: fallbackProducts });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stock } = body;

    if (id === undefined || stock === undefined || typeof stock !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid product ID or stock count' }, { status: 400 });
    }

    // Always update local memory/localStorage fallback
    updateStock(id, stock);

    // If Supabase is connected, sync stock to Supabase table 'products'
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('products')
        .update({ stock })
        .eq('id', id);

      if (error) {
        console.error('Supabase stock update error:', error);
      }
    }

    return NextResponse.json({ success: true, message: `Stock for Product #${id} updated to ${stock}` });
  } catch (error) {
    console.error('Update Stock API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
