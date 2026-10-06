"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getUserRole } from "@/lib/actions/user";

export function useUserRole() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRole() {
      if (!session?.user?.id) {
        if (isMounted) {
          setRole(null);
          setLoading(false);
        }
        return;
      }

      // Check session object first
      const sessionRole = (session.user as { role?: string })?.role;
      if (sessionRole) {
        if (isMounted) {
          setRole(sessionRole);
        }
      }

      // Always fetch live role from DB for 100% accuracy
      try {
        const liveRole = await getUserRole(session.user.id);
        if (isMounted) {
          setRole(liveRole);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setRole(sessionRole || "user");
          setLoading(false);
        }
      }
    }

    if (!sessionPending) {
      fetchRole();
    }
  }, [session, sessionPending]);

  const sessionRole = (session?.user as { role?: string })?.role;
  const effectiveRole = role || sessionRole || "user";
  const isLoggedIn = !sessionPending && !!session?.user;
  const isAdmin = isLoggedIn && (effectiveRole === "admin" || sessionRole === "admin");

  return {
    session,
    userId: session?.user?.id,
    isLoggedIn,
    isAdmin,
    role: effectiveRole,
    isPending: sessionPending && loading,
  };
}
