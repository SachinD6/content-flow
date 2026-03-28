'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { createClient } from '@/lib/supabase/client';
import { profileSchema, type ProfileFormValues } from './profileSchema';
import { AvatarUpload } from './AvatarUpload';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';
import { Loader2 } from 'lucide-react';

export function SettingsForm({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) throw error || new Error('Profile not found');
      
      const d = data as Record<string, unknown>;
      // Map DB field names to standard Profile type
      return {
        id: d.id as string,
        email: d.email as string,
        displayName: d.display_name as string,
        bio: d.bio as string | null,
        website: d.website as string | null,
        avatarUrl: d.avatar_url as string | null,
        subscriptionTier: d.subscription_tier as 'free' | 'pro',
        role: d.role as 'user' | 'admin',
        createdAt: d.created_at as string,
      } as Profile;
    },
    staleTime: 30 * 1000,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      email: '',
      bio: '',
      website: '',
      avatarUrl: '',
    },
  });

  const currentAvatarUrl = useWatch({
    control: form.control,
    name: 'avatarUrl',
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName ?? '',
        email: profile.email,
        bio: profile.bio ?? '',
        website: profile.website ?? '',
        avatarUrl: profile.avatarUrl ?? '',
      });
    }
  }, [profile, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const supabase = createClient();
      const payload: Record<string, unknown> = {
        display_name: values.displayName,
        bio: values.bio === '' ? null : values.bio,
        website: values.website === '' ? null : values.website,
        avatar_url: values.avatarUrl === '' ? null : values.avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(payload as never)
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-[200px] w-full rounded-[16px] bg-[#121319]" />
        <Skeleton className="h-[400px] w-full rounded-[16px] bg-[#121319]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      {/* Section 3 "Avatar" (moved visually up structurally to match designs usually) */}
      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 lg:p-8 shadow-xl">
        <h3 className="text-xl font-bold tracking-tight text-white mb-2">Architect Identity</h3>
        <p className="text-sm text-zinc-400 mb-8">Update your avatar. This is how you&apos;ll appear across the platform.</p>
        <AvatarUpload 
          userId={userId} 
          currentAvatarUrl={currentAvatarUrl || null}
          onUploadComplete={(url) => {
            form.setValue('avatarUrl', url, { shouldDirty: true, shouldValidate: true });
          }}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-8">
          
          {/* Section 1 "Profile Information" */}
          <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 lg:p-8 shadow-xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 pb-4 border-b border-white/5">Profile Information</h3>
            
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-zinc-300">Display name</FormLabel>
                  <FormControl>
                    <input 
                      {...field} 
                      className={cn(
                        "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-3 text-[14px] text-zinc-200",
                        "focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 transition-all placeholder:text-zinc-600"
                      )} 
                      placeholder="e.g. John Doe"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-zinc-500">This is your public display name</FormDescription>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-end">
                    <FormLabel className="text-[12px] font-bold text-zinc-300">Bio</FormLabel>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">
                      {field.value?.length || 0} / 200
                    </span>
                  </div>
                  <FormControl>
                    <textarea 
                      {...field} 
                      rows={4}
                      className={cn(
                        "w-full resize-none rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-3 text-[14px] text-zinc-200",
                        "focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 transition-all placeholder:text-zinc-600"
                      )}
                      placeholder="Write a short technical bio..."
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-zinc-300">Website</FormLabel>
                  <FormControl>
                    <input 
                      {...field} 
                      type="url"
                      className={cn(
                        "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] px-4 py-3 text-[14px] text-zinc-200",
                        "focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 transition-all placeholder:text-zinc-600"
                      )} 
                      placeholder="https://yourwebsite.com"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </div>

          {/* Section 2 "Account" */}
          <div className="rounded-[16px] border border-white/5 bg-[#121319] p-4 sm:p-6 lg:p-8 shadow-xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 pb-4 border-b border-white/5">Account Parameters</h3>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-zinc-300">Email address</FormLabel>
                  <FormControl>
                    <input 
                      {...field} 
                      disabled
                      className={cn(
                        "w-full rounded-[8px] border border-white/5 bg-transparent px-4 py-3 text-[14px] text-zinc-500",
                        "cursor-not-allowed font-mono opacity-60"
                      )} 
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-zinc-600">Email cannot be changed directly via structural inputs.</FormDescription>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </div>

          {/* Save Controls */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 rounded-[16px] bg-[#121319] border border-white/5 p-4 shadow-xl">
             <button
               type="button"
               disabled={!form.formState.isDirty || updateMutation.isPending}
               onClick={() => form.reset()}
               className="px-6 py-3 text-[12px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
             >
               Discard
             </button>
             <button
               type="submit"
               disabled={updateMutation.isPending || !form.formState.isDirty}
               className="flex items-center justify-center gap-2 px-8 py-3 rounded-[8px] bg-[#6154f0] hover:bg-[#584acf] text-[12px] uppercase font-bold tracking-widest text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6154f0]/20 min-h-[44px]"
             >
               {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
               {updateMutation.isPending ? 'Saving...' : 'Save changes'}
             </button>
           </div>
        </form>
      </Form>
    </div>
  );
}
