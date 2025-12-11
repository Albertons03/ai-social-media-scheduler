import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { TopBar } from '@/components/layout/topbar/topbar';
import { SidebarProvider } from '@/lib/contexts/sidebar-context';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const userData = {
    ...user,
    profile: profile || undefined,
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={userData} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar user={userData} />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-muted/20 to-primary/5 dark:from-background dark:via-background dark:to-background p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
