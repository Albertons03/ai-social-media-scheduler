import { createClient } from '@/lib/supabase/server';
import { SocialAccount, Platform } from '@/lib/types/database.types';

export async function getSocialAccounts(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SocialAccount[];
}

export async function getSocialAccountById(accountId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('id', accountId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as SocialAccount;
}

export async function getSocialAccountByPlatform(userId: string, platform: Platform) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as SocialAccount | null;
}

export async function createSocialAccount(userId: string, accountData: Omit<SocialAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_accounts')
    .insert([
      {
        user_id: userId,
        ...accountData,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as SocialAccount;
}

export async function updateSocialAccount(
  accountId: string,
  userId: string,
  updates: Partial<SocialAccount>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_accounts')
    .update(updates)
    .eq('id', accountId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as SocialAccount;
}

export async function deleteSocialAccount(accountId: string, userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('social_accounts')
    .delete()
    .eq('id', accountId)
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

export async function refreshAccessToken(
  accountId: string,
  userId: string,
  newAccessToken: string,
  newRefreshToken?: string,
  expiresAt?: string
) {
  const supabase = await createClient();

  const updates: Partial<SocialAccount> = {
    access_token: newAccessToken,
  };

  if (newRefreshToken) {
    updates.refresh_token = newRefreshToken;
  }

  if (expiresAt) {
    updates.token_expires_at = expiresAt;
  }

  const { data, error } = await supabase
    .from('social_accounts')
    .update(updates)
    .eq('id', accountId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as SocialAccount;
}

export async function deactivateSocialAccount(accountId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_accounts')
    .update({ is_active: false })
    .eq('id', accountId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as SocialAccount;
}

export async function activateSocialAccount(accountId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_accounts')
    .update({ is_active: true })
    .eq('id', accountId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as SocialAccount;
}

export async function getConnectedPlatforms(userId: string): Promise<Platform[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_accounts')
    .select('platform')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) throw error;

  return [...new Set(data.map(account => account.platform))];
}
