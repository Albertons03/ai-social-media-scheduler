import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

async function resetPost() {
  console.log("🔄 Resetting failed post to scheduled without media...\n");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing environment variables!");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get the failed post
  const { data: posts, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "failed")
    .order("created_at", { ascending: false })
    .limit(1);

  if (fetchError || !posts || posts.length === 0) {
    console.error("❌ No failed posts found");
    process.exit(1);
  }

  const post = posts[0];
  console.log(`📝 Post: ${post.content?.substring(0, 50)}...`);
  console.log(`❌ Current status: ${post.status}`);
  console.log(`🖼️  Media URL: ${post.media_url || "None"}`);

  // Update post: remove media, reset status to scheduled, set new schedule time
  const newScheduleTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

  const { error: updateError } = await supabase
    .from("posts")
    .update({
      status: "scheduled",
      media_url: null,
      media_type: null,
      thumbnail_url: null,
      error_message: null,
      retry_count: 0,
      scheduled_for: newScheduleTime.toISOString(),
    })
    .eq("id", post.id);

  if (updateError) {
    console.error("❌ Error updating post:", updateError);
    process.exit(1);
  }

  console.log(`\n✅ Post reset successfully!`);
  console.log(`🗓️  New schedule time: ${newScheduleTime.toISOString()}`);
  console.log(`📝 Status: scheduled (without media)`);
  console.log(`\n⏰ The post will be published in ~2 minutes by the Edge Function`);

  process.exit(0);
}

resetPost();
