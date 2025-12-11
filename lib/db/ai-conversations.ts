import { createClient } from '@/lib/supabase/server';
import { AIConversation, ChatMessage, Platform } from '@/lib/types/database.types';

export async function getConversation(
  conversationId: string,
  userId: string
): Promise<AIConversation | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('conversation_id', conversationId)  // Fixed: use conversation_id not id
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    throw error;
  }

  return data as AIConversation;
}

export async function getConversations(
  userId: string,
  limit: number = 50
): Promise<AIConversation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as AIConversation[];
}

export async function createConversation(
  userId: string,
  conversationId: string,  // Added: client-generated conversation_id
  platform?: Platform,
  initialMessage?: ChatMessage
): Promise<AIConversation> {
  const supabase = await createClient();

  const messages = initialMessage ? [initialMessage] : [];
  const title = initialMessage
    ? initialMessage.content.substring(0, 50) + (initialMessage.content.length > 50 ? '...' : '')
    : 'New Conversation';

  const { data, error } = await supabase
    .from('ai_conversations')
    .insert([
      {
        user_id: userId,
        conversation_id: conversationId,  // Added: save the conversation_id
        platform,
        title,
        messages,
        model: 'claude-sonnet-4-20250514',
        total_tokens_used: 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as AIConversation;
}

export async function updateConversation(
  conversationId: string,
  userId: string,
  messages: ChatMessage[],
  tokensUsed: number = 0
): Promise<AIConversation> {
  const supabase = await createClient();

  // Get current conversation to add to token count
  const current = await getConversation(conversationId, userId);
  if (!current) {
    throw new Error('Conversation not found');
  }

  const { data, error } = await supabase
    .from('ai_conversations')
    .update({
      messages,
      total_tokens_used: current.total_tokens_used + tokensUsed,
    })
    .eq('conversation_id', conversationId)  // Fixed: use conversation_id not id
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as AIConversation;
}

export async function deleteConversation(
  conversationId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('ai_conversations')
    .delete()
    .eq('conversation_id', conversationId)  // Fixed: use conversation_id not id
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getConversationStats(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_conversations')
    .select('total_tokens_used, messages, platform')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = {
    total_conversations: data.length,
    total_messages: data.reduce((sum, conv) => sum + (conv.messages as ChatMessage[]).length, 0),
    total_tokens_used: data.reduce((sum, conv) => sum + (conv.total_tokens_used || 0), 0),
    by_platform: data.reduce((acc, conv) => {
      const platform = conv.platform || 'general';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return stats;
}
