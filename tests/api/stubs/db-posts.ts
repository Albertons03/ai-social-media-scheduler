import { getState } from "./state.ts";

export async function getPosts(): Promise<unknown[]> {
  return getState().createdPosts;
}

export async function getPostAnalytics(): Promise<Record<string, unknown>> {
  return {};
}

export async function createPost(
  userId: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const post = { id: `post-${getState().createdPosts.length + 1}`, user_id: userId, ...body };
  getState().createdPosts.push(post);
  return post;
}
