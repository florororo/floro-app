import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client for React
 * 
 * Available methods:
 * - authClient.signIn.email() - Sign in with email/password
 * - authClient.signUp.email() - Sign up with email/password/name
 * - authClient.signOut() - Sign out current user
 * - authClient.useSession() - React hook to access session data
 * 
 * baseURL is optional when auth API is on the same domain (/api/auth)
 */
export const authClient = createAuthClient();

export type Session = typeof authClient.$Infer.Session;
