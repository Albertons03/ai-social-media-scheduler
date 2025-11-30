import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Betölti a .env.local fájlt
config({ path: resolve(process.cwd(), ".env.local") });

async function checkPosts() {
  console.log("🔍 Checking posts in database...\n");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing environment variables!");
    console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
    console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✓" : "✗");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: allPosts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching posts:", error);
    process.exit(1);
  }

  if (!allPosts || allPosts.length === 0) {
    console.log("❌ No posts found in database!");
    process.exit(0);
  }

  console.log(`📊 Found ${allPosts.length} post(s):\n`);

  allPosts.forEach((post: any, index: number) => {
    console.log(`${index + 1}. Post ID: ${post.id}`);
    console.log(`   Content: ${post.content?.substring(0, 50)}...`);
    console.log(`   Scheduled for: ${post.scheduled_for}`);
    console.log(`   Status: ${post.status}`);
    console.log(`   Created at: ${post.created_at}`);
    console.log("");
  });

  const now = new Date();
  console.log(`⏰ Current time (UTC): ${now.toISOString()}`);
  console.log(`⏰ Current time (Local): ${now.toString()}\n`);

  const shouldPublish = allPosts.filter((post: any) => {
    const scheduledTime = new Date(post.scheduled_for);
    return post.status === "scheduled" && scheduledTime <= now;
  });

  if (shouldPublish.length > 0) {
    console.log(`🚀 Posts ready to publish: ${shouldPublish.length}`);
    shouldPublish.forEach((post: any) => {
      console.log(`   - ${post.id}: ${post.content?.substring(0, 30)}...`);
    });
  } else {
    console.log("⏳ No posts ready to publish yet");
  }

  process.exit(0);
}

checkPosts();
