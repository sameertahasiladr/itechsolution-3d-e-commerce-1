import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth.api.getSession({ headers: await headers() });
    
    // Allow access to admin page without session - AdminLogin will handle it
    if (!session) {
      return NextResponse.next();
    }
    
    // If user is authenticated, verify admin role
    // This will be checked by the AdminPage component
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};