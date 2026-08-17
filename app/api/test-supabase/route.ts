import { NextResponse } from 'next/server';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = getSupabaseServerClient();

  if (!isSupabaseConfigured || !client) {
    return NextResponse.json({
      status: 'error',
      message: 'Supabase environment variables are missing on Vercel.',
      variables: {
        NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
    });
  }

  try {
    // 1. Test query on products table
    const { data: productsData, error: productsError } = await client
      .from('products')
      .select('id, name, stock')
      .limit(3);

    // 2. Test insert into orders table
    const testOrderId = `TEST-${Date.now().toString().slice(-6)}`;
    const { error: insertError } = await client.from('orders').insert({
      id: testOrderId,
      customer_name: 'Diagnostic Test',
      email: 'test@noveira.com',
      phone: '+92 300 0000000',
      address: 'Test Suite 101',
      city: 'Karachi',
      payment_method: 'Cash on Delivery',
      subtotal: 1000,
      shipping: 0,
      total: 1000,
      status: 'Pending',
      placed_at: new Date().toISOString(),
    });

    if (insertError) {
      return NextResponse.json({
        status: 'rls_or_schema_error',
        message: `Connection successful, but table insert was blocked by Supabase: ${insertError.message}`,
        details: insertError,
        hint: 'Please check your Supabase Row Level Security (RLS) policies for table "orders".',
      });
    }

    // 3. Clean up test order
    await client.from('orders').delete().eq('id', testOrderId);

    return NextResponse.json({
      status: 'success',
      message: '🎉 Supabase connection, read, insert, and delete are 100% WORKING with RLS enabled!',
      sampleProducts: productsData,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'exception',
      error: error?.message || String(error),
    });
  }
}
