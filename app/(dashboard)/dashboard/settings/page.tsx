import { PageHeader } from '@/components/shared/PageHeader';
import { SettingsForm } from '@/features/settings/SettingsForm';
import { DangerZone } from '@/features/settings/DangerZone';
import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Layout redirects locally
  }

  return (
    <>
      <PageHeader
        title="Account Settings"
        description="Manage your architectural preferences and profile identity securely here."
      />

      <div className="mt-8 max-w-4xl pb-16">
        <SettingsForm userId={user.id} />
        
        <DangerZone userId={user.id} userEmail={user.email || ''} />
      </div>
    </>
  );
}
