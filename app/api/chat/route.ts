import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getConversation,
  createConversation,
  updateConversation,
} from '@/lib/db/ai-conversations';
import { ChatMessage, Platform } from '@/lib/types/database.types';
import Anthropic from '@anthropic-ai/sdk';

// Platform-specific system prompts
const PLATFORM_PROMPTS = {
  twitter: `Te egy segítőkész AI asszisztens vagy, aki Twitter/X tartalomkészítésben segít.
Légy tömör és hatásos. Amikor tartalmat javasolsz, ne feledd:
- Maximum 280 karakter tweetekhez
- Használj engaging hookokat és erős CTA-kat
- Javasolj releváns hashtageket (max 2-3)
- Gondolj a trending témákra, ha releváns
- Légy beszélgetős és autentikus`,

  linkedin: `Te egy segítőkész AI asszisztens vagy, aki LinkedIn tartalomkészítésben segít.
Tartsd fenn a professzionális és értékalapú hangnemet. Amikor tartalmat javasolsz, ne feledd:
- Professzionális, de megközelíthető hangnem
- Fókusz az insights-okra, tanulásra és értékre
- Használj strukturált formázást (felsorolás, bekezdések)
- Használj releváns iparági hashtageket
- Ösztönözd az értékes engagement-et`,

  tiktok: `Te egy segítőkész AI asszisztens vagy, aki TikTok tartalomkészítésben segít.
Légy kreatív, trend-tudatos és engaging. Amikor tartalmat javasolsz, ne feledd:
- Szórakoztató, energikus és autentikus hangnem
- Fókusz a trending témákra és kihívásokra
- Javasolj releváns trending hashtageket
- A caption legyen engaging, de tömör
- Gondolj a vizuális storytelling-re`,

  general: `Te egy segítőkész AI asszisztens vagy social media tartalomkészítéshez.
Segítsd a felhasználókat ötletelésben, tartalmuk finomításában és engaging posztok készítésében több platformon.
Légy kreatív, támogató és adj gyakorlati javaslatokat.`,
};

// POST /api/chat - Send a message and get AI response
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
    const { message, conversationId, platform } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate platform if provided
    const validPlatforms: Platform[] = ['twitter', 'linkedin', 'tiktok'];
    if (platform && !validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be twitter, linkedin, or tiktok' },
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

    // Create user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    let conversation;
    let conversationMessages: ChatMessage[] = [];

    // Get or create conversation
    if (conversationId) {
      conversation = await getConversation(conversationId, user.id);
      if (!conversation) {
        // Conversation not found, create it with the provided conversationId
        conversation = await createConversation(user.id, conversationId, platform, userMessage);
        conversationMessages = [userMessage];
      } else {
        conversationMessages = [...conversation.messages, userMessage];
      }
    } else {
      // Generate a new conversationId if not provided
      const newConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      conversation = await createConversation(user.id, newConversationId, platform, userMessage);
      conversationMessages = [userMessage];
    }

    // Keep only last 10 messages for context (5 exchanges)
    const recentMessages = conversationMessages.slice(-10);

    // Build system prompt based on platform
    const systemPrompt =
      PLATFORM_PROMPTS[platform as keyof typeof PLATFORM_PROMPTS] ||
      PLATFORM_PROMPTS.general;

    // Prepare messages for Claude API
    const claudeMessages = recentMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: claudeMessages,
    });

    // Extract assistant reply
    const assistantContent = response.content[0];
    if (assistantContent.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: assistantContent.text,
      timestamp: new Date().toISOString(),
    };

    // Add assistant message to conversation
    const updatedMessages = [...conversationMessages, assistantMessage];
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    // Update conversation in database
    const updatedConversation = await updateConversation(
      conversation.conversation_id,  // Fixed: use conversation_id not id (UUID)
      user.id,
      updatedMessages,
      tokensUsed
    );

    return NextResponse.json({
      conversationId: updatedConversation.conversation_id,  // Fixed: return conversation_id not id
      message: assistantMessage.content,
      timestamp: assistantMessage.timestamp,
      tokensUsed,
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);

    // Provide more detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat message';
    console.error('Detailed error:', errorMessage);

    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// GET /api/chat?conversationId=xxx - Load an existing conversation
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
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    const conversation = await getConversation(conversationId, user.id);

    if (!conversation) {
      // Return empty conversation instead of 404 (conversation doesn't exist yet)
      return NextResponse.json({
        id: null,
        conversation_id: conversationId,
        messages: [],
        platform: null,
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error loading conversation:', error);
    return NextResponse.json(
      { error: 'Failed to load conversation' },
      { status: 500 }
    );
  }
}
