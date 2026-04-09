'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import { Star, ArrowUpDown, Pencil, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

const columnHelper = createColumnHelper<Post>();

export function PostsTable({ data, currentUserId }: { data: Post[]; currentUserId: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const queryClient = useQueryClient();

  // Optimistic Toggle Mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ postId, featured }: { postId: string; featured: boolean }) => {
      const response = await fetch('/api/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, featured }),
      });
      if (!response.ok) throw new Error('Failed to update');
      return response.json();
    },
    onMutate: async ({ postId, featured }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);
      queryClient.setQueryData<Post[]>(['posts'], (old) =>
        old?.map((post) => (post._id === postId ? { ...post, featured } : post)) ?? []
      );
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      toast.error('Could not toggle featured status. Changes reverted.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Mobile Card Component
  const MobilePostCard = ({ post }: { post: Post }) => {
    const isAuthor = post.authorId === `author-${currentUserId}`;
    const isPublished = !!post.publishedAt;
    const author = post.author || { name: 'Unknown', avatar: undefined };

    return (
      <div className="bg-[#0b0c10] border border-white/5 rounded-[12px] p-4 space-y-3">
        {/* Top: Cover + Title + Actions */}
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-[8px] border border-white/10 shrink-0 bg-zinc-800">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt="Cover"
                fill
                sizes="48px"
                className="object-cover"
                unoptimized={post.coverImage.includes('cdn.sanity.io')}
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <FileText className="h-5 w-5 text-zinc-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Link
              href={`/dashboard/posts/${post.slug}`}
              className="font-bold text-white hover:text-[#6154f0] transition-colors line-clamp-2 text-sm"
            >
              {post.title}
            </Link>
            
            <div className="flex items-center gap-2 mt-1.5">
              <div className="relative h-5 w-5 overflow-hidden rounded-[4px] border border-white/10">
                {author.avatar ? (
                  <Image src={author.avatar} alt={author.name} fill sizes="20px" className="object-cover" />
                ) : (
                  <div className="bg-[#6154f0] w-full h-full flex items-center justify-center text-[7px] font-bold text-white uppercase">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-[11px] text-zinc-400">{author.name}</span>
            </div>
          </div>

          {/* Actions */}
          {isAuthor && (
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={`/dashboard/posts/${post.slug}/edit`}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-[6px] text-zinc-400 hover:text-[#6154f0] hover:bg-[#6154f0]/10 transition-all"
              >
                <Pencil className="h-4 w-4" strokeWidth={2} />
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toast(post.featured ? 'Removing from features...' : 'Marking as featured...');
                  toggleFeaturedMutation.mutate({ postId: post._id, featured: !post.featured });
                }}
                className={cn(
                  "p-1.5 rounded-[6px] transition-all",
                  post.featured ? "text-amber-400 hover:bg-amber-400/10" : "text-zinc-600 hover:text-white hover:bg-white/5"
                )}
              >
                <Star className={cn("h-4 w-4", post.featured && "fill-amber-400")} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Middle: Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-[#171922] text-zinc-400 text-[9px] uppercase font-bold tracking-[0.1em] border-transparent rounded-[4px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Bottom: Date + Status */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Clock className="h-3 w-3" />
            <span className="text-[10px]">
              {post.publishedAt 
                ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '—'
              }
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {post.featured && (
              <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-[0.15em] px-1.5 py-0 border-transparent bg-amber-500/10 text-amber-400">
                Featured
              </Badge>
            )}
            <Badge variant="outline" className={cn(
              "text-[9px] uppercase font-bold tracking-[0.15em] px-1.5 py-0 border-transparent",
              isPublished ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-zinc-500"
            )}>
              {isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    columnHelper.accessor('coverImage', {
      header: 'COVER',
      cell: (info) => {
        const coverImage = info.getValue();
        return (
          <div className="relative h-10 w-10 overflow-hidden rounded-[8px] border border-white/10 shrink-0 bg-zinc-800">
            {coverImage ? (
              <Image
                src={coverImage}
                alt="Cover"
                fill
                sizes="40px"
                className="object-cover"
                unoptimized={coverImage.includes('cdn.sanity.io')}
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <FileText className="h-4 w-4 text-zinc-600" />
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor('title', {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex flex-row items-center gap-2 hover:text-white transition-colors cursor-pointer"
        >
          POST TITLE
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: (info) => (
        <Link
          href={`/dashboard/posts/${info.row.original.slug}`}
          className="font-bold text-white hover:text-[#6154f0] transition-colors truncate max-w-[200px] lg:max-w-xs xl:max-w-sm block"
        >
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('author', {
      header: 'AUTHOR',
      cell: (info) => {
        const author = info.getValue() || { name: 'Unknown', avatar: undefined };
        return (
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-[4px] border border-white/10">
              {author.avatar ? (
                <Image src={author.avatar!} alt={author.name} fill sizes="24px" className="object-cover" />
              ) : (
                <div className="bg-[#6154f0] w-full h-full flex items-center justify-center text-[8px] font-bold text-white uppercase">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-[12px] text-zinc-300 font-medium">{author.name}</span>
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor('tags', {
      header: 'TAGS',
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {info.getValue()?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-[#171922] text-zinc-400 hover:text-white hover:bg-white/10 text-[9px] uppercase font-bold tracking-[0.1em] border-transparent rounded-[6px]">
              {tag}
            </Badge>
          )) || <span className="text-zinc-600 text-[11px]">—</span>}
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('publishedAt', {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex flex-row items-center gap-2 hover:text-white transition-colors cursor-pointer"
        >
          LAST MODIFIED
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: (info) => {
        const dateStr = info.getValue();
        if (!dateStr) return <span className="text-zinc-600 text-[11px]">—</span>;
        const date = new Date(dateStr);
        return (
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-zinc-300">
              {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)}
            </span>
            <span className="text-[10px] text-zinc-600 font-mono tracking-wide">
              {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date)}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('featured', {
      header: 'STATUS',
      cell: (info) => {
        const isFeatured = info.getValue();
        const post = info.row.original;
        const isPublished = !!post.publishedAt;
        
        return (
          <div className="flex items-center gap-2">
             {isFeatured && (
               <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-[0.2em] px-2 py-0 border-transparent bg-amber-500/10 text-amber-400">
                 Featured
               </Badge>
             )}
             <Badge variant="outline" className={cn(
               "text-[9px] uppercase font-bold tracking-[0.2em] px-2 py-0 border-transparent",
               isPublished ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-zinc-500"
             )}>
               {isPublished ? 'Published' : 'Draft'}
             </Badge>
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'ACTIONS',
      cell: (info) => {
        const post = info.row.original;
        const isAuthor = post.authorId === `author-${currentUserId}`;
        
        return (
          <div className="flex items-center gap-1">
            {isAuthor && (
              <>
                <Link
                  href={`/dashboard/posts/${post.slug}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "p-2 rounded-[8px] transition-all cursor-pointer",
                    "text-zinc-400 hover:text-[#6154f0] hover:bg-[#6154f0]/10"
                  )}
                  title="Edit Post"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} />
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toast(post.featured ? 'Removing from features...' : 'Marking as featured...');
                    toggleFeaturedMutation.mutate({ postId: post._id, featured: !post.featured });
                  }}
                  className={cn(
                    "p-2 rounded-[8px] transition-all cursor-pointer",
                    post.featured ? "text-amber-400 hover:bg-amber-400/10" : "text-zinc-600 hover:text-white hover:bg-white/5"
                  )}
                  title="Toggle Featured Status"
                >
                  <Star className={cn("h-4 w-4", post.featured && "fill-amber-400")} strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>
        );
      },
      enableSorting: false,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {/* Card layout for mobile and tablet */}
      <div className="xl:hidden space-y-3">
        {data.map((post) => (
          <MobilePostCard key={post._id} post={post} />
        ))}
      </div>

      {/* Dense table layout only when there is enough horizontal room */}
      <div className="hidden xl:block overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-white/5 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600 py-4">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-b border-white/5 bg-transparent hover:bg-white/[0.02] transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
