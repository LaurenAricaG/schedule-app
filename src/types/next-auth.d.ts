import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    username: string;
    rol: string;
    rolId: number;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      rol: string;
      rolId: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    rol: string;
    rolId: number;
  }
}
