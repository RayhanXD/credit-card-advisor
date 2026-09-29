import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Disclaimer({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-ink-soft)]",
        compact ? "px-3 py-2 text-[11px]" : "px-4 py-3 text-[12px]",
        className
      )}
    >
      <ShieldAlert size={compact ? 14 : 16} className="mt-0.5 shrink-0 text-[var(--color-ink-faint)]" />
      <p>
        Educational, personalized guidance — not a guarantee of approval. Credit decisions are made solely by issuers, terms can
        change, and scores vary by bureau and model. Always verify current terms with the issuer.
      </p>
    </div>
  );
}

export function HardInquiryWarning({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-start gap-2.5 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] px-4 py-3 text-[12px] text-[var(--color-warning)]", className)}>
      <ShieldAlert size={16} className="mt-0.5 shrink-0" />
      <p>
        Heads up: continuing to the issuer&rsquo;s application may result in a hard credit inquiry. This platform never submits
        an application on your behalf — you&rsquo;ll complete it directly with the issuer.
      </p>
    </div>
  );
}
