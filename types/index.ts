export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  coverImage: string;
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
  title: string;
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
