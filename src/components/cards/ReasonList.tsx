import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Reasons and cautions as a two-sided ledger: "+" for what supports the fit,
// "–" for what weighs against it. Every recommendation carries both.
export function ReasonList({
  reasons,
  cautions = [],
  className,
  dense,
}: {
  reasons: string[];
  cautions?: string[];
  className?: string;
  dense?: boolean;
}) {
  if (reasons.length === 0 && cautions.length === 0) return null;
  return (
    <ul className={cn(dense ? "space-y-1.5" : "space-y-2", className)}>
      {reasons.map((r) => (
        <li key={r} className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--color-ink-soft)]">
          <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <Plus size={10} strokeWidth={3} />
          </span>
          {r}
        </li>
      ))}
      {cautions.map((c) => (
        <li key={c} className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--color-ink-soft)]">
          <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-[var(--color-gold-soft)] text-[var(--color-gold)]">
            <Minus size={10} strokeWidth={3} />
          </span>
          {c}
        </li>
      ))}
    </ul>
  );
}
