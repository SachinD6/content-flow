'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';
import { BlogPostCard } from '@/features/posts/BlogPostCard';
import { useDebounce } from '@/hooks/useDebounce';
import type { Post } from '@/types';

interface BlogContentProps {
  posts: Post[];
  featuredPost: Post | null;
  allTags: string[];
}

export function BlogContent({ posts, allTags }: BlogContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredPosts = useMemo(() => {
    const query = debouncedSearchQuery.toLowerCase().trim();
    
    return posts.filter(post => {
      const matchesSearch = !query || 
        post.title.toLowerCase().includes(query) || 
        (post.excerpt || '').toLowerCase().includes(query) ||
        (post.tags || []).some(tag => tag.toLowerCase().includes(query));
      
      const matchesTag = activeTag === 'all' || (post.tags || []).includes(activeTag);
      
      return matchesSearch && matchesTag;
    });
  }, [posts, debouncedSearchQuery, activeTag]);

  const firstPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveTag('all');
  };

  return (
    <div>
      {/* Search and Tags Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Latest Stories</h2>
          <p className="text-zinc-500 text-sm">Thoughts, tutorials, and insights</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-64 rounded-full border border-white/[0.08] bg-[#121319] pl-9 pr-8 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#6154f0]/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/[0.04] scrollbar-hide">
          <button
            onClick={() => setActiveTag('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTag === 'all'
                ? 'bg-white text-[#0b0c10]'
                : 'bg-transparent text-zinc-500 hover:text-white'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTag === tag
                  ? 'bg-[#6154f0] text-white'
                  : 'bg-transparent text-zinc-500 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 border-t border-white/[0.04]">
          <div className="w-16 h-16 rounded-full bg-[#121319] flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No stories found</h3>
          <p className="text-zinc-500 mb-6">Try adjusting your search</p>
          <button 
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0b0c10] rounded-full font-medium hover:bg-zinc-200 transition-colors"
          >
            Clear
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.04]">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Latest Articles</h3>
            <p className="text-sm text-zinc-500">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}
            </p>
          </div>

          {/* Articles Grid - Medium Style */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12">
            {/* Main Column */}
            <div className="lg:col-span-8">
              {filteredPosts.map((post, index) => (
                <BlogPostCard 
                  key={post._id} 
                  post={post} 
                  horizontal 
                  isFirst={index === 0}
                />
              ))}
            </div>

            {/* Sidebar - Optional, could show trending or tags */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24 pt-2">
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Discover</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className="px-3 py-1.5 bg-[#121319] text-zinc-400 text-sm rounded-full hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
