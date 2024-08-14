

// import { auth } from "@/auth"
// import { NextResponse } from "next/server"

// export default auth((req) => {
//   const isLoggedIn = !!req.auth
//   const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
//   if (isOnDashboard) {
//     if (isLoggedIn) return NextResponse.next()
//     return NextResponse.redirect(new URL("/login", req.nextUrl.origin))
//   }
//   return NextResponse.next()
// })

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }

import authConfig from "./auth.config"
import NextAuth from "next-auth"

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}