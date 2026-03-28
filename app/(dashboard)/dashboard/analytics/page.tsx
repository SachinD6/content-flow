import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { AnalyticsContent } from '@/features/analytics/AnalyticsContent';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <PageHeader
        title="PostHog Events"
        description="Real-Time Telemetry / Production Pipeline"
      />
      <div className="mt-8">
        <AnalyticsContent />
      </div>
    </div>
  );
}
