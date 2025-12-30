import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Calendar className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">LandingBits</span>
        </Link>

        {/* Center - Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/schedule"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Schedule
          </Link>
          <Link
            href="/analytics"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Analytics
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
        </nav>

        {/* Right - User Actions */}
        <div className="flex items-center gap-4">
          {/* Settings Button */}
          <Link
            href="/settings"
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Link>

          {/* User Info */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium">
              {profile?.full_name?.split(" ")[0] || "User"}
            </span>
          </div>

          {/* Sign Out */}
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
