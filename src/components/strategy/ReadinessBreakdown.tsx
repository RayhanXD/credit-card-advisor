import type { ReadinessAssessment } from "@/lib/types";
import { getCard } from "@/data/cards";
import { CircularScore } from "@/components/ui/CircularScore";
import { Badge } from "@/components/ui/Badge";

const STATUS_TONE = { strong: "success", moderate: "accent", developing: "warning", weak: "danger" } as const;
const STATUS_LABEL = { strong: "Strong", moderate: "Moderate", developing: "Developing", weak: "Needs work" };

export function ReadinessBreakdown({ readiness }: { readiness: ReadinessAssessment }) {
  const card = getCard(readiness.cardId);
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
      <div className="flex flex-col items-center gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">{card?.name} Readiness</p>
          <p className="mt-1 max-w-md text-[13.5px] text-[var(--color-ink-soft)]">{readiness.summary}</p>
        </div>
        <CircularScore value={readiness.overallPercent} size={104} tone={readiness.overallPercent >= 72 ? "success" : "accent"} />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {readiness.components.map((c) => (
          <div key={c.label} className="rounded-xl bg-[var(--color-bg-subtle)] p-3.5">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[13px] font-medium capitalize text-[var(--color-ink)]">{c.label}</span>
              <Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge>
            </div>
            <p className="text-[12.5px] text-[var(--color-ink-soft)]">{c.explanation}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-[var(--color-ink-faint)]">
        This reflects positioning based on your profile — not an approval prediction. The issuer makes the final decision.
      </p>
    </div>
  );
}
