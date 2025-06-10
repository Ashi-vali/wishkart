import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient()

    // Refresh session if expired - required for Server Components
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If user is not signed in and the current path is not /auth/* or /, redirect to /auth/signin
    if (!session?.user) {
      const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
      const isHomePage = request.nextUrl.pathname === "/"
      const isRegistryPage = request.nextUrl.pathname.startsWith("/registry/")

      if (!isAuthPage && !isHomePage && !isRegistryPage) {
        const redirectUrl = new URL("/auth/signin", request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // If user is signed in and the current path is /auth/*, redirect to /dashboard
    if (session?.user) {
      const isAuthPage = request.nextUrl.pathname.startsWith("/auth")

      if (isAuthPage) {
        const redirectUrl = new URL("/dashboard", request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }

    return NextResponse.next()
  } catch (e) {
    // If there's an error, allow the request to continue
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files (like robots.txt, manifest.json, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-|robots.txt).*)",
  ],
}
