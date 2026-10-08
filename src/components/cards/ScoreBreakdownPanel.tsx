"use client";

import { useEffect, useState } from "react";
import type { ScoreBreakdown } from "@/lib/types";
import { cn } from "@/lib/utils";

type FactorKey = keyof Omit<ScoreBreakdown, "total">;

export const SCORE_FACTORS: { key: FactorKey; label: string; short: string; max: number; color: string }[] = [
  { key: "goalAlignment", label: "Goal alignment", short: "Goals", max: 25, color: "var(--series-1)" },
  { key: "creditProfileFit", label: "Credit profile", short: "Credit", max: 20, color: "var(--series-2)" },
  { key: "spendingMatch", label: "Spending match", short: "Spend", max: 20, color: "var(--series-3)" },
  { key: "issuerRelationship", label: "Issuer relationship", short: "Issuer", max: 12, color: "var(--series-4)" },
  { key: "portfolioCompatibility", label: "Portfolio fit", short: "Portfolio", max: 10, color: "var(--series-5)" },
  { key: "timing", label: "Timing", short: "Timing", max: 8, color: "var(--series-6)" },
  { key: "annualFeeFit", label: "Annual fee fit", short: "Fee", max: 5, color: "var(--series-7)" },
];

// The factor strip: one 100-point bar where every factor owns a slot sized to
// its maximum weight, filled by what it actually earned. Unearned space is
// hatched, so "why not higher" is as visible as "why this high".
export function FactorStrip({ score, className, height = 10 }: { score: ScoreBreakdown; className?: string; height?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={cn("flex w-full gap-[2px]", className)}
      role="img"
      aria-label={`Fit score ${score.total} of 100. ${SCORE_FACTORS.map((f) => `${f.label} ${score[f.key]} of ${f.max}`).join(", ")}.`}
    >
      {SCORE_FACTORS.map((f, i) => {
        const earned = Math.max(0, Math.min(1, score[f.key] / f.max));
        return (
          <div
            key={f.key}
            className={cn(
              "bg-hatch relative overflow-hidden bg-[var(--color-bg-subtle)]",
              i === 0 && "rounded-l-[4px]",
              i === SCORE_FACTORS.length - 1 && "rounded-r-[4px]"
            )}
            style={{ flexGrow: f.max, flexBasis: 0, height }}
            title={`${f.label}: ${score[f.key]}/${f.max}`}
          >
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: mounted ? `${earned * 100}%` : "0%", background: f.color, transitionDelay: `${i * 50}ms` }}
            />
          </div>
        );
      })}
    </div>
  );
}

// The full ledger: every factor as a line item with points earned, like a
// receipt for the recommendation.
export function ScoreBreakdownPanel({ score }: { score: ScoreBreakdown }) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[12.5px] font-medium text-[var(--color-ink-soft)]">How the fit score is built</span>
        <span className="figure text-[13px] text-[var(--color-ink-faint)]">
          <span className="text-[18px] font-semibold text-[var(--color-ink)]">{score.total}</span>/100
        </span>
      </div>
      <FactorStrip score={score} height={12} />
      <dl className="divide-y divide-dashed divide-[var(--color-border)]">
        {SCORE_FACTORS.map((f) => {
          const pct = score[f.key] / f.max;
          return (
            <div key={f.key} className="flex items-center gap-3 py-2 text-[13px]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: f.color }} />
              <dt className="flex-1 text-[var(--color-ink-soft)]">{f.label}</dt>
              <dd className="flex items-center gap-3">
                <span className="hidden w-16 sm:block">
                  <span className="block h-1 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                    <span className="block h-full rounded-full" style={{ width: `${pct * 100}%`, background: f.color }} />
                  </span>
                </span>
                <span className="figure w-14 text-right text-[var(--color-ink)]">
                  +{score[f.key]}
                  <span className="text-[var(--color-ink-faint)]">/{f.max}</span>
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="text-[11.5px] leading-relaxed text-[var(--color-ink-faint)]">
        An internal measure of fit to your profile, not an approval probability. Issuers make every credit decision.
      </p>
    </div>
  );
}
