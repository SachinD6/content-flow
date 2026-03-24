'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import type { Profile } from '@/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const fetchUserAndProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!mounted) return;
        setUser(currentUser);

        if (currentUser) {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          if (profileError) {
            // Handle case where profile does not exist yet gracefully
            if (profileError.code !== 'PGRST116') {
              throw profileError;
            }
          } else if (data) {
            if (!mounted) return;
            const profileData = data as unknown as ProfileRow;
            // Map snake_case to camelCase for the Profile interface
            setProfile({
              id: profileData.id,
              email: profileData.email,
              displayName: profileData.display_name || '',
              bio: profileData.bio || '',
              website: profileData.website || '',
              avatarUrl: profileData.avatar_url || '',
              subscriptionTier: profileData.subscription_tier,
              role: profileData.role,
              createdAt: profileData.created_at,
            });
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setProfile(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUserAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      const currentUser = session?.user ?? null;
      if (!mounted) return;
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
      } else {
        // Fetch profile dynamically when auth state changes to a logged-in user
        fetchUserAndProfile();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading, error };
}
