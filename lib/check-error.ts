import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

async function checkError() {
  console.log("🔍 Checking post error details...\n");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing environment variables!");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, content, status, error_message, retry_count, last_retry_at, scheduled_for, created_at")
    .eq("status", "failed")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("❌ Error fetching posts:", error);
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log("✅ No failed posts found!");
    process.exit(0);
  }

  console.log(`❌ Found ${posts.length} failed post(s):\n`);

  posts.forEach((post: any, index: number) => {
    console.log(`${index + 1}. Post ID: ${post.id}`);
    console.log(`   Content: ${post.content?.substring(0, 50)}...`);
    console.log(`   Scheduled for: ${post.scheduled_for}`);
    console.log(`   Status: ${post.status}`);
    console.log(`   Error: ${post.error_message || "No error message"}`);
    console.log(`   Retry count: ${post.retry_count || 0}`);
    console.log(`   Last retry: ${post.last_retry_at || "Never"}`);
    console.log("");
  });

  process.exit(0);
}

checkError();
