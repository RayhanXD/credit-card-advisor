"use client";

import { LogoMark } from "@/components/brand/Logo";

export function LoadingScreen({ message = "Loading your strategy…" }: { message?: string }) {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-[var(--color-canvas)]" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <span className="animate-pulse-ring absolute inset-0 rounded-[12px] bg-[var(--color-mint)] opacity-40" />
          <LogoMark size={44} className="relative" />
        </div>
        <div className="h-[3px] w-28 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
          <div className="h-full w-1/3 animate-[loading-slide_1.1s_ease-in-out_infinite] rounded-full bg-[var(--color-mint)]" />
        </div>
        <p className="text-[13px] text-[var(--color-ink-faint)]">{message}</p>
      </div>
    </div>
  );
}
