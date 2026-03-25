import { SquareTerminal, Component, GitBranch, Layers, Key } from 'lucide-react';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#0b0c10] font-sans text-white">
      {/* Left Pane */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between border-r border-white/5 p-16 relative">
        {/* Subtle glow / shadow for ambiance */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#6154f0] opacity-10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 w-full max-w-lg mx-auto lg:mx-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6154f0]">
              <SquareTerminal className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-wide">ContentFlow</span>
          </div>

          <div className="mt-32">
            <h1 className="text-[3rem] font-bold leading-[1.1] tracking-tight mb-16">
              CMS-driven publishing for engineering teams.
            </h1>

            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <Component className="h-4 w-4 text-zinc-300" strokeWidth={2.5} />
                </div>
                <span className="text-lg text-zinc-300 font-medium tracking-tight">API-first delivery architecture</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <GitBranch className="h-4 w-4 text-zinc-300" strokeWidth={2.5} />
                </div>
                <span className="text-lg text-zinc-300 font-medium tracking-tight">Visual Schema Builder v2.0</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <Layers className="h-4 w-4 text-zinc-300" strokeWidth={2.5} />
                </div>
                <span className="text-lg text-zinc-300 font-medium tracking-tight">Multi-environment staging</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500">BACKED BY</span>
          <span className="text-sm font-semibold tracking-wide text-zinc-200">Supabase Auth</span>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center relative">
        {/* Abstract background blur for the right side */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-[#6154f0]/10 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-[420px] rounded-[24px] bg-[#121319] p-8 shadow-2xl border border-white/5">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex h-12 w-14 items-center justify-center rounded-[12px] bg-[#6154f0] shadow-lg mb-6 shadow-[#6154f0]/20">
              <Key className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h2>
            <p className="mt-2 text-[13px] text-zinc-400">Sign in to your workspace</p>
          </div>

          <LoginForm />
        </div>

        {/* Footer Links */}
        <div className="absolute bottom-10 flex gap-8 text-[9px] font-bold tracking-[0.2em] text-zinc-500">
          <Link href="#" className="hover:text-zinc-400 transition-colors">TERMS OF SERVICE</Link>
          <Link href="#" className="hover:text-zinc-400 transition-colors">PRIVACY POLICY</Link>
          <Link href="#" className="hover:text-zinc-400 transition-colors">SECURITY</Link>
        </div>
      </div>
    </div>
  );
}
