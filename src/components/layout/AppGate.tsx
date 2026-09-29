"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

export function AppGate({ children }: { children: ReactNode }) {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const profile = useAppStore((s) => s.profile);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!profile || !profile.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [hasHydrated, profile, router]);

  if (!hasHydrated || !profile || !profile.onboardingComplete) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-[var(--color-ink)] text-[var(--color-bg)]">
            <Sparkles size={18} />
          </div>
          <p className="text-[13px] text-[var(--color-ink-faint)]">Loading your strategy…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
