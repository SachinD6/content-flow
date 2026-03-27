import { PageHeader } from '@/components/shared/PageHeader';
import { NewPostForm } from '@/features/posts/NewPostForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <PageHeader
        title="Create New Post"
        description="Create a new blog post for your content"
      />
      <div className="mt-8">
        <NewPostForm />
      </div>
    </>
  );
}
