import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/src/lib/supabase';

export async function POST(request: Request) {
  const client = getSupabaseServerClient();

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address' }, { status: 400 });
    }

    if (client) {
      const { error } = await client.from('newsletter_subscribers').insert({
        email,
        subscribed_at: new Date().toISOString(),
      });

      if (error && error.code !== '23505') { // Ignore unique constraint violation
        console.error('Supabase Newsletter Error:', error);
      }
    }

    return NextResponse.json({ success: true, message: 'Successfully subscribed to Noveira Private List.' });
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json({ success: true, message: 'Subscribed successfully.' });
  }
}
