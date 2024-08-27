import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string | null;
      location?: string | null; // Add location to the user object in the session
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username?: string | null;
    location?: string | null; // Add location to the user object
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string | null;
    location?: string | null; // Add location to the JWT
  }
}