import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Hardcoded admin emails (can also check profiles.tier = 'admin')
const ADMIN_EMAILS = [
  "matrixiscoming03@gmail.com", // Replace with actual admin email
  "admin@example.com",
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile to check tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, email")
    .eq("id", user.id)
    .single();

  // Check if user is admin (either by tier or hardcoded email)
  const isAdmin =
    profile?.tier === "admin" || ADMIN_EMAILS.includes(user.email || "");

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Admin Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            Admin Dashboard
          </h1>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ← Back to App
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
