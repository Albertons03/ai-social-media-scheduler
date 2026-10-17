export interface StubState {
  userId: string | null;
  usage: { posts_this_month: number; tier: string };
  createdPosts: Record<string, unknown>[];
  trackedPosts: { userId: string; platform: string }[];
}

const key = "__postsRouteStubState";
const holder = globalThis as unknown as Record<string, StubState | undefined>;

export function getState(): StubState {
  let state = holder[key];
  if (!state) {
    state = {
      userId: null,
      usage: { posts_this_month: 0, tier: "free" },
      createdPosts: [],
      trackedPosts: [],
    };
    holder[key] = state;
  }
  return state;
}

export function resetState(): StubState {
  holder[key] = undefined;
  return getState();
}
