'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';

interface AdminUsersTableProps {
  users: Profile[];
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 shadow-xl">
      <div className="mb-4 text-sm text-zinc-400">
        {users.length} users
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-zinc-400">Email</TableHead>
            <TableHead className="text-zinc-400">Display Name</TableHead>
            <TableHead className="text-zinc-400">Plan</TableHead>
            <TableHead className="text-zinc-400">Role</TableHead>
            <TableHead className="text-zinc-400">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-white/5">
              <TableCell className="text-zinc-300">{user.email}</TableCell>
              <TableCell className="text-zinc-300">
                {user.displayName || '-'}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    user.subscriptionTier === 'pro'
                      ? 'border-green-500/30 text-green-400'
                      : 'border-zinc-700 text-zinc-400'
                  )}
                >
                  {user.subscriptionTier}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    user.role === 'admin'
                      ? 'border-red-500/30 text-red-400'
                      : 'border-zinc-700 text-zinc-400'
                  )}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-zinc-400 text-sm">
                {formatDate(user.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
