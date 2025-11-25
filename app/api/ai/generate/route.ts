import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAIGeneration } from '@/lib/db/ai-generations';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai/generate - Generate content with AI
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
    const { prompt, platform, tone, length } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Build the system message based on parameters
    let systemMessage = 'You are a social media content expert. Generate engaging content for social media posts.';

    if (platform) {
      systemMessage += ` The content is for ${platform}.`;
    }

    if (tone) {
      systemMessage += ` Use a ${tone} tone.`;
    }

    // Build length instructions
    let lengthInstruction = '';
    if (length === 'short') {
      lengthInstruction = ' Keep it concise (1-2 sentences or 50-100 characters).';
    } else if (length === 'medium') {
      lengthInstruction = ' Keep it moderate length (2-3 sentences or 100-200 characters).';
    } else if (length === 'long') {
      lengthInstruction = ' Make it detailed (3-5 sentences or 200-300 characters).';
    }

    systemMessage += lengthInstruction;

    // Add platform-specific guidelines
    if (platform === 'tiktok') {
      systemMessage += ' Include relevant hashtags and make it fun and engaging for TikTok audience.';
    } else if (platform === 'linkedin') {
      systemMessage += ' Keep it professional and value-focused for LinkedIn audience.';
    } else if (platform === 'twitter') {
      systemMessage += ' Keep it under 280 characters and make it impactful for Twitter audience.';
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const generatedContent = completion.choices[0].message.content || '';
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Save to database
    await createAIGeneration(
      user.id,
      prompt,
      generatedContent,
      'gpt-4',
      tokensUsed
    );

    return NextResponse.json({
      content: generatedContent,
      tokens_used: tokensUsed,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
