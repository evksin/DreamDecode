import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export default auth((request: NextRequest) => {
  const isAuthed = Boolean(request.auth);
  if (!isAuthed) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  // Защищаем приватные страницы
  matcher: ["/dashboard/:path*", "/my-prompts/:path*"],
};
