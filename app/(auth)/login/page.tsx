import { SquareTerminal, Component, GitBranch, Layers, Key, EyeOff, CircleCheck } from "lucide-react";
import Link from "next/link";

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
          
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-14 items-center justify-center rounded-[12px] bg-[#6154f0] shadow-lg mb-6 shadow-[#6154f0]/20">
              <Key className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h2>
            <p className="mt-2 text-[13px] text-zinc-400">Sign in to your workspace</p>
          </div>

          <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-[10px] border border-white/5 bg-[#121319] hover:bg-white/5 px-4 py-3 text-[13.5px] font-medium text-zinc-200 transition-colors">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-7 flex items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="mx-4 text-[10px] uppercase tracking-wider font-semibold text-zinc-600">OR</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold tracking-wide text-zinc-500">Email address</label>
              <div className="relative flex items-center rounded-lg border border-white/5 bg-[#171922] shadow-inner overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500" />
                <input 
                  type="email" 
                  placeholder="architect@contentflow.io"
                  className="flex-1 bg-transparent px-4 py-3 pl-5 text-[13.5px] text-zinc-200 placeholder-zinc-500 focus:outline-none"
                />
                <div className="pr-4">
                  <CircleCheck className="h-4 w-4 text-emerald-500" fill="currentColor" stroke="#171922" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[11px] font-semibold tracking-wide text-zinc-500">Password</label>
                <Link href="#" className="text-[11px] font-medium text-[#6154f0] hover:text-[#766bf3] transition-colors">Forgot password?</Link>
              </div>
              <div className="relative flex items-center rounded-lg border border-white/5 bg-[#171922] shadow-inner overflow-hidden">
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  className="flex-1 bg-transparent px-4 py-3 text-[14px] tracking-widest text-zinc-200 placeholder-zinc-500 focus:outline-none"
                />
                <div className="pr-4">
                  <EyeOff className="h-4 w-4 text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors" />
                </div>
              </div>
            </div>

            <button className="mt-8 w-full rounded-[10px] bg-[#6154f0] py-3.5 text-[13px] font-semibold text-white hover:bg-[#584acf] transition-all">
              Sign in
            </button>
          </div>

          <p className="mt-8 text-center text-[11px] text-zinc-500">
            Don't have an account? <Link href="#" className="font-medium text-[#6154f0] hover:text-[#766bf3] transition-colors ml-1">Request access</Link>
          </p>
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
