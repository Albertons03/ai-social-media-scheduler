import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPosts, createPost, getPostAnalytics } from '@/lib/db/posts';
import { canSchedulePost, trackPostScheduled } from '@/lib/db/usage-tracking';

// GET /api/posts - Get all posts for authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const analytics = searchParams.get('analytics');

    if (analytics === 'true') {
      const stats = await getPostAnalytics(user.id);
      return NextResponse.json(stats);
    }

    const posts = await getPosts(user.id);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.platform || !body.content) {
      return NextResponse.json(
        { error: 'Platform and content are required' },
        { status: 400 }
      );
    }

    // Check if post is scheduled (not a draft)
    const isScheduled = body.status === 'scheduled' || body.scheduled_for;

    // Check FREE tier limits for scheduled posts
    if (isScheduled) {
      try {
        const limitCheck = await canSchedulePost(user.id);

        if (!limitCheck.allowed) {
          return NextResponse.json(
            {
              error: limitCheck.reason,
              upgrade_required: true,
              posts_this_month: limitCheck.postsThisMonth,
              limit: limitCheck.limit,
            },
            { status: 403 }
          );
        }
      } catch (error) {
        console.error('Error checking usage limits:', error);
        // Continue with post creation even if limit check fails
        // to avoid blocking users due to database issues
      }
    }

    // Create the post
    const post = await createPost(user.id, body);

    // Track the scheduled post for usage statistics
    if (isScheduled && post) {
      try {
        await trackPostScheduled(user.id, body.platform);
      } catch (error) {
        console.error('Error tracking post:', error);
        // Don't fail the request if tracking fails
      }
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
