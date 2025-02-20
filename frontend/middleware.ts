import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", nextUrl));
}
