"use client";

import { useAppStore } from "@/lib/store";
import { buildCreditHealthSnapshot } from "@/lib/engine/creditHealth";
import { buildImprovementRecommendations } from "@/lib/engine/improvements";
import { CircularScore } from "@/components/ui/CircularScore";
import { MetricRow } from "@/components/credit-health/MetricRow";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { AlertTriangle } from "lucide-react";

export default function CreditHealthPage() {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return null;

  const snapshot = buildCreditHealthSnapshot(profile);
  const improvements = buildImprovementRecommendations(profile);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Credit Health</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">
          An educational composite based on what you&rsquo;ve shared — not your actual FICO or VantageScore.
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-5">
          <CircularScore value={snapshot.overallScore} size={112} tone={snapshot.overallScore >= 70 ? "success" : "warning"} />
          <div>
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">Credit Health</p>
            <p className="max-w-xs text-[13px] text-[var(--color-ink-soft)]">
              Built from your payment history, utilization, account age, inquiries, and credit mix.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[16px] font-semibold">Your Metrics</h2>
        <div className="space-y-3">
          {snapshot.metrics.map((m) => (
            <MetricRow key={m.key} metric={m} />
          ))}
        </div>
      </div>

      {improvements.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[16px] font-semibold">Improve Your Profile</h2>
          <div className="space-y-3">
            {improvements.map((rec) => (
              <div key={rec.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[var(--color-warning)]" />
                  <div className="flex-1 space-y-2">
                    <p className="text-[14px] font-medium text-[var(--color-ink)]">{rec.issue}</p>
                    <p className="text-[13px] text-[var(--color-ink-soft)]">{rec.whyItMatters}</p>
                    <div className="rounded-xl bg-[var(--color-bg-subtle)] px-3.5 py-2.5">
                      <p className="text-[12.5px] font-medium text-[var(--color-ink)]">Suggested action</p>
                      <p className="mt-0.5 text-[13px] text-[var(--color-ink-soft)]">{rec.action}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[12px] text-[var(--color-ink-faint)]">
                      <span>Expected impact: {rec.expectedImpact}</span>
                      <span>Timeframe: {rec.timeHorizon}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
