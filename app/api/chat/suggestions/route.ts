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
  twitter: `Generálj 3 engaging Twitter/X tartalom témát egy social media tartalomkészítő számára.
Minden javaslat legyen:
- 280 karakteres tweet-hez alkalmas
- Időszerű és releváns a jelenlegi trendekhez
- Konkrét és megvalósítható

Adj vissza CSAK egy JSON tömböt ezzel a pontos formátummal:
[
  {"title": "Rövid, figyelemfelkeltő cím", "description": "Rövid leírás arról, mit posztoljon"},
  {"title": "Rövid, figyelemfelkeltő cím", "description": "Rövid leírás arról, mit posztoljon"},
  {"title": "Rövid, figyelemfelkeltő cím", "description": "Rövid leírás arról, mit posztoljon"}
]`,

  linkedin: `Generálj 3 professzionális LinkedIn tartalom témát egy social media tartalomkészítő számára.
Minden javaslat legyen:
- Professzionális és értékalapú
- Szakmai gondolatvezetéshez alkalmas
- Értékes engagement-et ösztönző

Adj vissza CSAK egy JSON tömböt ezzel a pontos formátummal:
[
  {"title": "Professzionális téma cím", "description": "Rövid leírás arról, mit osszon meg"},
  {"title": "Professzionális téma cím", "description": "Rövid leírás arról, mit osszon meg"},
  {"title": "Professzionális téma cím", "description": "Rövid leírás arról, mit osszon meg"}
]`,

  tiktok: `Generálj 3 kreatív TikTok tartalom témát egy social media tartalomkészítő számára.
Minden javaslat legyen:
- Szórakoztató, engaging és trend-tudatos
- Videó tartalomhoz alkalmas
- Jelenlegi TikTok trendekhez igazodó

Adj vissza CSAK egy JSON tömböt ezzel a pontos formátummal:
[
  {"title": "Kreatív videó ötlet cím", "description": "Rövid leírás a videó koncepcióról"},
  {"title": "Kreatív videó ötlet cím", "description": "Rövid leírás a videó koncepcióról"},
  {"title": "Kreatív videó ötlet cím", "description": "Rövid leírás a videó koncepcióról"}
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
          title: 'Oszd meg a szakértődet',
          description: `Oszd meg egy tippet vagy betekintést a szakmádból ${platformNames[platform as Platform]} platformon`,
        },
        {
          title: 'Kulisszák mögött',
          description: 'Add a közönségednek egy pillantást a kreatív folyamatodba',
        },
        {
          title: 'Közönség bevonása',
          description: 'Tegyél fel egy gondolatébresztő kérdést a beszélgetés élénkítésére',
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
