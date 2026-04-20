import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  cookies: {
    sessionToken: {
      name: "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuario" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username as string,
            deletedAt: null,
            status: true,
          },
          include: { rol: true },
        });

        if (!user) return null;

        const passwordOk = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!passwordOk) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          username: user.username,
          rol: user.rol.rol,
          rolId: user.rolId,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.username = user.username ?? "";
        token.rol = user.rol ?? "";
        token.rolId = user.rolId ?? 0;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.rol = token.rol as string;
      session.user.rolId = token.rolId as number;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
