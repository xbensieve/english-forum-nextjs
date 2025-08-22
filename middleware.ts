import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

/**
 * withAuth will decode the token/session for you and attach to request.nextauth
 * This requires next-auth middleware integration. If you use a version where
 * withAuth is unavailable, implement your own JWT decode using the same secret.
 */

export default withAuth(
  async function middleware(req: NextRequest) {
    // This function runs after session verification
    // req.nextauth contains token info if present (depends on next-auth version)
    // You can implement role checks here or in route handlers
    return;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Default allow if token exists
        if (!token) return false;
        // Example: allow if route contains /admin only for admins
        const pathname = new URL(req.url).pathname;
        if (pathname.startsWith("/admin")) {
          return token.role === "admin";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"], // Apply middleware to these routes
};
