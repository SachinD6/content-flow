'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { toast } from 'sonner';
import { ImageIcon, Sparkles, FileText, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';

export function NewPostForm() {
  const router = useRouter();
  const posthog = usePostHog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    coverImage: '',
    published: true,
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Title, slug, and content are required');
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

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll just store the file name and create a preview
      // In production, you'd upload to a storage service
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Title */}
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

      {/* Slug */}
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

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Cover Image</label>
        <div className="flex items-center gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative h-32 w-48 rounded-[8px] border border-white/10 bg-[#0b0c10] flex items-center justify-center cursor-pointer overflow-hidden group transition-all hover:border-white/20",
              coverImagePreview && "border-[#6154f0]/30"
            )}
          >
            {coverImagePreview ? (
              <img
                src={coverImagePreview}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                <ImageIcon className="h-8 w-8" />
                <span className="text-xs">Add cover image</span>
              </div>
            )}
            {coverImagePreview && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change image</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="hidden"
          />
          {coverImagePreview && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCoverImagePreview(null);
                setFormData((prev) => ({ ...prev, coverImage: '' }));
              }}
              className="border-zinc-600 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-zinc-500">Recommended size: 1200x630px</p>
      </div>

      {/* Excerpt */}
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

      {/* Content */}
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

      {/* Tags */}
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

      {/* Settings Section */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 space-y-6">
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Post Settings</h3>
        
        {/* Published Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              formData.published ? "bg-green-500/20" : "bg-zinc-800"
            )}>
              {formData.published ? (
                <Eye className="h-4 w-4 text-green-400" />
              ) : (
                <FileText className="h-4 w-4 text-zinc-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                {formData.published ? 'Published' : 'Draft'}
              </p>
              <p className="text-xs text-zinc-500">
                {formData.published 
                  ? 'Post will be visible to everyone' 
                  : 'Post will be saved as draft'}
              </p>
            </div>
          </div>
          <Switch
            checked={formData.published}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
          />
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              formData.featured ? "bg-[#6154f0]/20" : "bg-zinc-800"
            )}>
              <Sparkles className={cn(
                "h-4 w-4",
                formData.featured ? "text-[#6154f0]" : "text-zinc-500"
              )} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                {formData.featured ? 'Featured Post' : 'Regular Post'}
              </p>
              <p className="text-xs text-zinc-500">
                {formData.featured 
                  ? 'Post will appear in featured banner' 
                  : 'Post will appear in regular list'}
              </p>
            </div>
          </div>
          <Switch
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#6154f0] hover:bg-[#584acf]"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : formData.published ? 'Publish Post' : 'Save as Draft'}
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
