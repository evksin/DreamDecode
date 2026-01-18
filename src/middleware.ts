import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const sessionCookieNames = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
];

export default function middleware(request: NextRequest) {
  const hasSessionCookie = sessionCookieNames.some((name) =>
    request.cookies.get(name)
  );
  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  // Защищаем приватные страницы
  matcher: ["/dashboard/:path*", "/my-prompts/:path*"],
};
