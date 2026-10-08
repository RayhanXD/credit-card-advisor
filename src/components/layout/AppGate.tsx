"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useCatalogReady } from "@/components/layout/useCatalogReady";

export function AppGate({ children }: { children: ReactNode }) {
  const isReady = useAppStore((s) => s.isReady);
  const userId = useAppStore((s) => s.userId);
  const profile = useAppStore((s) => s.profile);
  const catalogReady = useCatalogReady();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!userId) {
      router.replace("/login");
      return;
    }
    if (!profile || !profile.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [isReady, userId, profile, router]);

  if (!isReady || !catalogReady || !userId || !profile || !profile.onboardingComplete) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
