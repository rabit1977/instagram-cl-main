// Import the Google provider from NextAuth
import GoogleProvider from "next-auth/providers/google"
// Import the NextAuthConfig type for type checking
import type { NextAuthConfig } from "next-auth"

// Export the default configuration object that satisfies NextAuthConfig
export default {
  // Define the authentication providers
  providers: [
    // Configure the Google provider
    GoogleProvider({
      // Use environment variables for client ID and secret
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // Customize the pages used for authentication
  pages: {
    // Set the custom sign-in page route
    signIn: "/login",
  },
  // Define callback functions for authentication logic
  callbacks: {
    // The authorized callback is used to control access to pages
    authorized({ auth, request: { nextUrl } }) {
      // Check if the user is logged in
      const isLoggedIn = !!auth?.user
      // Check if the requested URL is for the dashboard
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      // If trying to access the dashboard
      if (isOnDashboard) {
        // Allow access if logged in, otherwise deny
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      // Allow access to all other pages
      return true
    },
  },
} satisfies NextAuthConfig