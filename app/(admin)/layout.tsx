import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check user authenticated — if not redirect to /login
  if (!user) {
    redirect('/login');
  }

  // Security: role verified both in middleware AND here — never trust middleware alone
  const serviceSupabase = createServiceRoleClient();
  const { data: profile } = await serviceSupabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] font-sans text-zinc-100">
      <main className="p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
