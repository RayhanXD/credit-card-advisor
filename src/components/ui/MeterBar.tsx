"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "accent" | "success" | "warning" | "danger" | "ink" | "teal";

const TONE_VAR: Record<Tone, string> = {
  accent: "var(--color-mint)",
  success: "var(--color-mint)",
  warning: "var(--color-gold-vivid)",
  danger: "var(--color-coral-vivid)",
  ink: "var(--color-ink)",
  teal: "var(--color-teal-vivid)",
};

export function statusToTone(status: "excellent" | "good" | "fair" | "poor"): Tone {
  if (status === "excellent") return "success";
  if (status === "good") return "teal";
  if (status === "fair") return "warning";
  return "danger";
}

// Segmented meter: discrete blocks read as "steps of progress" rather than a
// precise percentage, which matches how approximate these inputs are.
export function MeterBar({
  value,
  tone = "accent",
  segments = 20,
  className,
  ariaLabel,
}: {
  value: number;
  tone?: Tone;
  segments?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplay(Math.max(0, Math.min(100, value))));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const lit = Math.round((display / 100) * segments);

  return (
    <div
      className={cn("flex h-2 w-full gap-[2px]", className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          className="h-full flex-1 rounded-[2px] transition-colors duration-300"
          style={{
            background: i < lit ? TONE_VAR[tone] : "var(--color-bg-subtle)",
            transitionDelay: `${i * 18}ms`,
          }}
        />
      ))}
    </div>
  );
}
