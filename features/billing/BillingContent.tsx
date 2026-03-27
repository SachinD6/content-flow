'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { toast } from 'sonner';
import { CheckIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';

interface BillingContentProps {
  currentPlan: 'free' | 'pro';
  userId: string;
  success: boolean;
  cancelled: boolean;
}

interface FeatureRow {
  feature: string;
  free: string | React.ReactNode;
  pro: string | React.ReactNode;
}

export function BillingContent({ currentPlan, userId, success, cancelled }: BillingContentProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (success) {
      toast.success('Successfully upgraded to Pro!');
    }
    if (cancelled) {
      toast.info('Upgrade cancelled');
    }
  }, [success, cancelled]);

  const handleUpgrade = async () => {
    posthog.capture('upgrade_intent', {
      plan: 'pro',
      userId,
      timestamp: new Date().toISOString(),
      currentPlan,
    });

    try {
      setIsLoading(true);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to create session');
      const data = await response.json();
      router.push(data.url);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to create portal session');
      const data = await response.json();
      router.push(data.url);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features: FeatureRow[] = [
    {
      feature: 'Blog posts',
      free: 'Up to 10',
      pro: 'Unlimited',
    },
    {
      feature: 'Team members',
      free: '1',
      pro: 'Up to 10',
    },
    {
      feature: 'Analytics',
      free: 'Basic',
      pro: 'Advanced (PostHog)',
    },
    {
      feature: 'Storage',
      free: '500MB',
      pro: '10GB',
    },
    {
      feature: 'API access',
      free: <XIcon className={cn('h-4 w-4 text-red-500')} />,
      pro: <CheckIcon className={cn('h-4 w-4 text-green-500')} />,
    },
    {
      feature: 'Priority support',
      free: <XIcon className={cn('h-4 w-4 text-red-500')} />,
      pro: <CheckIcon className={cn('h-4 w-4 text-green-500')} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Current Plan Card */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Current Plan</h2>
            <div className="mt-2 flex items-center gap-3">
              <span
                className={cn(
                  'text-2xl font-bold',
                  currentPlan === 'free' ? 'text-zinc-400' : 'text-green-400'
                )}
              >
                {currentPlan === 'free' ? 'Free Plan' : 'Pro Plan'}
              </span>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                Active
              </Badge>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              {currentPlan === 'free'
                ? 'You are on the free plan. Upgrade to unlock all features.'
                : 'You are on the Pro plan. All features unlocked.'}
            </p>
          </div>
          {currentPlan === 'free' ? (
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="bg-[#6154f0] hover:bg-[#584acf]"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Upgrade to Pro'}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleManage} 
              disabled={isLoading}
              className="border-zinc-600 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Manage Subscription'}
            </Button>
          )}
        </div>
      </div>

      {/* Plan Comparison Table */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Plan Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-3 text-left text-sm font-medium text-zinc-400">Feature</th>
                <th
                  className={cn(
                    'pb-3 text-center text-sm font-medium',
                    currentPlan === 'free' ? 'text-[#6154f0]' : 'text-zinc-400'
                  )}
                >
                  Free
                </th>
                <th
                  className={cn(
                    'pb-3 text-center text-sm font-medium',
                    currentPlan === 'pro' ? 'text-green-400' : 'text-zinc-400'
                  )}
                >
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, index) => (
                <tr key={row.feature} className={cn(index !== features.length - 1 && 'border-b border-white/5')}>
                  <td className="py-4 text-sm text-zinc-300">{row.feature}</td>
                  <td className="py-4 text-center text-sm text-zinc-400">
                    {typeof row.free === 'string' ? row.free : row.free}
                  </td>
                  <td className="py-4 text-center text-sm text-zinc-100">
                    {typeof row.pro === 'string' ? row.pro : row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
