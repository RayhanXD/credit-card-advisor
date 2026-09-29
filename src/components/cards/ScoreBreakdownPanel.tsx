import type { ScoreBreakdown } from "@/lib/types";
import { MeterBar } from "@/components/ui/MeterBar";

const ROWS: { key: keyof Omit<ScoreBreakdown, "total">; label: string; max: number }[] = [
  { key: "creditProfileFit", label: "Credit Profile", max: 20 },
  { key: "goalAlignment", label: "Goal Alignment", max: 25 },
  { key: "spendingMatch", label: "Spending Match", max: 20 },
  { key: "issuerRelationship", label: "Issuer Relationship", max: 12 },
  { key: "portfolioCompatibility", label: "Portfolio Compatibility", max: 10 },
  { key: "timing", label: "Timing", max: 8 },
  { key: "annualFeeFit", label: "Annual Fee Fit", max: 5 },
];

export function ScoreBreakdownPanel({ score }: { score: ScoreBreakdown }) {
  return (
    <div className="space-y-3">
      {ROWS.map((row) => (
        <div key={row.key} className="space-y-1">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-[var(--color-ink-soft)]">{row.label}</span>
            <span className="tabular-nums font-medium text-[var(--color-ink)]">
              +{score[row.key]}
              <span className="text-[var(--color-ink-faint)]">/{row.max}</span>
            </span>
          </div>
          <MeterBar value={(score[row.key] / row.max) * 100} tone="accent" />
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-[13.5px] font-semibold">
        <span>Total</span>
        <span className="tabular-nums">{score.total}/100</span>
      </div>
      <p className="text-[11px] text-[var(--color-ink-faint)]">
        This is an internal recommendation score reflecting fit to your profile — not an approval probability.
      </p>
    </div>
  );
}
