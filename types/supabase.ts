// Placeholder Database type — will be replaced by Supabase CLI generated types
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          bio: string;
          website: string;
          avatar_url: string;
          subscription_tier: 'free' | 'pro';
          role: 'user' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          bio?: string;
          website?: string;
          avatar_url?: string;
          subscription_tier?: 'free' | 'pro';
          role?: 'user' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          bio?: string;
          website?: string;
          avatar_url?: string;
          subscription_tier?: 'free' | 'pro';
          role?: 'user' | 'admin';
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
