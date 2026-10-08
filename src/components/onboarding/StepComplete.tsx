"use client";

import { Button } from "@/components/ui/Button";
import { CircularScore } from "@/components/ui/CircularScore";
import { CardFace } from "@/components/cards/CreditCardTile";
import { computeFullStrategy } from "@/lib/engine/strategy";
import { buildCreditHealthSnapshot } from "@/lib/engine/creditHealth";
import { getCard } from "@/data/cards";
import type { UserProfile } from "@/lib/types";
import { ArrowRight, Check } from "lucide-react";

export function StepComplete({ profile, onFinish }: { profile: UserProfile; onFinish: () => void }) {
  const strategy = computeFullStrategy(profile);
  const health = buildCreditHealthSnapshot(profile);
  const nextCard = strategy.summary.nextStepCardId ? getCard(strategy.summary.nextStepCardId) : undefined;

  return (
    <div>
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-mint)] text-[#03261a] shadow-[0_0_0_8px_color-mix(in_srgb,var(--color-mint)_18%,transparent)]">
          <Check size={22} strokeWidth={3} />
        </span>
        <h1 className="mt-6 font-display text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--color-ink)] lg:text-[38px]">
          Your strategy is ready, {profile.name.split(" ")[0] || "there"}.
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--color-ink-soft)]">{strategy.summary.headline}</p>
      </div>

      <div className="mt-8 grid overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card-hover)] sm:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col items-center justify-center gap-1 border-b border-[var(--color-border)] p-6 sm:border-b-0 sm:border-r">
          <span className="self-start font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Credit health</span>
          <CircularScore value={health.overallScore} size={128} tone={health.overallScore >= 70 ? "success" : "warning"} sublabel="of 100" />
          <span className="mt-2 rounded-[6px] bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[12px] font-medium text-[var(--color-ink-soft)]">
            Focus: {strategy.primaryGoalLabel}
          </span>
        </div>
        <div className="flex flex-col gap-3 p-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Recommended next</span>
          {nextCard ? (
            <>
              <CardFace card={nextCard} className="max-w-[260px]" />
              <span className="text-[14px] font-semibold text-[var(--color-ink)]">{nextCard.name}</span>
            </>
          ) : (
            <span className="text-[15px] font-semibold text-[var(--color-ink)]">Building your path</span>
          )}
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-lg text-center text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{strategy.summary.narrative}</p>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={onFinish} iconRight={<ArrowRight size={17} />}>
          See My Full Strategy
        </Button>
      </div>
    </div>
  );
}
