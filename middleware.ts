import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Always allow auth callback through
  if (pathname.startsWith('/auth/callback')) {
    return supabaseResponse;
  }

  // Protect all /admin/* routes
  if (pathname.startsWith('/admin')) {
    // Check user authenticated first
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Fetch profile to check role
    const supabase = createServiceRoleClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // If not admin, redirect to dashboard
    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Admin user - allow through
    return supabaseResponse;
  }

  // Protect all /dashboard/* routes — require authentication only (not admin)
  if (pathname.startsWith('/dashboard')) {
    // Check user authenticated first
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Any authenticated user can access dashboard
    return supabaseResponse;
  }

  // Also protect /settings, /billing (but NOT /posts - posts are public)
  if (
    (pathname.startsWith('/settings') ||
      pathname.startsWith('/billing')) &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user exists and tries to access /login, redirect based on role
  if (pathname === '/login' && user) {
    // Check if user is admin
    const supabase = createServiceRoleClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const url = request.nextUrl.clone();
    // Admin users go to dashboard, others go to home
    url.pathname = profile?.role === 'admin' ? '/dashboard' : '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
