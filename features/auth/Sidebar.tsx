'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, CreditCard, Menu, X, BookOpen, LifeBuoy, SquareTerminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Posts', href: '/dashboard/posts', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

function SidebarContent() {
  const pathname = usePathname();
  const setActivePath = useUIStore((state) => state.setActivePath);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const { profile, loading } = useUser();

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname, setActivePath]);

  return (
    <div className="flex flex-col h-full bg-[#0b0c10] border-r border-white/5 text-zinc-400 font-sans transition-all duration-300">
      {/* Brand Header */}
      <div className={cn("flex items-center h-16 px-6 relative", !sidebarOpen && "justify-center px-0")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6154f0] shrink-0">
          <SquareTerminal className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        {sidebarOpen && (
          <div className="ml-3 flex flex-col">
            <span className="text-sm font-bold tracking-wide text-white leading-tight">ContentFlow</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#6154f0] font-bold">Engineering CMS</span>
          </div>
        )}
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
              {sidebarOpen && item.name === 'Posts' && (
                <span className="ml-auto inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                  12
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
          <BookOpen className={cn("h-4 w-4 shrink-0", sidebarOpen && "mr-3")} />
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
          <LifeBuoy className={cn("h-4 w-4 shrink-0", sidebarOpen && "mr-3")} />
          {sidebarOpen && "Support"}
        </Link>
      </div>

      {/* User Profile Mini */}
      <div className="p-4 border-t border-white/5">
        <div className={cn("flex items-center relative", !sidebarOpen && "justify-center")}>
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
                {loading ? 'Loading...' : profile?.displayName || 'Unknown User'}
              </span>
              <span className="truncate text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {profile?.role || 'USER'} &middot; {profile?.subscriptionTier || 'FREE'}
              </span>
            </div>
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
