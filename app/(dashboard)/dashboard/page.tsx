import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your content and activity"
      />
      <div className="flex gap-4 items-center">
        <LoadingSpinner size="sm" />
        <span className="text-muted-foreground">Syncing data...</span>
      </div>
      <div className="border rounded-lg p-8">
        <EmptyState
          icon={LayoutDashboard}
          title="No data yet"
          description="Create your first post to see analytics here."
        />
      </div>
    </div>
  );
}
