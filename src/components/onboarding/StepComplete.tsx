"use client";

import { StepHeading } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/Button";
import { CircularScore } from "@/components/ui/CircularScore";
import { computeFullStrategy } from "@/lib/engine/strategy";
import { buildCreditHealthSnapshot } from "@/lib/engine/creditHealth";
import { getCard } from "@/data/cards";
import type { UserProfile } from "@/lib/types";
import { ArrowRight, Sparkles } from "lucide-react";

export function StepComplete({ profile, onFinish }: { profile: UserProfile; onFinish: () => void }) {
  const strategy = computeFullStrategy(profile);
  const health = buildCreditHealthSnapshot(profile);
  const nextCard = strategy.summary.nextStepCardId ? getCard(strategy.summary.nextStepCardId) : undefined;

  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-[var(--color-bg)]">
        <Sparkles size={22} />
      </div>
      <StepHeading title={`Your strategy is ready, ${profile.name.split(" ")[0] || "there"}.`} subtitle={strategy.summary.headline} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
          <CircularScore value={health.overallScore} size={84} tone="success" />
          <span className="text-[12.5px] font-medium text-[var(--color-ink-soft)]">Credit Health</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
          <span className="text-[13px] font-medium text-[var(--color-ink-faint)]">Recommended next</span>
          <span className="text-[15px] font-semibold">{nextCard?.name ?? "Building your path"}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
          <span className="text-[13px] font-medium text-[var(--color-ink-faint)]">Focus</span>
          <span className="text-[15px] font-semibold">{strategy.primaryGoalLabel}</span>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-md text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{strategy.summary.narrative}</p>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={onFinish} iconRight={<ArrowRight size={17} />}>
          See My Full Strategy
        </Button>
      </div>
    </div>
  );
}
