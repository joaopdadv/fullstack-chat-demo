/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { NextResponse, type NextRequest } from "next/server";
import { type Session } from "./types/session";

const publicRoutes = [
  "/login",
  "/cadastro",
  "/"
];

const staticFileRoutes = [
  "/_next",
  "/static",
  "/assets",
  "/favicon.ico",
  "/robots.txt"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a static file
  if (staticFileRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for user session cookie
  const userCookie = request.cookies.get("pdi_chat_user");

  // If on a public route and user has a valid session, redirect to "/conversas"
  if (publicRoutes.includes(pathname)) {
    if (userCookie) {
      const currentUser = JSON.parse(userCookie.value as string) as Session;
      if (currentUser.expirationDate > Date.now()) {
        return NextResponse.redirect(new URL("/conversas", request.url));
      }
    }
    return NextResponse.next();
  }

  // If no user session cookie, redirect to "/login"
  if (!userCookie) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  const currentUser = JSON.parse(userCookie.value as string) as Session;

  // Check if the session is expired
  if (currentUser.expirationDate < Date.now()) {
    // Delete the cookie and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("pdi_chat_user");
    return response;
  }

  return NextResponse.next();
}