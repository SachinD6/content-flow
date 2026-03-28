'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalPageViews: number;
    uniqueVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  trends: {
    pageViews: { date: string; value: number }[];
    visitors: { date: string; value: number }[];
  };
  topPosts: { title: string; views: number; slug: string }[];
  topReferrers: { source: string; visitors: number; percentage: number }[];
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browsers: { name: string; percentage: number }[];
}

const timeRanges = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
];

export function AnalyticsContent() {
  const [selectedRange, setSelectedRange] = useState(30);

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics', selectedRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics?days=${selectedRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-zinc-500">
        Failed to load analytics data
      </div>
    );
  }

  const { overview, trends, topPosts, topReferrers, devices, browsers } = analytics;

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#121319] rounded-[8px] p-1 border border-white/5">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={cn(
                "px-4 py-2 rounded-[6px] text-sm font-medium transition-all",
                selectedRange === range.value
                  ? "bg-[#6154f0] text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Page Views"
          value={formatNumber(overview.totalPageViews)}
          icon={Eye}
          trend={{ value: 12.5, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Unique Visitors"
          value={formatNumber(overview.uniqueVisitors)}
          icon={Users}
          trend={{ value: 8.3, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Avg. Session Duration"
          value={formatDuration(overview.avgSessionDuration)}
          icon={Clock}
          trend={{ value: 5.2, isPositive: false }}
          color="purple"
        />
        <StatCard
          title="Bounce Rate"
          value={`${overview.bounceRate}%`}
          icon={TrendingUp}
          trend={{ value: 2.1, isPositive: true }}
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 rounded-[16px] border border-white/5 bg-[#121319] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-200">Traffic Overview</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6154f0]" />
                <span className="text-zinc-400">Page Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-zinc-400">Unique Visitors</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-1">
            {trends.pageViews.map((day, index) => {
              const maxValue = Math.max(...trends.pageViews.map(d => d.value));
              const height = (day.value / maxValue) * 100;
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div className="relative w-full flex items-end justify-center gap-0.5 h-48">
                    <div
                      className="w-full bg-[#6154f0]/30 hover:bg-[#6154f0]/50 rounded-t-sm transition-all"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  {index % 5 === 0 && (
                    <span className="text-[10px] text-zinc-600">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6">
          <h3 className="text-lg font-semibold text-zinc-200 mb-6">Device Breakdown</h3>
          <div className="space-y-6">
            <DeviceItem
              icon={Monitor}
              label="Desktop"
              value={devices.desktop}
              color="blue"
            />
            <DeviceItem
              icon={Smartphone}
              label="Mobile"
              value={devices.mobile}
              color="green"
            />
            <DeviceItem
              icon={Tablet}
              label="Tablet"
              value={devices.tablet}
              color="purple"
            />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Posts */}
        <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-[#6154f0]" />
            <h3 className="text-lg font-semibold text-zinc-200">Top Posts</h3>
          </div>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.slug} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    index < 3 ? "bg-[#6154f0]/20 text-[#6154f0]" : "bg-zinc-800 text-zinc-500"
                  )}>
                    {index + 1}
                  </span>
                  <Link 
                    href={`/dashboard/posts/${post.slug}`}
                    className="text-sm text-zinc-300 hover:text-[#6154f0] transition-colors truncate max-w-[200px]"
                  >
                    {post.title}
                  </Link>
                </div>
                <span className="text-sm text-zinc-500 font-medium">{formatNumber(post.views)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="h-5 w-5 text-[#6154f0]" />
            <h3 className="text-lg font-semibold text-zinc-200">Top Referrers</h3>
          </div>
          <div className="space-y-4">
            {topReferrers.map((ref) => (
              <div key={ref.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">{ref.source}</span>
                  <span className="text-sm text-zinc-500">{formatNumber(ref.visitors)}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#6154f0] rounded-full transition-all"
                    style={{ width: `${ref.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Stats */}
        <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6">
          <h3 className="text-lg font-semibold text-zinc-200 mb-6">Browsers</h3>
          <div className="space-y-4">
            {browsers.map((browser) => (
              <div key={browser.name} className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">{browser.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6154f0] to-[#766bf3] rounded-full"
                      style={{ width: `${browser.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-zinc-500 w-10 text-right">{browser.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: { value: number; isPositive: boolean };
  color: 'blue' | 'green' | 'purple' | 'amber';
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-zinc-100">{value}</p>
        </div>
        <div className={cn("p-2 rounded-[8px]", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-4">
        {trend.isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-400" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-400" />
        )}
        <span className={cn(
          "text-sm font-medium",
          trend.isPositive ? "text-green-400" : "text-red-400"
        )}>
          {trend.value}%
        </span>
        <span className="text-sm text-zinc-500">vs last period</span>
      </div>
    </div>
  );
}

interface DeviceItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'purple';
}

function DeviceItem({ icon: Icon, label, value, color }: DeviceItemProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="flex items-center gap-4">
      <div className={cn("p-3 rounded-[10px]", colorClasses[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-zinc-200">{label}</span>
          <span className="text-sm font-bold text-zinc-100">{value}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all",
              color === 'blue' && "bg-blue-500",
              color === 'green' && "bg-green-500",
              color === 'purple' && "bg-purple-500"
            )}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}
