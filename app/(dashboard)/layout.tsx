import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/features/auth/Sidebar';
import { TopHeader } from '@/features/auth/TopHeader';
import { cn } from '@/lib/utils';
import { ClientLayoutWrapper } from './ClientLayoutWrapper';

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] font-sans text-zinc-100 selection:bg-[#6154f0] selection:text-white">
      <Sidebar />
      <ClientLayoutWrapper>
        <TopHeader />
        <main className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden",
          "p-4 sm:p-6 lg:p-8",
          "pt-20 lg:pt-8"
        )}>
          <div className="mx-auto max-w-7xl w-full min-w-0">
            {children}
          </div>
        </main>
      </ClientLayoutWrapper>
    </div>
  );
}
