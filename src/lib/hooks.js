"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

export function useAuth() {
  const { data, isPending, refetch } = authClient.useSession();
  return { user: data?.user || null, isPending, refetch };
}

// SWR wrapper: useApi("/products/featured") or useApi("/orders/my", true) for JWT-protected routes
export function useApi(path, auth = false) {
  return useSWR(path ? [path, auth] : null, ([p, a]) => api(p, { auth: a }), { revalidateOnFocus: false });
}

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
