import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      firstName?: string | null;
      isAdmin: boolean;
    };
  }

  interface User {
    firstName?: string | null;
    lastName?: string | null;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    firstName?: string | null;
    isAdmin?: boolean;
  }
}
