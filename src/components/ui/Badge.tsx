import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "teal" | "indigo" | "ink";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-[var(--color-bg-subtle)] text-[var(--color-ink-soft)] ring-[var(--color-border)]",
  accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-[color-mix(in_srgb,var(--color-mint)_30%,transparent)]",
  success: "bg-[var(--color-success-soft)] text-[var(--color-success)] ring-[color-mix(in_srgb,var(--color-mint)_30%,transparent)]",
  warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)] ring-[color-mix(in_srgb,var(--color-gold-vivid)_40%,transparent)]",
  danger: "bg-[var(--color-danger-soft)] text-[var(--color-danger)] ring-[color-mix(in_srgb,var(--color-coral-vivid)_35%,transparent)]",
  teal: "bg-[var(--color-teal-soft)] text-[var(--color-teal)] ring-[color-mix(in_srgb,var(--color-teal-vivid)_35%,transparent)]",
  indigo: "bg-[var(--color-indigo-soft)] text-[var(--color-indigo)] ring-[color-mix(in_srgb,var(--color-indigo-vivid)_30%,transparent)]",
  ink: "bg-[var(--color-ink)] text-[var(--color-bg-elevated)] ring-transparent",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

// Square-cornered tag rather than a pill, so status reads as data, not decoration.
export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-[6px] px-2 py-[3px] text-[11.5px] font-medium ring-1 ring-inset",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
