"use client";

import { useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureCatalog } from "@/lib/catalog";
import { flushProfileSave, useAppStore } from "@/lib/store";

export function SessionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void ensureCatalog();
    const supabase = createClient();
    let cancelled = false;

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "TOKEN_REFRESHED") return;
      void useAppStore.getState().hydrateFromSession(session?.user.id ?? null);
    });

    function onUnload() {
      void flushProfileSave();
    }
    window.addEventListener("beforeunload", onUnload);

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
      window.removeEventListener("beforeunload", onUnload);
    };
  }, []);

  return <>{children}</>;
}
