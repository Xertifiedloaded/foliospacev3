
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(process.env.AUTH_COOKIE_NAME || "token")?.value;

  const { pathname } = request.nextUrl;
  const authPages = ["/login", "/signup"];

  const isAuthPage = authPages.includes(pathname);

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup"],
};
