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
import { CheckSquare, Square, Star, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

const columnHelper = createColumnHelper<Post>();

export function PostsTable({ data }: { data: Post[] }) {
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

  const columns = [
    columnHelper.accessor('coverImage', {
      header: 'COVER',
      cell: (info) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-[8px] border border-white/10 shrink-0">
          {info.getValue() ? (
            <Image
              src={info.getValue()}
              alt="Cover"
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="bg-white/5 w-full h-full" />
          )}
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('title', {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex flex-row items-center gap-2 hover:text-white transition-colors"
        >
          POST TITLE
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: (info) => (
        <Link
          href={`/dashboard/posts/${info.row.original.slug}`}
          className="font-bold text-white hover:text-[#6154f0] transition-colors truncate max-w-[200px] md:max-w-xs block"
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
          className="flex flex-row items-center gap-2 hover:text-white transition-colors"
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
        return (
          <div className="flex items-center gap-2">
             <Badge variant="outline" className={cn(
               "text-[9px] uppercase font-bold tracking-[0.2em] px-2 py-0 border-transparent",
               isFeatured ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-zinc-500"
             )}>
               {isFeatured ? 'Featured' : 'Draft'}
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
        return (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast(post.featured ? 'Removing from features...' : 'Marking as featured...');
              toggleFeaturedMutation.mutate({ postId: post._id, featured: !post.featured });
            }}
            className={cn(
              "p-2 rounded-[8px] transition-all",
              post.featured ? "text-amber-400 hover:bg-amber-400/10" : "text-zinc-600 hover:text-white hover:bg-white/5"
            )}
            title="Toggle Featured Status"
          >
            <Star className={cn("h-4 w-4", post.featured && "fill-amber-400")} strokeWidth={2.5} />
          </button>
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
    <div className="overflow-x-auto">
      <Table className="min-w-[800px]">
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
  );
}
