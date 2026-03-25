'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { deleteAccount } from '@/app/actions/deleteAccount';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DangerZoneProps {
  userId: string;
  userEmail: string;
}

export function DangerZone({ userId, userEmail }: DangerZoneProps) {
  const router = useRouter();
  const [typedEmail, setTypedEmail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const canConfirm = typedEmail === userEmail;

  async function handleDelete() {
    if (!canConfirm) return;
    
    setIsDeleting(true);
    
    try {
      const response = await deleteAccount(userId);
      if (response.success) {
        toast.success('Your account has been deleted permanently');
        router.push('/login');
      } else {
        throw new Error(response.error);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'An error occurred directly resolving deletion request.');
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 rounded-[16px] border border-red-900/40 bg-red-950/10 p-8 shadow-xl mt-8">
      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-tight text-red-500">Danger Zone</h3>
        <p className="text-sm text-zinc-400 max-w-lg">
          Permanently delete your account and all associated architectural data. This action cannot be undone. All active storage instances and schemas will be voided.
        </p>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger className="px-6 py-2.5 rounded-[8px] bg-red-500/10 border border-red-500/30 text-[12px] uppercase font-bold tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shrink-0">
          Delete Account
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-[#121319] border border-red-900/70 p-8 sm:max-w-md shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-xl">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently delete your account and all data. This action cannot be undone entirely.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-6 space-y-3">
            <label className="text-[12px] font-bold text-zinc-300 uppercase tracking-widest">
              Type your email address to confirm
            </label>
            <input
              type="email"
              value={typedEmail}
              onChange={(e) => setTypedEmail(e.target.value)}
              placeholder={userEmail}
              className={cn(
                "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-3 text-[14px] text-zinc-200",
                "focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all font-mono placeholder:text-zinc-700"
              )}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 border-none"
              onClick={() => {
                setTypedEmail('');
                setIsOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            
            <button
              onClick={handleDelete}
              disabled={!canConfirm || isDeleting}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-[8px] bg-red-600 text-[12px] uppercase font-bold tracking-widest text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                canConfirm && !isDeleting && "hover:bg-red-500"
              )}
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
