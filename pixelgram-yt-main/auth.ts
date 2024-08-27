// Import necessary dependencies
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";

// Export Auth.js handlers, auth function, signIn, and signOut
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.sub ?? token.id as string;
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.image = token.picture;
        session.user.username = token.username as string | undefined;
        session.user.location = token.location; // Access location safely
      }
      return session;
    },
 // JWT callback to customize JWT token
jwt: async ({ token, user }) => {
  if (user) {
    token.id = user.id;
  }
  
  const prismaUser = await prisma.user.findFirst({
    where: {
      email: token.email ?? "",
    },
    select: {
      id: true,
      username: true,
      name: true,
      location: true, // Ensure location is fetched
    },
  });

  if (!prismaUser) {
    return token;
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
    });
  }

  // Include location in the token
  token.location = prismaUser.location ?? null; // Add user's location to token

  return {
    ...token,
    id: prismaUser.id,
    username: prismaUser.username ?? null,
    location: prismaUser.location, // Include location in the returned token
  };
},
  },
});