import { PageHeader } from '@/components/shared/PageHeader';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { AdminUsersTable } from '@/features/admin/AdminUsersTable';
import type { Profile } from '@/types';

interface UserQueryResult {
  id: string;
  email: string;
  display_name: string;
  bio: string;
  website: string;
  avatar_url: string;
  subscription_tier: 'free' | 'pro';
  role: 'user' | 'admin';
  created_at: string;
}

export default async function AdminPage() {
  // Security: use service role client — NEVER anon client here
  const supabase = createServiceRoleClient();

  const { data: usersData } = await supabase
    .from('profiles')
    .select('id, email, display_name, bio, website, avatar_url, subscription_tier, role, created_at')
    .order('created_at', { ascending: false });

  const users: Profile[] = (usersData as UserQueryResult[] || []).map((user) => ({
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    bio: user.bio,
    website: user.website,
    avatarUrl: user.avatar_url,
    subscriptionTier: user.subscription_tier,
    role: user.role,
    createdAt: user.created_at,
  }));

  return (
    <>
      <PageHeader
        title="Admin Panel"
        description="Manage users and system settings"
      />
      <div className="mt-8">
        <AdminUsersTable users={users} />
      </div>
    </>
  );
}
