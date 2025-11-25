import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  // Sign out
  await supabase.auth.signOut();

  // Revalidate the path
  revalidatePath('/', 'layout');

  return NextResponse.redirect(new URL('/', request.url));
}
