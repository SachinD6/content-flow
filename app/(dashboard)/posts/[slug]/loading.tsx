import { Skeleton } from '@/components/ui/skeleton';

export default function SinglePostLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Skeleton className="h-6 w-32 bg-white/5 rounded-md" />
      
      <div className="space-y-6 pt-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 bg-white/5 rounded-full" />
          <Skeleton className="h-6 w-20 bg-white/5 rounded-full" />
        </div>
        
        <Skeleton className="h-14 w-full max-w-2xl bg-white/5 rounded-lg" />
        <Skeleton className="h-10 w-full max-w-xl bg-white/5 rounded-lg" />
        
        <div className="flex items-center gap-4 pt-4">
          <Skeleton className="h-12 w-48 bg-white/5 rounded-full" />
          <Skeleton className="h-5 w-32 bg-white/5 rounded-md" />
        </div>
      </div>

      <Skeleton className="h-[400px] w-full bg-white/5 rounded-[16px]" />

      <div className="space-y-4 pt-8">
        <Skeleton className="h-4 w-full bg-white/5 rounded-sm" />
        <Skeleton className="h-4 w-full bg-white/5 rounded-sm" />
        <Skeleton className="h-4 w-3/4 bg-white/5 rounded-sm" />
        <Skeleton className="h-4 w-full bg-white/5 rounded-sm mt-8" />
        <Skeleton className="h-4 w-11/12 bg-white/5 rounded-sm" />
      </div>
    </div>
  );
}
