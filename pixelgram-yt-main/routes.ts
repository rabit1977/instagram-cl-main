// An array of routes that are accessible to the public
// These routes do not require authentication
export const publicRoutes = [
  "/", // Root route
  "/auth/new-verification" // Route for new verification
];

// An array of routes that are used for authentication
// These routes will redirect logged-in users to /settings
export const authRoutes = [
  "/auth/login", // Login route
  "/auth/register", // Register route
  "/auth/error", // Error route
  "/auth/reset", // Reset password route
  "/auth/new-password" // Route for setting a new password
];

// The prefix for API authentication routes
// Routes that start with this prefix are used for API authentication purposes
export const apiAuthPrefix = "/api/auth";

// The default redirect path after logging in
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"; // Redirect to the dashboard after logging in
