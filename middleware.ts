
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Allow the admin page to load.
  // AdminLogin and the admin API routes handle authentication.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
