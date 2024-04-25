import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req) {
    const cookie = req.cookies.get("next-auth.session-token");
    const isAuth = !!cookie?.value;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/login", "/register"],
};
