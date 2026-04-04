// src/middleware.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: "authjs.session-token",
  });

  // no autenticado → login
  if (!token) {
    if (pathname === "/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ya autenticado no puede volver al login
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const rol = token.rol as string;

  // redirigir desde / según rol
  if (pathname === "/") {
    if (rol === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/panel", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/panel/:path*", "/panel/:path*"],
};
