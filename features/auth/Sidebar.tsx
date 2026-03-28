'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, FileText, Settings, CreditCard, Menu, SquareTerminal, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import type { Post } from '@/types';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Posts', href: '/dashboard/posts', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

function SidebarContent() {
  const pathname = usePathname();
  const setActivePath = useUIStore((state) => state.setActivePath);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { profile, loading, error, refetch } = useUser();

  const { data: posts } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname, setActivePath]);

  return (
    <div className="flex flex-col h-full bg-[#0b0c10] border-r border-white/5 text-zinc-400 font-sans transition-all duration-300">
      {/* Brand Header with Collapse Toggle */}
      <div className={cn("flex items-center h-16 px-4 relative", !sidebarOpen && "justify-center px-2")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6154f0] shrink-0">
          <SquareTerminal className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        {sidebarOpen && (
          <div className="ml-3 flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold tracking-wide text-white leading-tight">ContentFlow</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#6154f0] font-bold">Engineering CMS</span>
          </div>
        )}
        {/* Collapse Toggle Button - Moved to top */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
          }}
          className={cn(
            "hidden lg:flex items-center justify-center p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer ml-auto shrink-0",
            !sidebarOpen && "ml-0"
          )}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          type="button"
          title={sidebarOpen ? "Collapse" : "Expand"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && 
            (item.href === '/dashboard' ? pathname === '/dashboard' : true);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center rounded-[8px] px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#121319] text-white border border-white/5 shadow-sm'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              )}
              title={!sidebarOpen ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0',
                  isActive ? 'text-[#6154f0]' : 'text-zinc-500 group-hover:text-zinc-300',
                  sidebarOpen && 'mr-3'
                )}
                strokeWidth={2}
              />
              {sidebarOpen && (
                <span className="truncate">{item.name}</span>
              )}
              {sidebarOpen && item.name === 'Posts' && posts && (
                <span className="ml-auto inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                  {posts.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <Link
          href="/documentation"
          className={cn(
            "flex items-center px-3 py-2 text-[12px] font-medium text-zinc-500 hover:text-zinc-300 rounded-[8px] hover:bg-white/5 transition-colors",
            !sidebarOpen && "justify-center px-0"
          )}
          title={!sidebarOpen ? 'Documentation' : undefined}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-4 w-4 shrink-0", sidebarOpen && "mr-3")}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          {sidebarOpen && "Documentation"}
        </Link>
        <Link
          href="/support"
          className={cn(
            "flex items-center px-3 py-2 text-[12px] font-medium text-zinc-500 hover:text-zinc-300 rounded-[8px] hover:bg-white/5 transition-colors",
            !sidebarOpen && "justify-center px-0"
          )}
          title={!sidebarOpen ? 'Support' : undefined}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-4 w-4 shrink-0", sidebarOpen && "mr-3")}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          {sidebarOpen && "Support"}
        </Link>
      </div>

      {/* User Profile Mini */}
      <div className="p-4 border-t border-white/5">
        <div className={cn("flex items-center relative", !sidebarOpen && "justify-center")}>
          {loading ? (
            <>
              <Skeleton className="h-8 w-8 rounded-full bg-white/10 shrink-0" />
              {sidebarOpen && (
                <div className="ml-3 flex flex-col gap-1.5 overflow-hidden flex-1">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                  <Skeleton className="h-3 w-16 bg-white/10" />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="relative h-8 w-8 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                {profile?.avatarUrl ? (
                  <Image 
                    src={profile.avatarUrl} 
                    alt="Avatar" 
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white uppercase">
                    {profile?.displayName?.charAt(0) || '?'}
                  </span>
                )}
                <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-[#0b0c10]" />
              </div>
              {sidebarOpen && (
                <div className="ml-3 flex flex-col overflow-hidden">
                  <span className="truncate text-[13px] font-semibold text-white">
                    {error ? (
                      <span className="text-red-400 text-xs">Error loading profile</span>
                    ) : profile?.displayName ? (
                      profile.displayName
                    ) : (
                      'Unknown User'
                    )}
                  </span>
                  {error && sidebarOpen && (
                    <button 
                      onClick={refetch}
                      className="text-[10px] text-[#6154f0] hover:text-[#584acf] mt-1 text-left cursor-pointer"
                    >
                      Retry
                    </button>
                  )}
                  <span className="truncate text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {profile?.role || 'USER'} &middot; {profile?.subscriptionTier || 'FREE'}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}

export function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <>
      <Sheet>
        <SheetTrigger className="lg:hidden fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#6154f0] text-white shadow-xl shadow-[#6154f0]/20 active:scale-95 transition-transform">
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-[#0b0c10] border-r-white/5 border-r">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen fixed top-0 left-0 bg-[#0b0c10] transition-all duration-300 z-40 border-r border-white/5 shadow-2xl",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
