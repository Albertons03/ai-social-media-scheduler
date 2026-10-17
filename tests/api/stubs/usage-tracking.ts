import { getState } from "./state.ts";

// Mirrors the real counter behavior: usage is recorded but never enforced.
export async function trackPostScheduled(userId: string, platform: string) {
  const state = getState();
  state.trackedPosts.push({ userId, platform });
  state.usage.posts_this_month += 1;
  return { success: true };
}
