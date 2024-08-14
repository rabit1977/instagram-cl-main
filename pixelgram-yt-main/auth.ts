// Import necessary dependencies
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"

// Export Auth.js handlers, auth function, signIn, and signOut
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use PrismaAdapter for database integration
  adapter: PrismaAdapter(prisma),
  // Set session strategy to JWT
  session: { strategy: "jwt" },
  // Spread the configuration from auth.config.ts
  ...authConfig,
  // Define callbacks for session and JWT handling
  callbacks: {
    // Spread callbacks from auth.config.ts
    ...authConfig.callbacks,
    // Session callback to customize session object
    session: async ({ session, token }) => {
      if (token && session.user) {
        // Add user details to the session
        session.user.id = token.sub ?? token.id as string
        session.user.name = token.name
        session.user.email = token.email ?? ""
        session.user.image = token.picture
        session.user.username = token.username as string | undefined
      }
      return session
    },
    // JWT callback to customize JWT token
    jwt: async ({ token, user }) => {
      if (user) {
        // Add user id to token
        token.id = user.id
      }
      
      // Find user in database
      const prismaUser = await prisma.user.findFirst({
        where: {
          email: token.email ?? "",
        },
      })
    
      if (!prismaUser) {
        return token
      }
    
      // If user doesn't have a username, create one
      if (!prismaUser.username) {
        await prisma.user.update({
          where: {
            id: prismaUser.id,
          },
          data: {
            username: prismaUser.name?.split(" ").join("").toLowerCase() ?? null,
          },
        })
      }
    
      // Return token with additional user information
      return {
        ...token,
        id: prismaUser.id,
        username: prismaUser.username ?? null,
      }
    },
  },
})