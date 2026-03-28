import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AnalyticsContent } from '@/features/analytics/AnalyticsContent';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <PageHeader
        title="Analytics Dashboard"
        description="Track your content performance and audience insights"
      />
      <div className="mt-8">
        <AnalyticsContent />
      </div>
    </>
  );
}
