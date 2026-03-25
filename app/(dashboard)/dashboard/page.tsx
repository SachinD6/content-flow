import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { sanityClient } from '@/lib/sanity/client';
import { POSTS_COUNT_QUERY } from '@/lib/sanity/queries';
import { FileText, Award, UserCheck } from 'lucide-react';
import type { Profile } from '@/types';

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Will be redirected by layout
  }

  // Fetch Profile and Posts count
  const [{ data: profileData }, totalPosts] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    sanityClient.fetch<number>(POSTS_COUNT_QUERY)
  ]);

  const profile = profileData as unknown as Profile;
  const rawProfileData = profileData as Record<string, unknown> | null;
  
  // Calculate completion percentage safely
  const fields = ['display_name', 'email', 'bio', 'website', 'avatar_url'];
  const filledFields = fields.filter((field) => Boolean(rawProfileData?.[field]));
  const profileCompletion = Math.round((filledFields.length / fields.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title={`Welcome back, ${rawProfileData?.display_name || 'Architect'}`} 
        description="Here is what is happening across your content ecosystem today."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-[#121319] border border-white/5 shadow-xl shadow-black/20 text-white rounded-[16px] p-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Total Posts</span>
            <FileText className="h-4 w-4 text-[#6154f0]" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">{totalPosts || 0}</span>
            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+2 this week</span>
          </div>
        </div>

        <div className="bg-[#121319] border border-white/5 shadow-xl shadow-black/20 text-white rounded-[16px] p-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Subscription Plan</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-3xl font-bold tracking-tight capitalize">{profile?.subscriptionTier || 'Free'}</span>
            <span className="text-[11px] text-zinc-500 font-medium tracking-wide">
              {profile?.subscriptionTier === 'pro' ? 'Unlimited access to all nodes' : 'Basic publishing limits active'}
            </span>
          </div>
        </div>

        <div className="bg-[#121319] border border-white/5 shadow-xl shadow-black/20 text-white rounded-[16px] p-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Profile Complete</span>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{profileCompletion}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-1 shadow-2xl">
        <div className="flex h-64 flex-col items-center justify-center rounded-[12px] bg-[#0b0c10] border border-white/5 border-dashed">
          <p className="text-sm font-medium text-zinc-500 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Initializing Content Database Connection...
          </p>
        </div>
      </div>
    </div>
  );
}
