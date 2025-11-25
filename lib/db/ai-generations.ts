import { createClient } from '@/lib/supabase/server';
import { AIGeneration } from '@/lib/types/database.types';

export async function getAIGenerations(userId: string, limit: number = 50) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as AIGeneration[];
}

export async function getAIGenerationById(generationId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_generations')
    .select('*')
    .eq('id', generationId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as AIGeneration;
}

export async function createAIGeneration(
  userId: string,
  prompt: string,
  generatedContent: string,
  model: string = 'gpt-4',
  tokensUsed?: number
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_generations')
    .insert([
      {
        user_id: userId,
        prompt,
        generated_content: generatedContent,
        model,
        tokens_used: tokensUsed,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as AIGeneration;
}

export async function getAIGenerationStats(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_generations')
    .select('tokens_used, model')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = {
    total_generations: data.length,
    total_tokens_used: data.reduce((sum, gen) => sum + (gen.tokens_used || 0), 0),
    by_model: data.reduce((acc, gen) => {
      acc[gen.model] = (acc[gen.model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return stats;
}
