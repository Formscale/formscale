import { NextRequest, NextResponse } from "next/server";
import { Auth } from "./lib/auth";

const routes = {
  public: ["/", "/login", "/signup", "/resend", "/verify"],
  unprotected: ["/docs", "/templates"],
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|assets|favicon.ico|sitemap.xml|robots.txt).*)"],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");

  if (token?.value && !Auth.validateToken(request)) {
    request.cookies.delete("token");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (routes.public.includes(pathname) || routes.unprotected.includes(pathname)) {
    if (token && routes.public.includes(pathname) && pathname !== "/") {
      return NextResponse.redirect(new URL("/forms", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
