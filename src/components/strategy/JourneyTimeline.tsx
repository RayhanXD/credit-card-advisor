import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";
import type { CardJourney } from "@/lib/types";
import { getCard } from "@/data/cards";
import { CardFace } from "@/components/cards/CreditCardTile";
import { cn } from "@/lib/utils";

const TIMING: Record<string, { label: string; chip: string }> = {
  now: { label: "Now", chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" },
  next: { label: "Next", chip: "bg-[var(--color-teal-soft)] text-[var(--color-teal)]" },
  later: { label: "Later", chip: "bg-[var(--color-gold-soft)] text-[var(--color-gold)]" },
};

// The Card Journey drawn as a route: a solid line for where you are, a dashed
// line for what's ahead, and the goal card as the destination flag.
export function JourneyTimeline({ journey }: { journey: CardJourney }) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
      {journey.estimatedTimelineMonths > 0 && (
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3 sm:px-6">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Route</span>
          <span className="text-[12.5px] text-[var(--color-ink-soft)]">
            About <span className="figure font-semibold text-[var(--color-ink)]">{journey.estimatedTimelineMonths}</span> months, end to end
          </span>
        </div>
      )}
      <ol className="p-5 sm:p-6">
        {journey.steps.map((step, i) => {
          const card = step.cardId ? getCard(step.cardId) : undefined;
          const isLast = i === journey.steps.length - 1;
          const isNow = step.timing === "now";
          const isGoal = isLast && journey.steps.length > 1;
          const timing = TIMING[step.timing];
          return (
            <li key={step.order} className="relative grid grid-cols-[32px_1fr] gap-4">
              <div className="relative flex flex-col items-center">
                <span
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold",
                    isNow && "bg-[var(--color-mint)] text-[#03261a]",
                    isGoal && "bg-[var(--color-ink)] text-[var(--color-gold-vivid)]",
                    !isNow && !isGoal && "border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-ink-soft)]"
                  )}
                >
                  {isNow && <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[var(--color-mint)]" />}
                  <span className="relative">{isGoal ? <Flag size={14} strokeWidth={2.5} /> : step.order}</span>
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "my-1 w-[2px] flex-1",
                      isNow
                        ? "bg-[linear-gradient(var(--color-mint),var(--color-border-strong))]"
                        : "bg-[repeating-linear-gradient(var(--color-border-strong)_0_5px,transparent_5px_10px)]"
                    )}
                  />
                )}
              </div>

              <div className={cn("min-w-0 pb-8", isLast && "pb-0")}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-[5px] px-1.5 py-px font-mono text-[10px] font-medium uppercase tracking-[0.1em]", timing.chip)}>
                    {timing.label}
                  </span>
                  {isGoal && <span className="text-[11.5px] font-medium text-[var(--color-ink-faint)]">Destination</span>}
                </div>
                <p className="mt-1.5 font-display text-[16.5px] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">{step.title}</p>
                <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{step.description}</p>
                {step.reasons.length > 0 && (
                  <ul className="mt-2.5 space-y-1">
                    {step.reasons.map((r) => (
                      <li key={r} className="flex gap-2 text-[12.5px] leading-snug text-[var(--color-ink-faint)]">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-ink-faint)]" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
                {card && (
                  <Link
                    href={`/card-finder/${card.id}`}
                    className="group mt-3 inline-flex items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-1.5 pl-1.5 pr-3 transition-colors hover:border-[var(--color-border-strong)]"
                  >
                    <CardFace card={card} size="sm" className="w-12 shrink-0" />
                    <span className="whitespace-nowrap text-[12.5px] font-medium text-[var(--color-ink)]">{card.name}</span>
                    <ArrowRight size={13} className="text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
