'use client';

import { ReactNode } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  
  return (
    <div 
      className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}
    >
      {children}
    </div>
  );
}
