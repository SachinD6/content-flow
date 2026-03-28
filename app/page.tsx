import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Check, 
  FileText, 
  Zap, 
  Shield, 
  BarChart3, 
  Users,
  Sparkles,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0c10]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0b0c10]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#6154f0]">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base sm:text-lg font-bold text-white">ContentFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/login" 
                className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/login" 
                className="rounded-[8px] bg-[#6154f0] px-3 sm:px-4 py-2 text-sm font-semibold text-white hover:bg-[#584acf] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6154f0]/30 bg-[#6154f0]/10 px-3 sm:px-4 py-1.5 mb-6 sm:mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#6154f0]"></span>
              <span className="text-xs sm:text-sm text-[#6154f0] font-medium">Now in Public Beta</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4 sm:mb-6">
              Create, Manage & Publish
              <span className="text-[#6154f0]"> Content</span> at Scale
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-4 sm:px-0">
              The modern CMS for technical teams. Write in markdown, collaborate with your team, 
              and publish with confidence. Built for developers, loved by content creators.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link 
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-[8px] bg-[#6154f0] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-[#584acf] transition-colors"
              >
                Start Creating Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a 
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-[8px] border border-white/10 bg-white/5 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
        
        {/* Gradient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#6154f0]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 sm:top-40 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
              Powerful features designed for modern content workflows. From writing to publishing, wewe've got you covered.apos;ve got you covered.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard 
              icon={FileText}
              title="Rich Content Editor"
              description="Write in markdown with live preview. Support for images, code blocks, and custom components."
              color="blue"
            />
            <FeatureCard 
              icon={Users}
              title="Team Collaboration"
              description="Work together with your team. Real-time updates, comments, and approval workflows."
              color="green"
            />
            <FeatureCard 
              icon={BarChart3}
              title="Advanced Analytics"
              description="Track performance with detailed insights. Understand your audience and optimize content."
              color="purple"
            />
            <FeatureCard 
              icon={Shield}
              title="Enterprise Security"
              description="Role-based access control, audit logs, and secure authentication with Supabase."
              color="amber"
            />
            <FeatureCard 
              icon={Zap}
              title="Lightning Fast"
              description="Built on Next.js 16 with edge caching. Your content loads instantly, everywhere."
              color="pink"
            />
            <FeatureCard 
              icon={Sparkles}
              title="AI-Powered"
              description="Smart suggestions, auto-formatting, and content optimization powered by AI."
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#121319]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How ContentFlow Works
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Get started in minutes. Our streamlined workflow makes content creation a breeze.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              number="01"
              title="Create"
              description="Start writing with our intuitive markdown editor. Add images, format text, and organize with tags."
            />
            <StepCard 
              number="02"
              title="Collaborate"
              description="Invite your team to review and edit. Leave comments, suggest changes, and approve content."
            />
            <StepCard 
              number="03"
              title="Publish"
              description="Hit publish and your content goes live instantly. Track performance with built-in analytics."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-0">
            {/* Free Plan */}
            <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-zinc-400" />
                <h3 className="text-xl font-bold text-zinc-200">Free</h3>
              </div>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-white">$0</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <p className="text-zinc-400 mb-6 sm:mb-8">Perfect for getting started and personal blogs.</p>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <FeatureItem text="Up to 10 blog posts" />
                <FeatureItem text="Basic analytics" />
                <FeatureItem text="500MB storage" />
                <FeatureItem text="1 team member" />
              </ul>
              <Link 
                href="/login"
                className="block w-full text-center rounded-[8px] border border-zinc-700 bg-transparent px-6 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-[16px] border border-[#6154f0]/30 bg-[#121319] p-6 sm:p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#6154f0] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-[#6154f0]" />
                <h3 className="text-xl font-bold text-white">Pro</h3>
              </div>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-white">$9.99</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <p className="text-zinc-400 mb-6 sm:mb-8">For growing teams and professional content creators.</p>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <FeatureItem text="Unlimited blog posts" />
                <FeatureItem text="Advanced analytics" />
                <FeatureItem text="10GB storage" />
                <FeatureItem text="Up to 10 team members" />
                <FeatureItem text="API access" />
                <FeatureItem text="Priority support" />
              </ul>
              <Link 
                href="/login"
                className="block w-full text-center rounded-[8px] bg-[#6154f0] px-6 py-3 text-sm font-semibold text-white hover:bg-[#584acf] transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#121319]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Content Workflow?
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of content creators and teams who trust ContentFlow to power their content strategy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="flex items-center gap-2 rounded-[8px] bg-[#6154f0] px-8 py-4 text-base font-semibold text-white hover:bg-[#584acf] transition-colors"
            >
              Start Creating Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a 
              href="mailto:support@contentflow.io"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#0b0c10]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6154f0]">
                  <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold text-white">ContentFlow</span>
              </div>
              <p className="text-zinc-400 text-sm max-w-sm">
                The modern CMS for technical teams. Built for developers, loved by content creators.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              © 2026 ContentFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  description: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/20 text-amber-400',
    pink: 'bg-pink-500/20 text-pink-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
  };

  return (
    <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 hover:border-white/10 transition-colors group">
      <div className={cn("w-12 h-12 rounded-[10px] flex items-center justify-center mb-4", colorClasses[color])}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6154f0]/20 text-[#6154f0] text-2xl font-bold mb-6">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
      <span className="text-zinc-300">{text}</span>
    </li>
  );
}
