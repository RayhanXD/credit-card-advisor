"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "accent" | "success" | "warning" | "danger" | "ink";

const toneClasses: Record<Tone, string> = {
  accent: "bg-[var(--color-accent)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]",
  ink: "bg-[var(--color-ink)]",
};

export function statusToTone(status: "excellent" | "good" | "fair" | "poor"): Tone {
  if (status === "excellent") return "success";
  if (status === "good") return "accent";
  if (status === "fair") return "warning";
  return "danger";
}

export function MeterBar({
  value,
  tone = "accent",
  className,
  ariaLabel,
}: {
  value: number;
  tone?: Tone;
  className?: string;
  ariaLabel?: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplay(Math.max(0, Math.min(100, value))));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-subtle)]", className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", toneClasses[tone])}
        style={{ width: `${display}%` }}
      />
    </div>
  );
}
