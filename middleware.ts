import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // no autenticado → login
  if (!session) {
    if (pathname === "/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ya autenticado no puede volver al login
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const rol = session.user.rol;

  // redirigir desde / según rol
  if (pathname === "/") {
    if (rol === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/panel", req.url));
  }

  // no admin intenta entrar a /admin → su panel
  if (pathname.startsWith("/admin") && rol !== "admin") {
    return NextResponse.redirect(new URL("/panel", req.url));
  }

  // admin intenta entrar a /panel → panel admin
  if (pathname.startsWith("/panel") && rol === "admin") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/login", "/admin/:path*", "/panel/:path*"],
};
