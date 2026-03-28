'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export function SyncButton() {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await queryClient.refetchQueries({ queryKey: ['posts'] });
      toast.success('Posts synced successfully');
    } catch {
      toast.error('Failed to sync posts');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-[#121319] hover:bg-white/5 rounded-[8px] text-[12px] font-bold text-zinc-300 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSyncing ? (
        <LoadingSpinner size="sm" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
      )}
      {isSyncing ? 'Syncing...' : 'Sync'}
    </button>
  );
}
