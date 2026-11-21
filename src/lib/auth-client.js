import { createAuthClient } from "better-auth/react";

// Requests go to /api/auth/* on the same origin, which Next.js proxies to Express.
export const authClient = createAuthClient({ baseURL: process.env.NEXT_PUBLIC_APP_URL });
