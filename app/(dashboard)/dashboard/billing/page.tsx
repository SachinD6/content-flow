import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { BillingContent } from '@/features/billing/BillingContent';
import type { Profile } from '@/types';
import type { Database } from '@/types/supabase';

interface BillingPageProps {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profileData) {
    redirect('/login');
  }

  const profile = profileData as ProfileRow;
  const params = await searchParams;
  const success = params.success === 'true';
  const cancelled = params.cancelled === 'true';

  const typedProfile: Profile = {
    id: profile.id,
    email: profile.email,
    displayName: profile.display_name,
    bio: profile.bio,
    website: profile.website,
    avatarUrl: profile.avatar_url,
    subscriptionTier: profile.subscription_tier,
    role: profile.role,
    stripeCustomerId: profile.stripe_customer_id ?? undefined,
    stripeSubscriptionId: profile.stripe_subscription_id ?? undefined,
    createdAt: profile.created_at,
  };

  return (
    <>
      <PageHeader
        title="Billing"
        description="Manage your subscription and billing settings"
      />
      <BillingContent
        currentPlan={typedProfile.subscriptionTier}
        userId={user.id}
        success={success}
        cancelled={cancelled}
      />
    </>
  );
}
