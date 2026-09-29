"use client";

import { useAppStore } from "@/lib/store";
import { computeFullStrategy } from "@/lib/engine/strategy";
import { JourneyTimeline } from "@/components/strategy/JourneyTimeline";
import { ReadinessBreakdown } from "@/components/strategy/ReadinessBreakdown";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { Disclaimer } from "@/components/ui/Disclaimer";

export default function StrategyPage() {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return null;

  const strategy = computeFullStrategy(profile);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">My Strategy</h1>
        <p className="mt-1 max-w-2xl text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{strategy.summary.narrative}</p>
      </div>

      {strategy.readiness && <ReadinessBreakdown readiness={strategy.readiness} />}

      {strategy.journey ? (
        <div className="space-y-3">
          <h2 className="text-[16px] font-semibold">Your Card Journey</h2>
          <JourneyTimeline journey={strategy.journey} />
        </div>
      ) : (
        strategy.topRecommendation && (
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold">Recommended Next Cards</h2>
            <div className="space-y-3">
              {strategy.allRecommendations.slice(0, 3).map((rec, i) => (
                <RecommendationCard key={rec.cardId} recommendation={rec} highlight={i === 0} />
              ))}
            </div>
          </div>
        )
      )}

      <div className="space-y-3">
        <h2 className="text-[16px] font-semibold">
          Your {strategy.summary.timeline[strategy.summary.timeline.length - 1]?.monthOffset ?? 24}-Month Strategy
        </h2>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          {strategy.summary.timeline.map((entry, i, arr) => (
            <div key={entry.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-subtle)] text-[11.5px] font-semibold text-[var(--color-ink)]">
                  {i + 1}
                </div>
                {i < arr.length - 1 && <div className="my-1 w-px flex-1 bg-[var(--color-border-strong)]" />}
              </div>
              <div className="pb-7">
                <p className="text-[13.5px] font-medium text-[var(--color-ink)]">{entry.label}</p>
                <p className="text-[13px] text-[var(--color-ink-soft)]">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
