import { NextResponse } from 'next/server';
import {
  products as fallbackProducts,
  updateStock,
  addLocalProduct,
  updateLocalProduct,
  deleteLocalProduct,
  Product,
  parsePrice,
  formatPrice,
} from '@/src/data/products';
import { getSupabaseServerClient } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = getSupabaseServerClient();

  try {
    if (client) {
      const { data: dbProducts, error } = await client
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!error && dbProducts && dbProducts.length > 0) {
        const formatted: Product[] = dbProducts.map((p) => ({
          id: Number(p.id),
          name: p.name,
          price: p.price,
          salePrice: p.sale_price || undefined,
          image: p.image,
          isSale: Boolean(p.is_sale),
          category: p.category,
          gender: p.gender,
          rating: Number(p.rating || 5),
          reviews: Number(p.reviews_count || p.reviews || 0),
          description: p.description,
          sizes: p.sizes || ['S', 'M', 'L'],
          colors: p.colors || ['Default'],
          stock: Number(p.stock),
        }));

        return NextResponse.json({ success: true, source: 'supabase', data: formatted });
      }
    }

    return NextResponse.json({ success: true, source: 'local', data: fallbackProducts });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ success: true, source: 'local', data: fallbackProducts });
  }
}

// ─── ADD NEW PRODUCT ──────────────────────────────────────────────────
export async function POST(request: Request) {
  const client = getSupabaseServerClient();

  try {
    const body = await request.json();
    const { name, gender, category, price, salePrice, image, description, stock, sizes, colors } = body;

    if (!name || !gender || !category || !price) {
      return NextResponse.json({ success: false, error: 'Name, Gender, Category, and Price are required.' }, { status: 400 });
    }

    const numericPrice = parsePrice(price);
    const formattedPriceStr = price.includes('PKR') ? price : formatPrice(numericPrice);
    const formattedSalePriceStr = salePrice ? (salePrice.includes('PKR') ? salePrice : formatPrice(parsePrice(salePrice))) : undefined;

    const prodData: Omit<Product, 'id'> = {
      name,
      gender: gender as any,
      category,
      price: formattedPriceStr,
      salePrice: formattedSalePriceStr,
      isSale: Boolean(salePrice),
      image: image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop&q=80',
      description: description || '',
      stock: Number(stock ?? 10),
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L'],
      colors: Array.isArray(colors) && colors.length > 0 ? colors : ['Default'],
      rating: 5.0,
      reviews: 0,
    };

    // Save to local memory
    const newProduct = addLocalProduct(prodData);

    // Save to Supabase DB if configured
    let supabaseSaved = false;
    if (client) {
      const { data: dbData, error: dbErr } = await client.from('products').insert({
        name: prodData.name,
        gender: prodData.gender,
        category: prodData.category,
        price: prodData.price,
        price_num: numericPrice,
        sale_price: prodData.salePrice || null,
        is_sale: prodData.isSale,
        image: prodData.image,
        description: prodData.description,
        stock: prodData.stock,
        sizes: prodData.sizes,
        colors: prodData.colors,
        rating: 5.0,
        reviews_count: 0,
      }).select().single();

      if (!dbErr && dbData) {
        supabaseSaved = true;
        newProduct.id = Number(dbData.id);
      } else if (dbErr) {
        console.error('Supabase Product Insert Error:', dbErr);
      }
    }

    return NextResponse.json({ success: true, product: newProduct, supabaseSaved });
  } catch (error: any) {
    console.error('Add Product API Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to add product' }, { status: 500 });
  }
}

// ─── EDIT PRODUCT ─────────────────────────────────────────────────────
export async function PUT(request: Request) {
  const client = getSupabaseServerClient();

  try {
    const body = await request.json();
    const { id, name, gender, category, price, salePrice, image, description, stock, sizes, colors } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required for editing.' }, { status: 400 });
    }

    const numericPrice = parsePrice(price);
    const formattedPriceStr = price ? (price.includes('PKR') ? price : formatPrice(numericPrice)) : undefined;
    const formattedSalePriceStr = salePrice ? (salePrice.includes('PKR') ? salePrice : formatPrice(parsePrice(salePrice))) : null;

    const updates: Partial<Product> = {};
    if (name) updates.name = name;
    if (gender) updates.gender = gender;
    if (category) updates.category = category;
    if (formattedPriceStr) updates.price = formattedPriceStr;
    if (formattedSalePriceStr !== undefined) {
      updates.salePrice = formattedSalePriceStr || undefined;
      updates.isSale = Boolean(formattedSalePriceStr);
    }
    if (image) updates.image = image;
    if (description !== undefined) updates.description = description;
    if (stock !== undefined) updates.stock = Number(stock);
    if (Array.isArray(sizes)) updates.sizes = sizes;
    if (Array.isArray(colors)) updates.colors = colors;

    // Update in local memory
    updateLocalProduct(Number(id), updates);

    // Update in Supabase DB if configured
    if (client) {
      const dbPayload: any = {};
      if (name) dbPayload.name = name;
      if (gender) dbPayload.gender = gender;
      if (category) dbPayload.category = category;
      if (formattedPriceStr) {
        dbPayload.price = formattedPriceStr;
        dbPayload.price_num = numericPrice;
      }
      dbPayload.sale_price = formattedSalePriceStr;
      dbPayload.is_sale = Boolean(formattedSalePriceStr);
      if (image) dbPayload.image = image;
      if (description !== undefined) dbPayload.description = description;
      if (stock !== undefined) dbPayload.stock = Number(stock);
      if (Array.isArray(sizes)) dbPayload.sizes = sizes;
      if (Array.isArray(colors)) dbPayload.colors = colors;

      const { error: dbErr } = await client
        .from('products')
        .update(dbPayload)
        .eq('id', id);

      if (dbErr) {
        console.error('Supabase Product Update Error:', dbErr);
      }
    }

    return NextResponse.json({ success: true, message: `Product #${id} updated successfully.` });
  } catch (error: any) {
    console.error('Edit Product API Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update product' }, { status: 500 });
  }
}

// ─── QUICK STOCK UPDATE ───────────────────────────────────────────────
export async function PATCH(request: Request) {
  const client = getSupabaseServerClient();

  try {
    const body = await request.json();
    const { id, stock } = body;

    if (id === undefined || stock === undefined || typeof stock !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid product ID or stock count' }, { status: 400 });
    }

    updateStock(Number(id), stock);

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

// ─── DELETE PRODUCT ───────────────────────────────────────────────────
export async function DELETE(request: Request) {
  const client = getSupabaseServerClient();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID parameter is required.' }, { status: 400 });
    }

    const prodId = Number(id);

    // Delete from local memory
    deleteLocalProduct(prodId);

    // Delete from Supabase DB if configured
    if (client) {
      const { error } = await client
        .from('products')
        .delete()
        .eq('id', prodId);

      if (error) {
        console.error('Supabase Product Delete Error:', error);
      }
    }

    return NextResponse.json({ success: true, message: `Product #${prodId} removed from store and database.` });
  } catch (error: any) {
    console.error('Delete Product API Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete product' }, { status: 500 });
  }
}
