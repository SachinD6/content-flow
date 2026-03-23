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
