import type { DefaultSession, DefaultUser } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username?: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    username?: string | null
  }
}