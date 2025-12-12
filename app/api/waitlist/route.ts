import { createClient as createServerClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();

    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Use service role to bypass RLS for public waitlist inserts
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert to waitlist
    const { data, error } = await supabase
      .from('waitlist')
      .insert({ email, source: source || 'landing_hero' })
      .select()
      .single();

    if (error) {
      // Duplicate email case - return success to avoid info leakage
      if (error.code === '23505') {
        return NextResponse.json({
          success: true,
          message: 'Already subscribed!',
        });
      }

      console.error('Waitlist insert error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    // TODO: Send welcome email (Resend/SendGrid integration)
    // await sendWelcomeEmail(email);

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint: For admin dashboard (count waitlist users)
export async function GET(req: Request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Waitlist count error:', error);
      return NextResponse.json({ error: 'Failed to get count' }, { status: 500 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Waitlist GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
