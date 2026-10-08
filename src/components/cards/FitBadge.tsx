import type { FitLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

// Fit is shown as a signal-strength meter: four bars, lit by how strongly the
// engine's fit label supports applying now. It never implies approval odds.
const FIT_CONFIG: Record<FitLabel, { label: string; bars: number; color: string; text: string; bg: string }> = {
  strong_fit: {
    label: "Strong fit",
    bars: 4,
    color: "var(--color-mint)",
    text: "text-[var(--color-accent)]",
    bg: "bg-[var(--color-accent-soft)]",
  },
  consider: {
    label: "Consider",
    bars: 3,
    color: "var(--color-teal-vivid)",
    text: "text-[var(--color-teal)]",
    bg: "bg-[var(--color-teal-soft)]",
  },
  wait: {
    label: "Wait",
    bars: 2,
    color: "var(--color-gold-vivid)",
    text: "text-[var(--color-gold)]",
    bg: "bg-[var(--color-gold-soft)]",
  },
  not_recommended_now: {
    label: "Not right now",
    bars: 1,
    color: "var(--color-coral-vivid)",
    text: "text-[var(--color-coral)]",
    bg: "bg-[var(--color-coral-soft)]",
  },
};

export function FitSignalBars({ fitLabel, className }: { fitLabel: FitLabel; className?: string }) {
  const config = FIT_CONFIG[fitLabel];
  return (
    <span className={cn("inline-flex items-end gap-[2px]", className)} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-[1px]"
          style={{
            height: 5 + i * 2.5,
            background: i < config.bars ? config.color : "var(--color-border-strong)",
          }}
        />
      ))}
    </span>
  );
}

export function FitBadge({ fitLabel, className }: { fitLabel: FitLabel; className?: string }) {
  const config = FIT_CONFIG[fitLabel];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-[8px] py-1 pl-2 pr-2.5 text-[12px] font-semibold",
        config.bg,
        config.text,
        className
      )}
    >
      <FitSignalBars fitLabel={fitLabel} />
      {config.label}
    </span>
  );
}
