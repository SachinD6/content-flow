'use client';

import { Menu, Search, Bell, HelpCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { useUIStore } from '@/stores/uiStore';
import { LogoutButton } from '@/features/auth/LogoutButton';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function TopHeader() {
  const { profile, loading, error } = useUser();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const pathname = usePathname();

  // Create a clean path display like "CONTENTFLOW > POSTS"
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumb = paths.length > 1 ? paths[1].toUpperCase() : 'DASHBOARD';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/5 bg-[#0b0c10]/80 backdrop-blur-md px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-zinc-500">
          <span className="text-zinc-400">CONTENTFLOW</span>
          <span>&gt;</span>
          <span className="text-white">{breadcrumb}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-zinc-500" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search commands..."
            className="h-9 w-64 rounded-md border border-white/5 bg-[#121319] pl-9 pr-4 text-[13px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50"
          />
        </div>

        <div className="flex items-center gap-4 border-l border-white/5 pl-6">
          <button className="text-zinc-400 hover:text-white transition-colors relative cursor-pointer">
            <Bell className="h-5 w-5" strokeWidth={2} />
            <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-[#6154f0]" />
          </button>
          
          <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
            <HelpCircle className="h-5 w-5" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-3 ml-2 border-l border-white/5 pl-6">
            <div className="flex flex-col text-right hidden lg:flex">
              {loading ? (
                <Skeleton className="h-4 w-20" />
              ) : error ? (
                <span className="text-[13px] font-semibold text-red-400">Error</span>
              ) : (
                <span className="text-[13px] font-semibold text-white">
                  {profile?.displayName || 'Unknown'}
                </span>
              )}
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                {profile?.role || 'USER'}
              </span>
            </div>
            
            <div className="h-8 w-8 rounded-full overflow-hidden bg-[#121319] border border-white/10 shrink-0 relative">
              {loading ? (
                <Skeleton className="h-full w-full rounded-full bg-white/10" />
              ) : profile?.avatarUrl ? (
                <Image 
                  src={profile.avatarUrl} 
                  alt={profile?.displayName || 'User'} 
                  width={32} height={32}
                  className="object-cover h-full w-full"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-[#6154f0] text-[11px] font-bold text-white uppercase">
                  {profile?.displayName?.charAt(0) || '?'}
                </span>
              )}
            </div>

            <div className="ml-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
