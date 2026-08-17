import { NextResponse } from 'next/server';
import { products as fallbackProducts, updateStock } from '@/src/data/products';
import { getSupabaseServerClient } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = getSupabaseServerClient();

  try {
    if (client) {
      const { data, error } = await client
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
  const client = getSupabaseServerClient();

  try {
    const body = await request.json();
    const { id, stock } = body;

    if (id === undefined || stock === undefined || typeof stock !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid product ID or stock count' }, { status: 400 });
    }

    updateStock(id, stock);

    if (client) {
      const { error } = await client
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
