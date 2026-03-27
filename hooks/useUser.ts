'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserAndProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      
      // Get current session first - this is more reliable than getUser()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        console.log('No session found');
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      // Fetch profile
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        // Profile doesn't exist yet
        if (profileError.code === 'PGRST116') {
          setProfile(null);
        } else {
          setError(profileError);
          setProfile(null);
        }
      } else if (data) {
        console.log('Profile loaded:', data);
        const profileData = data as ProfileRow;
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
    } catch (err) {
      console.error('useUser error:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAndProfile();

    // Subscribe to auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setLoading(false);
        } else if (session) {
          setUser(session.user);
          fetchUserAndProfile();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserAndProfile]);

  return { user, profile, loading, error, refetch: fetchUserAndProfile };
}
