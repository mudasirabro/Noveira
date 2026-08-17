import { NextResponse } from 'next/server';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/src/lib/supabase';
import { readOrders, writeOrders, setOrderStatus, StoredOrder, OrderStatus } from '@/src/lib/orders';
import { updateStock } from '@/src/data/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = getSupabaseServerClient();

  try {
    if (client) {
      const { data: dbOrders, error } = await client
        .from('orders')
        .select('*, order_items(*)')
        .order('placed_at', { ascending: false });

      if (error) {
        console.error('Supabase GET Orders Error:', error);
      } else if (dbOrders && dbOrders.length > 0) {
        const formattedOrders: StoredOrder[] = dbOrders.map((o) => ({
          id: o.id,
          customer: o.customer_name,
          email: o.email,
          phone: o.phone,
          address: o.address,
          city: o.city,
          paymentMethod: o.payment_method,
          items: (o.order_items || []).map((item: any) => ({
            id: item.product_id,
            name: item.product_name,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: Number(o.subtotal),
          shipping: Number(o.shipping),
          total: Number(o.total),
          status: o.status as OrderStatus,
          placedAt: o.placed_at,
        }));

        return NextResponse.json({ success: true, source: 'supabase', data: formattedOrders });
      }
    }

    return NextResponse.json({ success: true, source: 'local', data: readOrders() });
  } catch (error) {
    console.error('Get Orders API Error:', error);
    return NextResponse.json({ success: true, source: 'local', data: readOrders() });
  }
}

export async function POST(request: Request) {
  const client = getSupabaseServerClient();

  try {
    const body = await request.json();
    const order: StoredOrder = body.order;

    if (!order || !order.id || !order.customer || !order.email) {
      return NextResponse.json({ success: false, error: 'Invalid order details provided' }, { status: 400 });
    }

    // 1. Save to local fallback storage
    const currentOrders = readOrders();
    writeOrders([order, ...currentOrders.filter((o) => o.id !== order.id)]);

    // 2. Reduce stock for items in local memory
    for (const item of order.items) {
      updateStock(item.id, Math.max(0, (item.quantity ?? 1)));
    }

    let supabaseSaved = false;
    let supabaseErrorDetails: string | null = null;

    // 3. Save to Supabase DB if configured
    if (client) {
      const { error: orderErr } = await client.from('orders').insert({
        id: order.id,
        customer_name: order.customer,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city || 'Karachi',
        payment_method: order.paymentMethod,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        status: order.status || 'Pending',
        placed_at: order.placedAt || new Date().toISOString(),
      });

      if (orderErr) {
        console.error('Supabase Order Insert Error:', orderErr);
        supabaseErrorDetails = orderErr.message;
      } else {
        supabaseSaved = true;

        const itemsToInsert = order.items.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          size: item.size || 'M',
          color: item.color || 'Default',
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsErr } = await client.from('order_items').insert(itemsToInsert);
        if (itemsErr) {
          console.error('Supabase Order Items Insert Error:', itemsErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      supabaseSaved,
      supabaseError: supabaseErrorDetails,
      configured: Boolean(client),
    });
  } catch (error: any) {
    console.error('Create Order API Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to process order' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const client = getSupabaseServerClient();

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing order ID or status' }, { status: 400 });
    }

    setOrderStatus(id, status as OrderStatus);

    if (client) {
      const { error } = await client
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Supabase Order Status Update Error:', error);
      }
    }

    return NextResponse.json({ success: true, message: `Order ${id} updated to ${status}` });
  } catch (error) {
    console.error('Update Order Status API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
