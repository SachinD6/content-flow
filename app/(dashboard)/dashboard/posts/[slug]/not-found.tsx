import Link from 'next/link';
import { FileWarning, ArrowLeft } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export default function SinglePostNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        <EmptyState 
          icon={FileWarning}
          title="Post Not Found"
          description="The exact editorial asset you requested no longer exists or might be drafted securely out of reach."
        />
        <div className="mt-8 flex justify-center">
          <Link 
            href="/dashboard/posts" 
            className="flex items-center gap-2 px-6 py-3 bg-[#121319] hover:bg-[#6154f0] hover:text-white border border-white/10 rounded-full text-[12px] font-bold uppercase tracking-widest text-zinc-300 transition-colors shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
