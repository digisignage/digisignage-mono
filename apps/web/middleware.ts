import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define public and admin routes using Clerk's route matcher helper.
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/contact',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/public(.*)'
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// Advanced middleware: run Clerk's middleware and optionally protect or
// perform role checks for admin routes. Uses the documented clerkMiddleware
// signature: clerkMiddleware(async (auth, request) => { ... })
export default clerkMiddleware(async (auth, request) => {
  // Protect admin routes with role-based logic
  if (isAdminRoute(request)) {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect_url', request.url)
      return NextResponse.redirect(signInUrl)
    }

    // Example: require role 'admin' in session claims metadata. Use optional
    // checks because the Clerk SDK may have a loose type for sessionClaims.
  // Guard with `unknown` then narrow to avoid `any` lint complaints.
    const sc = sessionClaims as unknown
    // Narrow to an object with an optional metadata property
    const role =
      sc && typeof sc === 'object' && 'metadata' in sc
        ? // Narrow to a minimal typed metadata shape
          (sc as { metadata?: Record<string, string> }).metadata?.role
        : undefined
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // Protect all non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next internals and static assets
  '/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}
