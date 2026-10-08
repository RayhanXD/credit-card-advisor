import type { ReadinessAssessment, ReadinessStatus } from "@/lib/types";
import { getCard } from "@/data/cards";
import { CircularScore } from "@/components/ui/CircularScore";
import { Kicker } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

const READY_THRESHOLD = 72;

const STATUS: Record<ReadinessStatus, { label: string; steps: number; color: string; text: string }> = {
  strong: { label: "Strong", steps: 4, color: "var(--color-mint)", text: "text-[var(--color-accent)]" },
  moderate: { label: "Moderate", steps: 3, color: "var(--color-teal-vivid)", text: "text-[var(--color-teal)]" },
  developing: { label: "Developing", steps: 2, color: "var(--color-gold-vivid)", text: "text-[var(--color-gold)]" },
  weak: { label: "Needs work", steps: 1, color: "var(--color-coral-vivid)", text: "text-[var(--color-coral)]" },
};

export function StatusSteps({ status }: { status: ReadinessStatus }) {
  const s = STATUS[status];
  return (
    <span className="flex gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-1.5 w-4 rounded-[2px]" style={{ background: i < s.steps ? s.color : "var(--color-bg-subtle)" }} />
      ))}
    </span>
  );
}

export function ReadinessBreakdown({ readiness }: { readiness: ReadinessAssessment }) {
  const card = getCard(readiness.cardId);
  const ready = readiness.overallPercent >= READY_THRESHOLD;
  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
      <div className="bg-grid relative grid gap-6 border-b border-[var(--color-border)] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--color-bg-elevated)_45%,transparent)]" />
        <div className="relative space-y-2">
          <Kicker tone={ready ? "mint" : "gold"}>Readiness · {card?.name}</Kicker>
          <p className="font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-ink)]">
            {ready ? "You're well-positioned." : "Not yet, and here's why."}
          </p>
          <p className="max-w-lg text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{readiness.summary}</p>
        </div>
        <div className="relative flex flex-col items-center">
          <CircularScore
            value={readiness.overallPercent}
            size={148}
            tone={ready ? "success" : "warning"}
            threshold={READY_THRESHOLD}
            label={`${readiness.overallPercent}%`}
            sublabel="readiness"
          />
          <span className="-mt-3 text-[10.5px] text-[var(--color-ink-faint)]">
            Notch = {READY_THRESHOLD}% well-positioned line
          </span>
        </div>
      </div>
      <dl className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
        {readiness.components.map((c) => (
          <div key={c.label} className="space-y-1.5 bg-[var(--color-bg-elevated)] p-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[13.5px] font-semibold capitalize text-[var(--color-ink)]">{c.label}</dt>
              <span className="flex items-center gap-2">
                <span className={cn("text-[11.5px] font-semibold", STATUS[c.status].text)}>{STATUS[c.status].label}</span>
                <StatusSteps status={c.status} />
              </span>
            </div>
            <dd className="text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">{c.explanation}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-dashed border-[var(--color-border)] px-5 py-3 text-[11.5px] text-[var(--color-ink-faint)] sm:px-6">
        Positioning based on your profile — not an approval prediction. The issuer makes the final decision.
      </p>
    </section>
  );
}
