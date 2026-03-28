import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { sanityClient } from '@/lib/sanity/client';
import { POSTS_COUNT_QUERY } from '@/lib/sanity/queries';
import { FileText, Award, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';
import type { Database } from '@/types/supabase';

interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  author: string;
}

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Will be redirected by layout
  }

  // Fetch Stats and Recent Content
  const RECENT_POSTS_QUERY = `*[_type == 'post'] | order(publishedAt desc)[0...3] {
    _id,
    title,
    'slug': slug.current,
    publishedAt,
    'author': author->name
  }`;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const WEEK_POSTS_COUNT_QUERY = `count(*[_type == 'post' && publishedAt > "${oneWeekAgo.toISOString()}"])`;

  const [{ data: profileData }, totalPosts, recentPosts, postsThisWeek] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    sanityClient.fetch<number>(POSTS_COUNT_QUERY),
    sanityClient.fetch<RecentPost[]>(RECENT_POSTS_QUERY),
    sanityClient.fetch<number>(WEEK_POSTS_COUNT_QUERY)
  ]);

  // Map Supabase snake_case to Profile camelCase
  const rawProfile = profileData as ProfileRow | null;
  const profile: Profile | null = rawProfile ? {
    id: rawProfile.id,
    email: rawProfile.email,
    displayName: rawProfile.display_name || '',
    bio: rawProfile.bio || '',
    website: rawProfile.website || '',
    avatarUrl: rawProfile.avatar_url || '',
    subscriptionTier: rawProfile.subscription_tier || 'free',
    role: rawProfile.role || 'user',
    stripeCustomerId: rawProfile.stripe_customer_id || undefined,
    stripeSubscriptionId: rawProfile.stripe_subscription_id || undefined,
    createdAt: rawProfile.created_at,
  } : null;

  // Calculate completion percentage safely
  const fields = ['display_name', 'email', 'bio', 'website', 'avatar_url'] as const;
  const filledFields = fields.filter((field) => Boolean(rawProfile?.[field]));
  const profileCompletion = Math.round((filledFields.length / fields.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title={`Welcome back, ${rawProfile?.display_name || 'Architect'}`}
        description="Here is what is happening across your content ecosystem today."
      />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-[#121319] border border-white/5 shadow-xl shadow-black/20 text-white rounded-[12px] sm:rounded-[16px] p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-zinc-500">Total Posts</span>
            <FileText className="h-4 w-4 text-[#6154f0]" />
          </div>
          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight">{totalPosts || 0}</span>
            <span className={cn(
              "text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full",
              postsThisWeek > 0 ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-500 bg-white/5"
            )}>
              {postsThisWeek > 0 ? `+${postsThisWeek}` : postsThisWeek} this week
            </span>
          </div>
        </div>

        <div className="bg-[#121319] border border-white/5 shadow-xl shadow-black/20 text-white rounded-[12px] sm:rounded-[16px] p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-zinc-500">Subscription Plan</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 sm:mt-4 flex flex-col gap-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight capitalize">{profile?.subscriptionTier || 'Free'}</span>
            <span className="text-[10px] sm:text-[11px] text-zinc-500 font-medium tracking-wide">
              {profile?.subscriptionTier === 'pro' ? 'Unlimited access to all nodes' : 'Basic publishing limits active'}
            </span>
          </div>
        </div>

        <div className="bg-[#121319] border border-white/5 shadow-xl shadow-black/20 text-white rounded-[12px] sm:rounded-[16px] p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-zinc-500">Profile Complete</span>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight">{profileCompletion}%</span>
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

      <div className="rounded-[12px] sm:rounded-[16px] border border-white/5 bg-[#121319] overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Recent Content Activity</h3>
          <Link href="/dashboard/posts" className="text-[10px] sm:text-[11px] font-bold text-[#6154f0] hover:text-[#584acf] transition-colors">View all architecture</Link>
        </div>

        {(!recentPosts || recentPosts.length === 0) ? (
          <div className="flex h-40 sm:h-48 flex-col items-center justify-center bg-[#0b0c10] px-4 text-center">
            <p className="text-sm text-zinc-500 font-medium">No recent architectural entries recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-zinc-500">Node Title</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-zinc-500">Architect</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-zinc-500">Publication Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <a href={`/dashboard/posts/${post.slug}`} className="text-xs sm:text-sm font-semibold text-zinc-200 hover:text-[#6154f0] transition-colors truncate block max-w-[200px] sm:max-w-none">
                        {post.title}
                      </a>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="text-[10px] sm:text-xs text-zinc-400 font-mono">{post.author || 'Generic System'}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="text-[10px] sm:text-xs text-zinc-500">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Draft Stage'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
