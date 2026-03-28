'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, EyeOff, Eye } from 'lucide-react';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) {
        toast.error('Signup failed', {
          description: error.message,
        });
        return;
      }

      if (data?.session) {
        toast.success('Account created successfully!');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.success('Check your email to verify your account!');
      }
    } catch {
      toast.error('Something went wrong', {
        description: 'A network error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) {
        toast.error('Google signup failed', {
          description: error.message,
        });
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error('Something went wrong', {
        description: 'A network error occurred. Please try again.',
      });
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading || isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-[10px] border border-white/5 bg-[#121319] hover:bg-white/5 px-4 py-3 text-[13.5px] font-medium text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
            <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
            <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
          </svg>
        )}
        Sign up with Google
      </button>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-white/5"></div>
        <span className="mx-4 text-[10px] uppercase tracking-wider font-semibold text-zinc-600">OR</span>
        <div className="flex-grow border-t border-white/5"></div>
      </div>

      {/* Email/Password Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-semibold tracking-wide text-zinc-500">
                  Email address
                </FormLabel>
                <FormControl>
                  <input
                    type="email"
                    placeholder="architect@contentflow.io"
                    disabled={isLoading}
                    className="flex w-full rounded-lg border border-white/5 bg-[#171922] px-4 py-3 text-[13.5px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-semibold tracking-wide text-zinc-500">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      disabled={isLoading}
                      className="flex w-full rounded-lg border border-white/5 bg-[#171922] px-4 py-3 pr-12 text-[14px] tracking-widest text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 disabled:opacity-50"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-zinc-600 hover:text-zinc-400 transition-colors" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-zinc-600 hover:text-zinc-400 transition-colors" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="mt-4 w-full rounded-[10px] bg-[#6154f0] py-3.5 text-[13px] font-semibold text-white hover:bg-[#584acf] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign up
          </button>
        </form>
      </Form>

      <p className="text-center text-[11px] text-zinc-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-[#6154f0] hover:text-[#766bf3] transition-colors ml-1"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
