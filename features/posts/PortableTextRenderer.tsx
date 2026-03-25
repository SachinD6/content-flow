'use client';

import Image from 'next/image';
import { PortableText, type PortableTextReactComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/client';
import { cn } from '@/lib/utils';
import type { PortableTextBlock } from '@portabletext/types';

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

const components: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string } }) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="relative my-10 h-[400px] w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
          <Image
            src={urlFor(value.asset).url()}
            alt={value.alt || 'Content Image'}
            fill
            className="object-cover"
          />
        </div>
      );
    },
    code: ({ value }: { value: { code: string; language?: string } }) => (
      <div className="my-6 overflow-hidden rounded-[8px] border border-white/5 bg-[#121319]">
        <div className="flex px-4 py-2 bg-white/5 border-b border-white/5 text-[10px] font-bold tracking-widest uppercase text-zinc-500">
          {value.language || 'text'}
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className="font-mono text-[13px] leading-relaxed text-zinc-300">
            {value.code}
          </code>
        </pre>
      </div>
    ),
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href: string } }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="font-medium text-[#6154f0] hover:text-[#766bf3] underline underline-offset-4 decoration-[#6154f0]/30 hover:decoration-[#6154f0] transition-colors"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-bold text-white tracking-wide">{children}</strong>,
    em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
  },
  block: {
    h1: ({ children }) => <h1 className="mt-12 mb-6 text-3xl font-bold tracking-tight text-white">{children}</h1>,
    h2: ({ children }) => <h2 className="mt-10 mb-5 text-2xl font-bold tracking-tight text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-4 text-xl font-bold tracking-tight text-white">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-6 mb-4 text-lg font-bold tracking-tight text-white">{children}</h4>,
    normal: ({ children }) => <p className="mb-6 text-[15px] leading-relaxed text-zinc-400">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 italic border-l-4 border-[#6154f0]/50 bg-white/5 py-4 px-6 text-zinc-300 rounded-r-[8px]">
        {children}
      </blockquote>
    ),
  },
};

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <div className="prose prose-invert max-w-none w-full animate-in fade-in duration-700 font-sans">
      <PortableText value={value} components={components} />
    </div>
  );
}
