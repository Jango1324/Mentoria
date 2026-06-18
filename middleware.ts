// Runs on every request before the page renders.
// Responsibilities: refresh the Supabase session cookie, enforce auth redirects,
// and redirect unonboarded users to /onboarding.
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_ROUTES = ['/dashboard', '/onboarding', '/admin', '/opportunities', '/courses']
const AUTH_ROUTES = ['/login']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  // No session — redirect to login
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Has session — redirect away from login
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Has session on a protected route — check onboarding status
  // Excludes /onboarding (infinite loop) and /admin (admins may not onboard as students)
  const requiresOnboarding =
    !!user &&
    isProtected &&
    !pathname.startsWith('/onboarding') &&
    !pathname.startsWith('/admin')

  if (requiresOnboarding) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarded')
      .eq('id', user.id)
      .single<{ onboarded: boolean }>()

    if (profile && !profile.onboarded) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
