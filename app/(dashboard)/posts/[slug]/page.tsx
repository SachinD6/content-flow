import { PageHeader } from '@/components/shared/PageHeader';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;

  return (
    <div>
      <PageHeader
        title="Post Detail"
        description={`Viewing post: ${slug}`}
      />
      <div className="text-muted-foreground">
        Post detail content coming soon.
      </div>
    </div>
  );
}
