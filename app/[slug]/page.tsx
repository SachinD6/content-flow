import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { sanityClient, previewSanityClient } from '@/lib/sanity/client';
import { getPageBySlug, getSiteSettings } from '@/lib/sanity/content';
import { createClient } from '@/lib/supabase/server';
import { Header, Footer } from '@/features/layout';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.seo?.metaTitle || page.title || 'ContentFlow',
    description: page.seo?.metaDescription || page.description || undefined,
  };
}

export default async function GenericPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? previewSanityClient : sanityClient;
  
  // Fetch page and settings in parallel
  const [page, settings] = await Promise.all([
    getPageBySlug(slug),
    getSiteSettings(),
  ]);

  if (!page) {
    notFound();
  }

  // Get current user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile if logged in
  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, display_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (profile) {
      userProfile = {
        id: profile.id,
        email: profile.email,
        displayName: profile.display_name || undefined,
        avatarUrl: profile.avatar_url || undefined,
      };
    }
  }

  return (
    <div className='min-h-screen bg-[#0b0c10]'>
      <Header
        siteName={settings?.siteName}
        headerNav={settings?.headerNav ?? undefined}
        guestNav={settings?.guestNav ?? undefined}
        authNav={settings?.authNav ?? undefined}
        user={userProfile}
      />

      {isDraftMode && (
        <div className='bg-amber-500/10 border-b border-amber-500/20'>
          <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-amber-400'>⚠️</span>
                <span className='text-amber-200 text-sm font-medium'>Preview Mode — Draft content visible</span>
              </div>
              <a
                href='/api/draft/disable'
                className='text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors'
              >
                Exit Preview →
              </a>
            </div>
          </div>
        </div>
      )}

      <main className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Back Link */}
        <div className='mb-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Home
          </Link>
        </div>

        {/* Page Title */}
        <h1 className='text-3xl sm:text-4xl font-bold text-white mb-8'>
          {page.title}
        </h1>

        {/* Description */}
        {page.description && (
          <p className='text-lg text-zinc-400 mb-8'>
            {page.description}
          </p>
        )}

        {/* CTA Buttons */}
        {page.ctaButtons && page.ctaButtons.length > 0 && (
          <div className='flex flex-wrap gap-3 mb-8'>
            {page.ctaButtons.map((button, index) => (
              <Link
                key={`${button.href}-${index}`}
                href={button.href}
                className={`inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  button.variant === 'primary'
                    ? 'bg-[#6154f0] text-white hover:bg-[#5841e8]'
                    : button.variant === 'secondary'
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {button.label}
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        {page.content && page.content.length > 0 && (
          <div className='prose prose-invert prose-zinc max-w-none'>
            <PortableText value={page.content as PortableTextBlock[]} />
          </div>
        )}

        {/* Newsletter Section */}
        {page.newsletterSection?.enabled && (
          <div className='mt-12 pt-8 border-t border-white/10'>
            <h3 className='text-xl font-bold text-white mb-3'>
              {page.newsletterSection.heading || 'Stay in the loop'}
            </h3>
            <p className='text-zinc-400 text-sm mb-4'>
              {page.newsletterSection.description || 'Get the latest articles and updates delivered to your inbox.'}
            </p>
            <div className='flex gap-3'>
              <input
                type='email'
                placeholder={page.newsletterSection.placeholder || 'Enter your email'}
                className='flex-1 px-4 py-2.5 bg-[#121319] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#6154f0]/50'
              />
              <button className='px-5 py-2.5 bg-white text-[#0b0c10] text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors'>
                {page.newsletterSection.buttonText || 'Subscribe'}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer
        siteName={settings?.siteName}
        footerDescription={settings?.footerDescription}
        copyrightText={settings?.copyrightText}
        legalLinks={settings?.legalLinks}
        footerNav={settings?.footerNav ?? undefined}
        user={userProfile}
      />
    </div>
  );
}