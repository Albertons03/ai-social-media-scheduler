import { getState, resetState } from "./stubs/state.ts";

declare const Deno: {
  test(name: string, fn: () => Promise<void>): void;
};

interface PostsRoute {
  POST(request: Request): Promise<Response>;
}

// Loaded dynamically so the Deno import map can replace Supabase and DB modules.
async function loadRoute(): Promise<PostsRoute> {
  const url = new URL("../../app/api/posts/route.ts", import.meta.url).href;
  return (await import(url)) as PostsRoute;
}

function postRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/posts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

Deno.test("rejects unauthenticated post creation with 401", async () => {
  const state = resetState();
  const { POST } = await loadRoute();

  const response = await POST(
    postRequest({ platform: "linkedin", content: "Hello", status: "scheduled" })
  );

  assert(response.status === 401, `expected 401, got ${response.status}`);
  assert(getState().createdPosts.length === 0, "no post may be created");
  assert(state.trackedPosts.length === 0, "no usage may be tracked");
});

Deno.test("allows an authenticated free-tier user to schedule beyond 10 posts per month", async () => {
  const state = resetState();
  state.userId = "user-1";
  state.usage = { posts_this_month: 26, tier: "free" };
  const { POST } = await loadRoute();

  const response = await POST(
    postRequest({
      platform: "linkedin",
      content: "Scheduled post #27",
      status: "scheduled",
      scheduled_for: "2030-01-01T10:00:00.000Z",
    })
  );

  assert(response.status === 201, `expected 201, got ${response.status}`);
  assert(state.createdPosts.length === 1, "post must be created");
  assert(state.trackedPosts.length === 1, "usage counter is still recorded");
  assert(state.usage.posts_this_month === 27, "existing counter is preserved and incremented");
});

Deno.test("still validates required fields for authenticated users", async () => {
  const state = resetState();
  state.userId = "user-1";
  const { POST } = await loadRoute();

  const response = await POST(postRequest({ platform: "linkedin" }));

  assert(response.status === 400, `expected 400, got ${response.status}`);
  assert(state.createdPosts.length === 0, "no post may be created");
});

Deno.test("does not expose the removed quota error to authenticated users", async () => {
  const state = resetState();
  state.userId = "user-1";
  state.usage = { posts_this_month: 500, tier: "free" };
  const { POST } = await loadRoute();

  const response = await POST(
    postRequest({ platform: "twitter", content: "Draft", status: "draft" })
  );
  const text = await response.text();

  assert(response.status === 201, `expected 201, got ${response.status}`);
  assert(!text.includes("upgrade_required"), "no upgrade messaging in response");
});
