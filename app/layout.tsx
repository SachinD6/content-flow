import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import './globals.css';
import { PostHogProvider } from '@/app/providers/posthog-provider';
import { QueryProvider } from '@/app/providers/query-provider';
import { Toaster } from 'sonner';
import { SanityLive } from '@/lib/sanity/live';
import { VisualEditing } from 'next-sanity/visual-editing';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ContentFlow',
  description: 'CMS-driven SaaS Dashboard',
};

import { cn } from '@/lib/utils';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={cn('h-full antialiased', inter.variable)}>
      <body className="min-h-full flex flex-col font-sans">
        <PostHogProvider>
          <QueryProvider>{children}</QueryProvider>
        </PostHogProvider>
        <Toaster />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
