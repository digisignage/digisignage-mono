import { clerkMiddleware } from "@clerk/nextjs/server"

// Use Clerk's documented middleware export. `clerkMiddleware` is the
// middleware factory provided by @clerk/nextjs for route protection.
export default clerkMiddleware()

// Matcher to run the middleware on all routes except Next internals and
// static assets (recommended pattern from Clerk docs).
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
