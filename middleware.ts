import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const defaultLanguage = 'en'
const languages = ['en', 'hi']

function getLanguageFromHeader(request: NextRequest): string | null {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return null
  
  const preferredLanguages = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().substring(0, 2))
  
  for (const lang of preferredLanguages) {
    if (languages.includes(lang)) {
      return lang
    }
  }
  return null
}

function getLanguageFromCookie(request: NextRequest): string | null {
  const langCookie = request.cookies.get('preferred-language')
  if (langCookie && languages.includes(langCookie.value)) {
    return langCookie.value
  }
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static paths and API routes
  const isStaticPath = pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/__') ||
    pathname.includes('.') // Skip files with extensions

  if (isStaticPath) {
    return NextResponse.next()
  }

  // Check if this is a localized path (e.g., /en, /hi, /en/posts)
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]
  const isLocalizedPath = languages.includes(firstSegment)

  // For localized paths, set language cookie and continue
  if (isLocalizedPath) {
    const response = NextResponse.next()
    response.cookies.set('preferred-language', firstSegment, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
    return response
  }

  // Handle authentication routes
  const { supabaseResponse, user } = await updateSession(request);

  if (pathname.startsWith('/auth/callback')) {
    return supabaseResponse;
  }

  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    const supabase = createServiceRoleClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (
    (pathname.startsWith('/settings') || pathname.startsWith('/billing')) &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (pathname === '/login' && user) {
    const supabase = createServiceRoleClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const url = request.nextUrl.clone();
    url.pathname = profile?.role === 'admin' ? '/dashboard' : '/';
    return NextResponse.redirect(url);
  }

  // Redirect /posts to localized version
  if (pathname === '/posts') {
    const preferredLanguage = getLanguageFromCookie(request) || 
      getLanguageFromHeader(request) || 
      defaultLanguage
    
    const url = request.nextUrl.clone()
    url.pathname = `/${preferredLanguage}/posts`
    return NextResponse.redirect(url)
  }

  // For root path, let app/page.tsx handle the redirect
  // This avoids redirect loops
  if (pathname === '/' || pathname === '') {
    return supabaseResponse
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};