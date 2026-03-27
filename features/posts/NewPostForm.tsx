'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';

export function NewPostForm() {
  const router = useRouter();
  const posthog = usePostHog();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error('Title and slug are required');
      return;
    }

    posthog.capture('post_create_started', {
      title: formData.title,
    });

    try {
      setIsLoading(true);
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      const data = await response.json();
      
      posthog.capture('post_created', {
        postId: data.postId,
        title: formData.title,
      });

      toast.success('Post created successfully!');
      router.push('/dashboard/posts');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => {
            const title = e.target.value;
            setFormData((prev) => ({
              ...prev,
              title,
              slug: prev.slug || generateSlug(title),
            }));
          }}
          placeholder="Enter post title"
          className={cn(
            "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-2.5 text-[13px] text-zinc-200",
            "placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 transition-all"
          )}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">
          Slug <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="my-awesome-post"
          className={cn(
            "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-2.5 text-[13px] text-zinc-200 font-mono",
            "placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 transition-all"
          )}
          required
        />
        <p className="text-xs text-zinc-500">URL-friendly version of the title</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Excerpt</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Brief description of the post"
          rows={3}
          className={cn(
            "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-2.5 text-[13px] text-zinc-200",
            "placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 transition-all resize-none"
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="Write your post content here..."
          rows={12}
          className={cn(
            "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-2.5 text-[13px] text-zinc-200",
            "placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 transition-all resize-y min-h-[200px]"
          )}
          required
        />
        <p className="text-xs text-zinc-500">Supports basic markdown formatting</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Tags</label>
        <Input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          placeholder="technology, tutorial, nextjs (comma separated)"
          className={cn(
            "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-2.5 text-[13px] text-zinc-200",
            "placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 transition-all"
          )}
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#6154f0] hover:bg-[#584acf]"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'Create Post'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/posts')}
          disabled={isLoading}
          className="border-zinc-600 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
