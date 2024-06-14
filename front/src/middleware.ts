/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { NextResponse, type NextRequest } from "next/server";

interface Session {
  token: string;
  expirationDate: number;
  profile: {
    id: string;
    name: string;
    email: string;
    role: number;
  };
}

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

  // Check if the request is for a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for user session cookie
  const userCookie = request.cookies.get("pdi_chat_user");

  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const currentUser = JSON.parse(userCookie.value as string) as Session;

  // Check if the session is expired
  if (currentUser.expirationDate < Date.now()) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}