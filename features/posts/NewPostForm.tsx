'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { toast } from 'sonner';
import { 
  ImageIcon, 
  Sparkles, 
  FileText, 
  Eye, 
  Type, 
  Link2, 
  AlignLeft, 
  Hash, 
  Settings2,
  X,
  Check
} from 'lucide-react';

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

      toast.success(formData.published ? 'Post published successfully!' : 'Draft saved successfully!');
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

  const inputClasses = cn(
    "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-3 text-[14px] text-zinc-200",
    "placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#6154f0]/30 focus:border-[#6154f0]/50",
    "transition-all hover:border-white/20"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Main Info Section */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <Type className="h-4 w-4 text-[#6154f0]" />
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Post Information</h3>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-1">
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
            placeholder="Enter an engaging post title"
            className={inputClasses}
            required
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-1">
            <Link2 className="h-3 w-3 text-zinc-500" />
            Slug <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm font-mono">/</span>
            <Input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="my-awesome-post"
              className={cn(inputClasses, "pl-8 font-mono")}
              required
            />
          </div>
          <p className="text-xs text-zinc-500">This will be the URL of your post</p>
        </div>
      </div>

      {/* Media Section */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <ImageIcon className="h-4 w-4 text-[#6154f0]" />
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Media</h3>
        </div>

        {/* Cover Image */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-300">Cover Image</label>
          <div className="flex items-start gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative h-40 w-full max-w-md rounded-[12px] border-2 border-dashed cursor-pointer overflow-hidden group transition-all",
                coverImagePreview 
                  ? "border-[#6154f0]/30 bg-[#0b0c10]" 
                  : "border-white/10 bg-[#0b0c10] hover:border-white/20 hover:bg-[#0b0c10]/80"
              )}
            >
              {coverImagePreview ? (
                <>
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <ImageIcon className="h-8 w-8 text-white/80" />
                    <span className="text-white text-sm font-medium">Change image</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverImagePreview(null);
                      setFormData((prev) => ({ ...prev, coverImage: '' }));
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white/80 hover:text-white transition-colors z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  <div className="p-3 rounded-full bg-white/5">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium block">Click to upload cover image</span>
                    <span className="text-xs text-zinc-600 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</span>
                  </div>
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
          </div>
          <p className="text-xs text-zinc-500">Recommended size: 1200 x 630 pixels</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <AlignLeft className="h-4 w-4 text-[#6154f0]" />
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Content</h3>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Write a brief description that will appear in post previews..."
            rows={3}
            className={cn(inputClasses, "resize-none")}
          />
          <p className="text-xs text-zinc-500">This will be displayed in post cards and SEO meta description</p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-1">
            Main Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Write your post content here. Use double line breaks to create paragraphs..."
            rows={15}
            className={cn(inputClasses, "resize-y min-h-[300px] font-mono text-[13px]")}
            required
          />
          <p className="text-xs text-zinc-500">Supports basic formatting. Double line breaks create new paragraphs.</p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <Hash className="h-4 w-4 text-[#6154f0]" />
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Tags & Categories</h3>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Tags</label>
          <Input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="technology, tutorial, nextjs, react (comma separated)"
            className={inputClasses}
          />
          <p className="text-xs text-zinc-500">Add relevant tags to help users find your content</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <Settings2 className="h-4 w-4 text-[#6154f0]" />
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Post Settings</h3>
        </div>
        
        <div className="space-y-4">
          {/* Published Toggle */}
          <div className="flex items-center justify-between p-4 rounded-[12px] bg-[#0b0c10] border border-white/5">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2.5 rounded-[10px] transition-colors",
                formData.published ? "bg-green-500/20" : "bg-zinc-800"
              )}>
                {formData.published ? (
                  <Eye className="h-5 w-5 text-green-400" />
                ) : (
                  <FileText className="h-5 w-5 text-zinc-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  {formData.published ? 'Published' : 'Draft'}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {formData.published 
                    ? 'Your post will be visible to everyone' 
                    : 'Save as draft and publish later'}
                </p>
              </div>
            </div>
            <Switch
              checked={formData.published}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-4 rounded-[12px] bg-[#0b0c10] border border-white/5">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2.5 rounded-[10px] transition-colors",
                formData.featured ? "bg-[#6154f0]/20" : "bg-zinc-800"
              )}>
                <Sparkles className={cn(
                  "h-5 w-5",
                  formData.featured ? "text-[#6154f0]" : "text-zinc-500"
                )} />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  {formData.featured ? 'Featured Post' : 'Regular Post'}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {formData.featured 
                    ? 'Will appear in the featured banner at the top' 
                    : 'Will appear in the regular posts list'}
                </p>
              </div>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/posts')}
          disabled={isLoading}
          className="border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
        >
          Cancel
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            {formData.published ? (
              <>
                <Eye className="h-4 w-4" />
                <span>Will be published</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Will be saved as draft</span>
              </>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "px-6",
              formData.published 
                ? "bg-[#6154f0] hover:bg-[#584acf]" 
                : "bg-zinc-700 hover:bg-zinc-600"
            )}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : formData.published ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Publish Post
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Save as Draft
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
