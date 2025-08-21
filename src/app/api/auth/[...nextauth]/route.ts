import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

/**
 * NextAuth configuration
 * - Google OAuth provider
 * - JWT sessions with MongoDB persistence for user info
 * - Auto-create user if not existing
 * - Embed role & user details in JWT + session
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt", // Use JWT instead of database sessions
    maxAge: 60 * 60 * 24 * 7, // Session valid for 7 days
  },

  // JWT configuration
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // Token expiry (should match session maxAge)
  },

  callbacks: {
    /**
     * Called every time a JWT is created or updated.
     * We use this to:
     *  - Ensure user exists in DB
     *  - Sync role and profile info into JWT
     */
    async jwt({ token, user }) {
      await dbConnect();

      // Only run DB logic on first sign-in, when "user" is defined
      if (user?.email) {
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Create new user if not found
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            avatar: user.image,
            role: "user", // default role
          });
        }

        // Embed relevant user info into token
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.picture = dbUser.avatar;
      }

      return token;
    },

    /**
     * Controls what gets returned via `useSession` and `getServerSession`.
     * We attach our custom fields from JWT to session.user.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },

  // Used to sign and encrypt JWTs
  secret: process.env.NEXTAUTH_SECRET,
};

// Export NextAuth route handlers (for App Router)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
