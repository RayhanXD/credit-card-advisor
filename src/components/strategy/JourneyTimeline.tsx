import Link from "next/link";
import type { CardJourney } from "@/lib/types";
import { getCard } from "@/data/cards";
import { cn } from "@/lib/utils";

const TIMING_LABEL: Record<string, string> = { now: "Now", next: "Next", later: "Later" };

export function JourneyTimeline({ journey }: { journey: CardJourney }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
      {journey.estimatedTimelineMonths > 0 && (
        <p className="mb-5 text-[12.5px] text-[var(--color-ink-faint)]">
          Estimated timeline: ~{journey.estimatedTimelineMonths} months
        </p>
      )}
      <div>
        {journey.steps.map((step, i) => {
          const card = step.cardId ? getCard(step.cardId) : undefined;
          const isLast = i === journey.steps.length - 1;
          return (
            <div key={step.order} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
                    step.timing === "now" ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "bg-[var(--color-bg-subtle)] text-[var(--color-ink-soft)]"
                  )}
                >
                  {step.order}
                </div>
                {!isLast && <div className="my-1 w-px flex-1 bg-[var(--color-border-strong)]" />}
              </div>
              <div className={cn("pb-8", isLast && "pb-0")}>
                <span className="mb-1 inline-block rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">
                  {TIMING_LABEL[step.timing]}
                </span>
                <p className="text-[15px] font-medium text-[var(--color-ink)]">{step.title}</p>
                <p className="mt-0.5 text-[13.5px] text-[var(--color-ink-soft)]">{step.description}</p>
                {step.reasons.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {step.reasons.map((r) => (
                      <li key={r} className="text-[12.5px] text-[var(--color-ink-faint)]">
                        · {r}
                      </li>
                    ))}
                  </ul>
                )}
                {card && (
                  <Link
                    href={`/card-finder/${card.id}`}
                    className="mt-2 inline-block rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)]"
                  >
                    View {card.name} →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
