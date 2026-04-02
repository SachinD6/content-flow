export interface Author {
  _id?: string;
  name: string;
  slug?: string;
  bio?: string;
  avatar?: string | null;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  tags?: string[]| null;
  authorId?: string | null;
  author?: Author | null;
  coverImage?: string | null;
}

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  website: string;
  avatarUrl: string;
  subscriptionTier: 'free' | 'pro';
  role: 'user' | 'admin';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email?: string;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
  aud: string;
  created_at: string;
}

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface PageHeaderProps {
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}
