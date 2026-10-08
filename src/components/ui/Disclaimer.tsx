import { Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Disclaimer({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <aside
      className={cn(
        "flex items-start gap-3 rounded-[14px] border border-dashed border-[var(--color-border-strong)] text-[var(--color-ink-faint)]",
        compact ? "px-3 py-2 text-[11px]" : "px-4 py-3 text-[12px]",
        className
      )}
    >
      <Info size={compact ? 13 : 15} className="mt-[1px] shrink-0" />
      <p className="leading-relaxed">
        <span className="font-medium text-[var(--color-ink-soft)]">Positioning, not a promise.</span> Educational, personalized
        guidance — not a guarantee of approval. Issuers make every credit decision, terms change, and scores vary by bureau and
        model. Always verify current terms with the issuer.
      </p>
    </aside>
  );
}

export function HardInquiryWarning({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-[14px] bg-[var(--color-warning-soft)] px-4 py-3.5 text-[12.5px] leading-relaxed text-[var(--color-warning)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-gold-vivid)_40%,transparent)]",
        className
      )}
    >
      <TriangleAlert size={16} className="mt-[1px] shrink-0" />
      <p>
        <span className="font-semibold">This may trigger a hard inquiry.</span> Continuing to the issuer&rsquo;s application can
        result in a hard credit pull. We never submit an application for you — you&rsquo;ll complete it directly with the issuer.
      </p>
    </div>
  );
}
