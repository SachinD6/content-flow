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
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
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
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
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
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      collaborations: {
        Row: {
          id: string;
          owner_id: string;
          collaborator_id: string | null;
          collaborator_email: string;
          permission: 'read' | 'write';
          status: 'pending' | 'active' | 'revoked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          collaborator_id?: string | null;
          collaborator_email: string;
          permission: 'read' | 'write';
          status?: 'pending' | 'active' | 'revoked';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          collaborator_id?: string;
          collaborator_email?: string;
          permission?: 'read' | 'write';
          status?: 'pending' | 'active' | 'revoked';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'collaborations_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'collaborations_collaborator_id_fkey';
            columns: ['collaborator_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
