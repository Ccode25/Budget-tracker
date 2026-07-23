/**
 * NextAuth / Auth.js Configuration Setup
 * Includes Google OAuth provider and Neon PostgreSQL persistence safeguards.
 */

import { userRepository } from "../repositories/user.repository";

import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        // Requirement 1: Match verified email addresses only
        const isEmailVerified = profile?.email_verified ?? profile?.email_verified_at ?? true;
        if (isEmailVerified === false) {
          console.warn("[Auth Security] Rejected sign in for unverified email address:", user.email);
          return false;
        }

        // Verify or create user in Neon PostgreSQL database
        let existingUser = await userRepository.findByEmail(user.email);

        if (!existingUser) {
          existingUser = await userRepository.create({
            email: user.email,
            name: user.name || "Google User",
            avatarUrl: user.image || undefined,
            role: "user",
            emailVerified: true,
            googleId: account.providerAccountId,
          });
        } else if (!existingUser.googleId) {
          // Link Google ID to existing verified account by email match
          await userRepository.update(existingUser.id, {
            googleId: account.providerAccountId,
            emailVerified: true,
          });
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      if (token?.sub && session.user) {
        const dbUser = await userRepository.findByEmail(session.user.email);
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};
