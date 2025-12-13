@ProjectManager - Készíts egy egyszerű admin dashboard-ot basic metrics-ekkel.

## Feladat: Admin Dashboard Setup

### 1. Admin Auth Check Middleware

Hozd létre: `app/admin/layout.tsx`

```tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Hardcode admin email (később Supabase role-ba teheted)
const ADMIN_EMAILS = ["your-email@gmail.com"]; // ← IDE ÍRD A SAJÁT EMAILED!

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Ha nincs bejelentkezve vagy nem admin → redirect
  if (!session || !ADMIN_EMAILS.includes(session.user.email || "")) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">🔐 Admin Dashboard</h1>
          <a href="/app" className="text-slate-400 hover:text-white text-sm">
            ← Back to App
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
```

### 2. Admin Dashboard Page

Hozd létre: `app/admin/page.tsx`

```tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch metrics
  const [
    { count: totalUsers },
    { count: freeUsers },
    { count: waitlistCount },
    { data: recentUsers },
    { data: topUsers },
  ] = await Promise.all([
    supabase.from("auth.users").select("*", { count: "exact", head: true }),
    supabase
      .from("auth.users")
      .select("*", { count: "exact", head: true })
      .eq("tier", "free"),
    supabase.from("waitlist").select("*", { count: "exact", head: true }),
    supabase
      .from("auth.users")
      .select("id, email, created_at, tier")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("auth.users")
      .select("id, email, posts_this_month, tier")
      .order("posts_this_month", { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers || 0}
          color="text-primary-light"
          icon="👥"
        />
        <StatCard
          title="Free Tier Users"
          value={freeUsers || 0}
          color="text-metric-green"
          icon="🆓"
        />
        <StatCard
          title="Waitlist Signups"
          value={waitlistCount || 0}
          color="text-metric-yellow"
          icon="📧"
        />
      </div>

      {/* Recent Users */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          🆕 Recent Signups
        </h2>
        <div className="space-y-2">
          {recentUsers?.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between text-sm py-2 border-b border-white/5"
            >
              <span className="text-slate-300">{user.email}</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.tier === "free"
                      ? "bg-metric-green/20 text-metric-green"
                      : "bg-secondary/20 text-secondary"
                  }`}
                >
                  {user.tier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Users by Activity */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          🔥 Most Active Users
        </h2>
        <div className="space-y-2">
          {topUsers?.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between text-sm py-2 border-b border-white/5"
            >
              <span className="text-slate-300">{user.email}</span>
              <div className="flex items-center gap-3">
                <span className="text-primary-light font-bold">
                  {user.posts_this_month} posts
                </span>
                {user.posts_this_month >= 10 && (
                  <span className="text-yellow-400 text-xs">⚠️ At limit</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-slate-400 text-sm">{title}</span>
      </div>
      <div className={`text-4xl font-bold ${color}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}
```

### 3. Admin Link a Dashboard Navbar-ban

Módosítsd a dashboard layout navbar-ját (ha van):

```tsx
// app/app/layout.tsx vagy ahol a navbar van

{
  session?.user?.email === "your-email@gmail.com" && (
    <a
      href="/admin"
      className="text-slate-400 hover:text-white text-sm flex items-center gap-2"
    >
      🔐 Admin
    </a>
  );
}
```

## Success Criteria:

- ✅ /admin route csak neked elérhető (email check)
- ✅ Látod: Total users, Free users, Waitlist count
- ✅ Recent signups lista (utolsó 10)
- ✅ Most active users (ki hány posztot csinált)
- ✅ Real-time data (minden refresh friss)

Access: https://landingbits.net/admin

```

**Időbecslés:** 45-60 perc implementáció
```
