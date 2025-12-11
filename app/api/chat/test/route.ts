import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Test endpoint to check if ai_conversations table exists
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        error: 'Not authenticated',
        hint: 'Please log in first'
      }, { status: 401 });
    }

    // Check if ANTHROPIC_API_KEY is set
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;

    // Try to query ai_conversations table
    const { data, error, count } = await supabase
      .from('ai_conversations')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({
        status: 'error',
        checks: {
          authenticated: true,
          anthropicKeySet: hasAnthropicKey,
          tableExists: false,
        },
        error: error.message,
        hint: 'The ai_conversations table does not exist. Please run the Supabase migration SQL.',
        migrationFile: 'supabase-migration-ai-conversations.sql'
      });
    }

    return NextResponse.json({
      status: 'success',
      checks: {
        authenticated: true,
        anthropicKeySet: hasAnthropicKey,
        tableExists: true,
        rowCount: count || 0,
      },
      message: 'All checks passed! AI Chat should work.',
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
