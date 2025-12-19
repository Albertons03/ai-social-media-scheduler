import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Platform } from '@/lib/types/database.types';
import Anthropic from '@anthropic-ai/sdk';

interface Suggestion {
  title: string;
  description: string;
}

// Platform-specific suggestion prompts
const SUGGESTION_PROMPTS = {
  twitter: `Generate 3 engaging Twitter/X content topics for a social media content creator.
Each suggestion should be:
- Suitable for a 280-character tweet
- Timely and relevant to current trends
- Specific and actionable

Return ONLY a JSON array with this exact format:
[
  {"title": "Short, attention-grabbing title", "description": "Brief description of what to post"},
  {"title": "Short, attention-grabbing title", "description": "Brief description of what to post"},
  {"title": "Short, attention-grabbing title", "description": "Brief description of what to post"}
]`,

  linkedin: `Generate 3 professional LinkedIn content topics for a social media content creator.
Each suggestion should be:
- Professional and value-driven
- Suitable for thought leadership
- Encouraging valuable engagement

Return ONLY a JSON array with this exact format:
[
  {"title": "Professional topic title", "description": "Brief description of what to share"},
  {"title": "Professional topic title", "description": "Brief description of what to share"},
  {"title": "Professional topic title", "description": "Brief description of what to share"}
]`,

  tiktok: `Generate 3 creative TikTok content topics for a social media content creator.
Each suggestion should be:
- Entertaining, engaging, and trend-aware
- Suitable for video content
- Aligned with current TikTok trends

Return ONLY a JSON array with this exact format:
[
  {"title": "Creative video idea title", "description": "Brief description of the video concept"},
  {"title": "Creative video idea title", "description": "Brief description of the video concept"},
  {"title": "Creative video idea title", "description": "Brief description of the video concept"}
]`,
};

// POST /api/chat/suggestions - Generate topic suggestions
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
    const { platform } = body;

    // Validate platform
    const validPlatforms: Platform[] = ['twitter', 'linkedin', 'tiktok'];
    if (!platform || !validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Valid platform is required (twitter, linkedin, or tiktok)' },
        { status: 400 }
      );
    }

    // Initialize Anthropic client
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Get platform-specific prompt
    const prompt = SUGGESTION_PROMPTS[platform as keyof typeof SUGGESTION_PROMPTS];

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    // Parse JSON response
    let suggestions: Suggestion[];
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        suggestions = JSON.parse(content.text);
      }

      // Validate response format
      if (
        !Array.isArray(suggestions) ||
        suggestions.length !== 3 ||
        !suggestions.every(
          (s) =>
            typeof s === 'object' &&
            typeof s.title === 'string' &&
            typeof s.description === 'string'
        )
      ) {
        throw new Error('Invalid suggestion format');
      }
    } catch (parseError) {
      console.error('Failed to parse suggestions:', content.text);
      // Fallback to generic suggestions
      const platformNames: Record<Platform, string> = {
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        tiktok: 'TikTok'
      };

      suggestions = [
        {
          title: 'Share Your Expertise',
          description: `Share a tip or insight from your field on ${platformNames[platform as Platform]}`,
        },
        {
          title: 'Behind the Scenes',
          description: 'Give your audience a glimpse into your creative process',
        },
        {
          title: 'Engage Your Audience',
          description: 'Ask a thought-provoking question to spark conversation',
        },
      ];
    }

    return NextResponse.json({
      suggestions,
      platform,
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
