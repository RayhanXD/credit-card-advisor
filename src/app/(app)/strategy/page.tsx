"use client";

import { useAppStore } from "@/lib/store";
import { computeFullStrategy } from "@/lib/engine/strategy";
import { JourneyTimeline } from "@/components/strategy/JourneyTimeline";
import { ReadinessBreakdown } from "@/components/strategy/ReadinessBreakdown";
import { MilestoneRail } from "@/components/strategy/MilestoneRail";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { PageHeader, SectionHeading } from "@/components/ui/Panel";

export default function StrategyPage() {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return null;

  const strategy = computeFullStrategy(profile);
  const months = strategy.summary.timeline[strategy.summary.timeline.length - 1]?.monthOffset ?? 24;

  return (
    <div className="space-y-10">
      <PageHeader kicker={strategy.primaryGoalLabel} title="My Strategy" description={<p>{strategy.summary.narrative}</p>} />

      {strategy.readiness && <ReadinessBreakdown readiness={strategy.readiness} />}

      {strategy.journey ? (
        <section className="space-y-4">
          <SectionHeading kicker="Step by step" title="Your Card Journey" />
          <JourneyTimeline journey={strategy.journey} />
        </section>
      ) : (
        strategy.topRecommendation && (
          <section className="space-y-4">
            <SectionHeading kicker="Ranked by fit" title="Recommended next cards" />
            <div className="space-y-4">
              {strategy.allRecommendations.slice(0, 3).map((rec, i) => (
                <RecommendationCard key={rec.cardId} recommendation={rec} highlight={i === 0} />
              ))}
            </div>
          </section>
        )
      )}

      <section className="space-y-4">
        <SectionHeading kicker="Milestones" title={`Your ${months}-month strategy`} />
        <MilestoneRail entries={strategy.summary.timeline} />
      </section>

      <Disclaimer />
    </div>
  );
}
