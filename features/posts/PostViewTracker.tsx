'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

interface PostViewTrackerProps {
  slug: string;
  title: string;
}

export function PostViewTracker({ slug, title }: PostViewTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('post_viewed', { slug, title });
  }, [posthog, slug, title]);

  return null;
}
