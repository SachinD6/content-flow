'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Circle, 
  Download, 
  Settings, 
  Activity, 
  Users, 
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface PostHogEvent {
  id: string;
  timestamp: string;
  event: string;
  distinct_id: string;
  properties: Record<string, string | number | boolean>;
}

interface AnalyticsData {
  stats: {
    eventsToday: number;
    uniqueUsers: number;
    avgSession: string;
  };
  events: PostHogEvent[];
  featureFlags: {
    name: string;
    enabled: boolean;
    description: string;
  }[];
}

const eventColors: Record<string, string> = {
  post_viewed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  upgrade_intent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  upgrade_completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  form_submitted: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  page_view: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  login: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  post_created: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  post_updated: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  default: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
};

function getEventColor(eventName: string): string {
  return eventColors[eventName] || eventColors.default;
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 5) return 'now';
  if (diffSecs < 60) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatProperties(properties: Record<string, string | number | boolean>, isMobile: boolean): string {
  const entries = Object.entries(properties).slice(0, isMobile ? 1 : 2);
  if (entries.length === 0) return '';
  
  return entries
    .map(([key, value]) => {
      const maxLen = isMobile ? 12 : 20;
      const displayValue = typeof value === 'string' && value.length > maxLen 
        ? value.substring(0, maxLen) + '...' 
        : String(value);
      return `${key}: ${displayValue}`;
    })
    .join(' · ');
}

// Skeleton Components
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#121319] p-3 sm:p-4 md:p-6">
      <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-20 mb-2 sm:mb-3 bg-white/5" />
      <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 bg-[#6154f0]/20" />
    </div>
  );
}

function EventRowSkeleton() {
  return (
    <div className="p-3 sm:p-4">
      <div className="flex items-start sm:items-center gap-2 sm:gap-4">
        <Skeleton className="h-3.5 sm:h-4 w-8 sm:w-10 shrink-0 bg-white/5 mt-0.5 sm:mt-0" />
        <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 shrink-0 bg-white/5" />
        <Skeleton className="h-3.5 sm:h-4 flex-1 bg-white/5" />
      </div>
    </div>
  );
}

function FeatureFlagSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#121319] p-3 sm:p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-40 sm:w-48 mb-2 bg-white/5" />
          <Skeleton className="h-3 w-48 sm:w-64 bg-white/5" />
        </div>
        <Skeleton className="h-5 sm:h-6 w-10 sm:w-12 shrink-0 rounded-full bg-white/5 mt-0.5" />
      </div>
    </div>
  );
}

