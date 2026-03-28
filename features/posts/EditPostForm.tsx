'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
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
  Check,
  Plus,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

interface EditPostFormProps {
  post: Post & { _id: string; body?: unknown[]; coverImageAssetId?: string };
}

function portableTextToPlainText(body: unknown[]): string {
  if (!body || !Array.isArray(body)) return '';
  
  return body
    .map((block: unknown) => {
      if (typeof block === 'object' && block !== null && 'children' in block) {
        const children = (block as { children?: unknown[] }).children;
        if (Array.isArray(children)) {
          return children
            .map((child: unknown) => {
              if (typeof child === 'object' && child !== null && 'text' in child) {
                return (child as { text?: string }).text || '';
              }
              return '';
            })
            .join('');
        }
      }
      return '';
    })
    .join('\n\n');
}

export function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(post.coverImage || null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(true);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState({
    title: post.title || '',
    slug: post.slug || '',
    excerpt: post.excerpt || '',
    content: portableTextToPlainText(post.body || []),
    tags: post.tags || [],
    coverImage: post.coverImageAssetId || '',
    published: !!post.publishedAt,
    featured: post.featured || false,
  });

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: slugManuallyEdited ? prev.slug : generateSlug(newTitle),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleTogglePublished = () => {
    setFormData((prev) => ({ ...prev, published: !prev.published }));
  };

  const handleToggleFeatured = () => {
    setFormData((prev) => ({ ...prev, featured: !prev.featured }));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && tagInput === '' && formData.tags.length > 0) {
      setFormData((prev) => ({ 
        ...prev, 
        tags: prev.tags.slice(0, -1) 
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Title, slug, and content are required');
      return;
    }

    posthog.capture('post_update_started', {
      postId: post._id,
      title: formData.title,
    });

    try {
      setIsLoading(true);
      const response = await fetch('/api/posts/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post._id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update post');
      }

      const data = await response.json();
      
      posthog.capture('post_updated', {
        postId: post._id,
        title: formData.title,
      });

      toast.success(data.message || 'Post updated successfully!');
      router.push('/dashboard/posts');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to API
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, coverImage: data.assetId }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
      // Don't reset preview on error - keep the preview but don't save
    }
  };

  const inputClasses = cn(
    "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-3 text-[14px] text-zinc-200",
    "placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#6154f0]/30 focus:border-[#6154f0]/50",
    "transition-all hover:border-white/20"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-none lg:max-w-3xl">
      {/* Main Info Section */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 space-y-6">
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
            onChange={handleTitleChange}
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
              onChange={handleSlugChange}
              placeholder="my-awesome-post"
              className={cn(inputClasses, "pl-8 font-mono")}
              required
            />
          </div>
          <p className="text-xs text-zinc-500">This will be the URL of your post</p>
        </div>
      </div>

      {/* Media Section */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 space-y-6">
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
                  <NextImage
                    src={coverImagePreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    unoptimized
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
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 space-y-6">
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
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <Hash className="h-4 w-4 text-[#6154f0]" />
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Tags & Categories</h3>
        </div>

        {/* Tags Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-300">Tags</label>
          <div className="space-y-3">
            {/* Tag Display Area */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6154f0]/20 text-[#6154f0] text-sm font-medium border border-[#6154f0]/30"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-[#6154f0]/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Tag Input Field */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input
                  ref={tagInputRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type a tag and press Enter"
                  className={cn(inputClasses, "pl-10")}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="bg-[#6154f0] hover:bg-[#584acf] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Press Enter or click + to add a tag. Click the X to remove.
          </p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <Settings2 className="h-4 w-4 text-[#6154f0]" />
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Post Settings</h3>
        </div>
        
        <div className="space-y-4">
          {/* Published Toggle */}
          <button
            type="button"
            onClick={handleTogglePublished}
            className="w-full flex items-center justify-between p-3 sm:p-4 rounded-[12px] bg-[#0b0c10] border border-white/5 hover:border-white/10 transition-colors text-left"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={cn(
                "p-2 sm:p-2.5 rounded-[10px] transition-colors shrink-0",
                formData.published ? "bg-green-500/20" : "bg-zinc-800"
              )}>
                {formData.published ? (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                ) : (
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-200">
                  {formData.published ? 'Published' : 'Draft'}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {formData.published 
                    ? 'Your post is visible to everyone' 
                    : 'Only you can see this draft'}
                </p>
              </div>
            </div>
            <div className={cn(
              "w-10 sm:w-12 h-5 sm:h-6 rounded-full relative transition-colors duration-200 shrink-0",
              formData.published ? "bg-green-500" : "bg-zinc-700"
            )}>
              <div className={cn(
                "absolute top-0.5 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white shadow-md transition-transform duration-200",
                formData.published ? "translate-x-[18px] sm:translate-x-6" : "translate-x-0.5"
              )} />
            </div>
          </button>

          {/* Featured Toggle */}
          <button
            type="button"
            onClick={handleToggleFeatured}
            className="w-full flex items-center justify-between p-3 sm:p-4 rounded-[12px] bg-[#0b0c10] border border-white/5 hover:border-white/10 transition-colors text-left"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={cn(
                "p-2 sm:p-2.5 rounded-[10px] transition-colors shrink-0",
                formData.featured ? "bg-[#6154f0]/20" : "bg-zinc-800"
              )}>
                <Sparkles className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5",
                  formData.featured ? "text-[#6154f0]" : "text-zinc-500"
                )} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-200">
                  {formData.featured ? 'Featured Post' : 'Regular Post'}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {formData.featured 
                    ? 'Appears in the featured banner' 
                    : 'Appears in the regular posts list'}
                </p>
              </div>
            </div>
            <div className={cn(
              "w-10 sm:w-12 h-5 sm:h-6 rounded-full relative transition-colors duration-200 shrink-0",
              formData.featured ? "bg-[#6154f0]" : "bg-zinc-700"
            )}>
              <div className={cn(
                "absolute top-0.5 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white shadow-md transition-transform duration-200",
                formData.featured ? "translate-x-[18px] sm:translate-x-6" : "translate-x-0.5"
              )} />
            </div>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t border-white/5 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/posts')}
          disabled={isLoading}
          className="border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 min-h-[44px] order-2 sm:order-1"
        >
          Cancel
        </Button>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 order-1 sm:order-2">
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "px-6 min-h-[44px]",
              formData.published 
                ? "bg-[#6154f0] hover:bg-[#584acf]" 
                : "bg-zinc-700 hover:bg-zinc-600"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
