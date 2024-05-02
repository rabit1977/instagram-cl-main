import type { Session, User } from "next-auth";
import type { JWT } from "@auth/core/jwt";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      username?: string | null;
    };
  }

  interface User {
    username?: string | null;
  }
}

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}