
"use client";

import { createAuthClient } from "better-auth/react";
import { useCallback, useEffect, useState } from "react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL,

  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token");

      if (authToken) {
        // Store the complete token without truncating it.
        localStorage.setItem("bearer_token", authToken);
      }
    },
  },
});

type SessionData = ReturnType<typeof authClient.useSession>;

export function useSession(): SessionData {
  const [session, setSession] = useState<any>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSession = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("bearer_token") || ""
          : "";

      const res = await authClient.getSession({
        fetchOptions: {
          auth: {
            type: "Bearer",
            token,
          },
        },
      });

      setSession(res.data);
      setError(null);
    } catch (err) {
      setSession(null);
      setError(err);
    } finally {
      setIsPending(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsPending(true);
    setError(null);
    await fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  return {
    data: session,
    isPending,
    error,
    refetch,
  } as SessionData;
}
