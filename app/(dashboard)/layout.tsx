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
    <div className="flex min-h-screen bg-[#0b0c10] font-sans text-zinc-100 selection:bg-[#6154f0] selection:text-white">
      <Sidebar />
      <ClientLayoutWrapper>
        <TopHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </ClientLayoutWrapper>
    </div>
  );
}
