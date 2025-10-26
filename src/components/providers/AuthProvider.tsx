"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasHydrated = useRef(false);

  useEffect(() => {
    // Hydrate store only once on client side
    if (!hasHydrated.current) {
      useAuthStore.persist.rehydrate();
      hasHydrated.current = true;
    }
  }, []);

  return <>{children}</>;
}
