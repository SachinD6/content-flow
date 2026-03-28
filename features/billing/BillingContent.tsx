'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { toast } from 'sonner';
import { CheckIcon, XIcon, Sparkles, Zap, Shield, Users, Database, LineChart, Code2, HeadphonesIcon } from 'lucide-react';

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

interface PricingFeature {
  icon: React.ReactNode;
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

  const features: PricingFeature[] = [
    {
      icon: <Sparkles className="h-4 w-4" />,
      feature: 'Blog posts',
      free: 'Up to 10',
      pro: 'Unlimited',
    },
    {
      icon: <Users className="h-4 w-4" />,
      feature: 'Team members',
      free: '1 user',
      pro: 'Up to 10 users',
    },
    {
      icon: <LineChart className="h-4 w-4" />,
      feature: 'Analytics',
      free: 'Basic',
      pro: 'Advanced (PostHog)',
    },
    {
      icon: <Database className="h-4 w-4" />,
      feature: 'Storage',
      free: '500MB',
      pro: '10GB',
    },
    {
      icon: <Code2 className="h-4 w-4" />,
      feature: 'API access',
      free: <XIcon className={cn('h-4 w-4 text-red-500')} />,
      pro: <CheckIcon className={cn('h-4 w-4 text-green-500')} />,
    },
    {
      icon: <HeadphonesIcon className="h-4 w-4" />,
      feature: 'Priority support',
      free: <XIcon className={cn('h-4 w-4 text-red-500')} />,
      pro: <CheckIcon className={cn('h-4 w-4 text-green-500')} />,
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Current Plan Status */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-100">Current Plan</h2>
            <div className="mt-2 flex items-center gap-3">
              <span
                className={cn(
                  'text-xl sm:text-2xl font-bold',
                  currentPlan === 'free' ? 'text-zinc-400' : 'text-green-400'
                )}
              >
                {currentPlan === 'free' ? 'Free Plan' : 'Pro Plan'}
              </span>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                Active
              </Badge>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              {currentPlan === 'free'
                ? 'You are on the free plan. Upgrade to unlock all features.'
                : 'You are on the Pro plan. All features unlocked.'}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Free Plan Card */}
        <div className={cn(
          "relative rounded-[16px] border p-4 sm:p-6 shadow-xl transition-all",
          currentPlan === 'free' 
            ? "border-[#6154f0]/50 bg-[#121319] ring-1 ring-[#6154f0]/20" 
            : "border-white/5 bg-[#121319]"
        )}>
          {currentPlan === 'free' && (
            <div className="absolute -top-3 left-4 sm:left-6">
              <Badge className="bg-[#6154f0] text-white border-none text-[10px]">
                Current Plan
              </Badge>
            </div>
          )}
          
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-zinc-800">
                <Shield className="h-5 w-5 text-zinc-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-200">Free</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-zinc-100">$0</span>
              <span className="text-zinc-500 text-sm sm:text-base">/month</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Perfect for getting started with content management.
            </p>
          </div>

          <div className="space-y-3 mb-4 sm:mb-6">
            {features.map((item) => (
              <div key={item.feature} className="flex items-center gap-3">
                <div className="text-zinc-600 shrink-0">{item.icon}</div>
                <span className="text-xs sm:text-sm text-zinc-400 flex-1">{item.feature}</span>
                <span className="text-xs sm:text-sm text-zinc-500">{item.free}</span>
              </div>
            ))}
          </div>

          <Button
            disabled={currentPlan === 'free'}
            className="w-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 cursor-default min-h-[44px]"
          >
            {currentPlan === 'free' ? 'Your Current Plan' : 'Downgrade'}
          </Button>
        </div>

        {/* Pro Plan Card */}
        <div className={cn(
          "relative rounded-[16px] border p-4 sm:p-6 shadow-xl transition-all",
          currentPlan === 'pro' 
            ? "border-green-500/50 bg-[#121319] ring-1 ring-green-500/20" 
            : "border-[#6154f0]/30 bg-[#121319]"
        )}>
          {currentPlan === 'pro' && (
            <div className="absolute -top-3 left-4 sm:left-6">
              <Badge className="bg-green-500 text-white border-none text-[10px]">
                Current Plan
              </Badge>
            </div>
          )}
          
          {/* Popular Badge */}
          {currentPlan === 'free' && (
            <div className="absolute -top-3 right-4 sm:right-6">
              <Badge className="bg-[#6154f0] text-white border-none text-[10px]">
                Most Popular
              </Badge>
            </div>
          )}
          
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-[#6154f0]/20">
                <Zap className="h-5 w-5 text-[#6154f0]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-100">Pro</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-zinc-100">$9.99</span>
              <span className="text-zinc-500 text-sm sm:text-base">/month</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Unlock unlimited content and team collaboration.
            </p>
          </div>

          <div className="space-y-3 mb-4 sm:mb-6">
            {features.map((item) => (
              <div key={item.feature} className="flex items-center gap-3">
                <div className="text-[#6154f0] shrink-0">{item.icon}</div>
                <span className="text-xs sm:text-sm text-zinc-300 flex-1">{item.feature}</span>
                <span className="text-xs sm:text-sm text-zinc-100 font-medium">{item.pro}</span>
              </div>
            ))}
          </div>

          {currentPlan === 'free' ? (
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-[#6154f0] hover:bg-[#584acf] min-h-[44px]"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Upgrade to Pro'}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleManage} 
              disabled={isLoading}
              className="w-full border-zinc-600 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white min-h-[44px]"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Manage Subscription'}
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 shadow-xl">
        <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-4">Detailed Comparison</h3>
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-3 text-left text-sm font-medium text-zinc-400">Feature</th>
                <th className="pb-3 text-center text-sm font-medium text-zinc-400">Free</th>
                <th className="pb-3 text-center text-sm font-medium text-[#6154f0]">Pro</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, index) => (
                <tr key={row.feature} className={cn(index !== features.length - 1 && 'border-b border-white/5')}>
                  <td className="py-4 text-sm text-zinc-300 flex items-center gap-2">
                    {row.icon}
                    {row.feature}
                  </td>
                  <td className="py-4 text-center text-sm text-zinc-500">
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