export function AnalyticsContent() {
  const [isLive, setIsLive] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const { 
    data: analytics, 
    isLoading, 
    isFetching,
    refetch 
  } = useQuery<AnalyticsData>({
    queryKey: ['posthog-events'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      setLastRefreshed(new Date());
      return response.json();
    },
    refetchInterval: isLive ? 5000 : false,
    staleTime: 3000,
  });

  const handleManualRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!analytics?.events) return;
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalEvents: analytics.events.length,
      events: analytics.events
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `posthog-events-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  }, [analytics?.events]);

  const { stats, events, featureFlags } = analytics || {
    stats: { eventsToday: 0, uniqueUsers: 0, avgSession: '0m 0s' },
    events: [],
    featureFlags: []
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full min-w-0 overflow-x-hidden">
      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-6 max-w-3xl mx-auto w-full">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-6 max-w-3xl mx-auto w-full">
          <div className="rounded-2xl border border-white/5 bg-[#121319] p-3 sm:p-4 md:p-6 hover:border-[#6154f0]/30 transition-all duration-300 group overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 md:mb-3">
              <Activity className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-zinc-500 group-hover:text-[#6154f0] transition-colors shrink-0" />
              <p className="text-[8px] sm:text-[9px] md:text-xs uppercase tracking-wider text-zinc-500 truncate">Events Today</p>
            </div>
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#6154f0] truncate">
              {stats.eventsToday.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#121319] p-3 sm:p-4 md:p-6 hover:border-[#6154f0]/30 transition-all duration-300 group overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 md:mb-3">
              <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-zinc-500 group-hover:text-[#6154f0] transition-colors shrink-0" />
              <p className="text-[8px] sm:text-[9px] md:text-xs uppercase tracking-wider text-zinc-500 truncate">Unique Users</p>
            </div>
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#6154f0] truncate">
              {stats.uniqueUsers.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#121319] p-3 sm:p-4 md:p-6 hover:border-[#6154f0]/30 transition-all duration-300 group overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 md:mb-3">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-zinc-500 group-hover:text-[#6154f0] transition-colors shrink-0" />
              <p className="text-[8px] sm:text-[9px] md:text-xs uppercase tracking-wider text-zinc-500 truncate">Avg. Session</p>
            </div>
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#6154f0] truncate">
              {stats.avgSession}
            </p>
          </div>
        </div>
      )}

      {/* Live Event Stream */}
      <div className="rounded-2xl border border-white/5 bg-[#121319] overflow-hidden hover:border-white/10 transition-colors min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 md:p-6 border-b border-white/5 gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-zinc-200 truncate">Live event stream</h3>
              <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                <Circle className={cn(
                  "h-1 w-1 sm:h-1.5 sm:w-1.5 fill-current",
                  isLive && !isFetching ? "text-emerald-400 animate-pulse" : "text-zinc-600"
                )} />
                <span className={cn(
                  "text-[8px] sm:text-[10px] font-medium",
                  isLive ? "text-emerald-400" : "text-zinc-500"
                )}>
                  {isLive ? 'LIVE' : 'PAUSED'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 min-w-0">
            <span className="text-[9px] sm:text-[10px] text-zinc-600 font-mono hidden sm:block">
              {lastRefreshed.toLocaleTimeString()}
            </span>
            <button
              onClick={handleManualRefresh}
              disabled={isFetching}
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md text-[10px] sm:text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all shrink-0"
            >
              <RefreshCw className={cn("h-2.5 w-2.5 sm:h-3 sm:w-3", isFetching && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="divide-y divide-white/5 max-h-[50vh] sm:max-h-[400px] overflow-y-auto overflow-x-hidden min-w-0">
          {isLoading ? (
            <>
              <EventRowSkeleton />
              <EventRowSkeleton />
              <EventRowSkeleton />
              <EventRowSkeleton />
              <EventRowSkeleton />
              <EventRowSkeleton />
              <EventRowSkeleton />
            </>
          ) : events.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-800 mb-3 sm:mb-4">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500" />
              </div>
              <p className="text-sm sm:text-base text-zinc-400 font-medium mb-1">No events captured yet</p>
              <p className="text-[10px] sm:text-xs text-zinc-600">
                Events will appear here once PostHog starts tracking your application
              </p>
            </div>
          ) : (
            events.map((event, index) => (
              <div 
                key={event.id} 
                className={cn(
                  "p-3 sm:p-4 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer",
                  index === 0 && "bg-white/[0.01]"
                )}
                onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
              >
                {/* Mobile Layout */}
                <div className="sm:hidden w-full min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                      <span className="text-[9px] text-zinc-600 font-mono shrink-0">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-medium border shrink-0 max-w-[100px] truncate",
                        getEventColor(event.event)
                      )}>
                        {event.event}
                      </span>
                    </div>
                    <ChevronRight className={cn(
                      "h-3.5 w-3.5 text-zinc-600 transition-transform shrink-0",
                      expandedEvent === event.id && "rotate-90"
                    )} />
                  </div>
                  <div className="w-full min-w-0">
                    <p className="text-[10px] text-zinc-400 font-mono truncate">
                      {formatProperties(event.properties, true)}
                    </p>
                    {expandedEvent === event.id && (
                      <div className="mt-2 pt-2 border-t border-white/5 space-y-1 w-full">
                        {Object.entries(event.properties).map(([key, value]) => (
                          <div key={key} className="flex items-start gap-2 text-[9px] w-full">
                            <span className="text-zinc-600 shrink-0">{key}:</span>
                            <span className="text-zinc-400 font-mono break-all min-w-0">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex sm:items-center gap-3 md:gap-4 lg:gap-6 w-full min-w-0">
                  <span className="text-[10px] md:text-xs text-zinc-600 w-10 md:w-12 shrink-0 font-mono">
                    {formatRelativeTime(event.timestamp)}
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border shrink-0 max-w-[120px] truncate",
                    getEventColor(event.event)
                  )}>
                    {event.event}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs md:text-sm text-zinc-400 font-mono block truncate">
                      {formatProperties(event.properties, false)}
                    </span>
                  </div>
                  <button 
                    className="opacity-0 hover:opacity-100 transition-opacity text-zinc-600 hover:text-zinc-400 shrink-0"
                    title="View event details"
                  >
                    <ExternalLink className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stream Footer */}
        <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between">
            <p className="text-[9px] sm:text-[10px] text-zinc-600">
              {events.length} events
              {isFetching && <span className="ml-2 text-[#6154f0]">Updating...</span>}
            </p>
            <button
              onClick={() => setIsLive(!isLive)}
              className={cn(
                "text-[9px] sm:text-[10px] px-2 py-1 rounded-md transition-colors",
                isLive 
                  ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20" 
                  : "text-zinc-500 bg-zinc-500/10 hover:bg-zinc-500/20"
              )}
            >
              {isLive ? 'Stop' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Flags */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 bg-white/5" />
          <FeatureFlagSkeleton />
        </div>
      ) : featureFlags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs sm:text-sm font-semibold text-zinc-300 px-1">Feature Flags</h3>
          {featureFlags.map((flag) => (
            <div 
              key={flag.name}
              className="rounded-2xl border border-white/5 bg-[#121319] p-3 sm:p-4 md:p-6 hover:border-white/10 transition-all overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3 min-w-0">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 min-w-0">
                    <span className="text-[10px] sm:text-xs text-zinc-500 shrink-0">Feature flag:</span>
                    <code className="text-[#6154f0] font-mono text-xs sm:text-sm truncate">{flag.name}</code>
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-zinc-500">
                    {flag.description}
                  </p>
                </div>
                <button
                  onClick={() => {/* Toggle feature flag */}}
                  className={cn(
                    "relative w-9 sm:w-11 h-5 sm:h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#6154f0]/50 mt-0.5",
                    flag.enabled ? "bg-emerald-500" : "bg-zinc-700"
                  )}
                  aria-pressed={flag.enabled}
                >
                  <span className="sr-only">Toggle {flag.name}</span>
                  <span className={cn(
                    "absolute top-0.5 left-0.5 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center",
                    flag.enabled ? "translate-x-4 sm:translate-x-5" : "translate-x-0"
                  )}>
                    {flag.enabled && (
                      <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 md:gap-4 pt-2 sm:pt-4">
        <button
          onClick={handleExport}
          disabled={isLoading || events.length === 0}
          className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-[10px] sm:text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />
          <span>Export JSON</span>
          {!isLoading && events.length > 0 && (
            <span className="text-[9px] sm:text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
              {events.length}
            </span>
          )}
        </button>
        <a
          href="https://us.posthog.com/project/settings"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 rounded-xl bg-[#6154f0] hover:bg-[#584acf] text-white text-[10px] sm:text-xs uppercase tracking-wider font-medium transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#6154f0]/20 hover:-translate-y-0.5"
        >
          <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Configure PostHog</span>
          <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-60" />
        </a>
      </div>
    </div>
  );
}
