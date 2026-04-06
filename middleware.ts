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

  const isStaticPath = pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/__')

  if (isStaticPath) {
    return NextResponse.next()
  }

  const langSegment = pathname.split('/')[1]
  const isLocalizedPath = languages.includes(langSegment)

  if (isLocalizedPath) {
    const response = NextResponse.next()
    response.cookies.set('preferred-language', langSegment, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
    return response
  }

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

  // Redirect root path and /posts to localized version based on preferred language
  if (pathname === '/' || pathname === '' || pathname === '/posts') {
    const preferredLanguage = getLanguageFromCookie(request) || 
      getLanguageFromHeader(request) || 
      defaultLanguage
    
    const url = request.nextUrl.clone()
    if (pathname === '/posts') {
      url.pathname = `/${preferredLanguage}/posts`
    } else {
      url.pathname = preferredLanguage === defaultLanguage ? '/' : `/${preferredLanguage}`
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};