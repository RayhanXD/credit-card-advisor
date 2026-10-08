"use client";

import { useAppStore } from "@/lib/store";
import { buildCreditHealthSnapshot } from "@/lib/engine/creditHealth";
import { buildImprovementRecommendations } from "@/lib/engine/improvements";
import { CircularScore } from "@/components/ui/CircularScore";
import { MetricRow } from "@/components/credit-health/MetricRow";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Kicker, PageHeader, SectionHeading } from "@/components/ui/Panel";
import { Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const BANDS = [
  { min: 0, max: 40, label: "Building", color: "var(--color-coral-vivid)", tone: "danger" },
  { min: 40, max: 60, label: "Fair", color: "var(--color-gold-vivid)", tone: "warning" },
  { min: 60, max: 80, label: "Good", color: "var(--color-teal-vivid)", tone: "teal" },
  { min: 80, max: 101, label: "Strong", color: "var(--color-mint)", tone: "success" },
] as const;

export default function CreditHealthPage() {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return null;

  const snapshot = buildCreditHealthSnapshot(profile);
  const improvements = buildImprovementRecommendations(profile);
  const band = BANDS.find((b) => snapshot.overallScore >= b.min && snapshot.overallScore < b.max) ?? BANDS[0];

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="Educational composite"
        kickerTone="teal"
        title="Credit Health"
        description="Built from what you’ve shared — not your actual FICO or VantageScore."
      />

      <section className="grid overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)] md:grid-cols-[auto_1fr]">
        <div className="bg-grid relative flex flex-col items-center justify-center border-b border-[var(--color-border)] p-7 md:border-b-0 md:border-r">
          <CircularScore value={snapshot.overallScore} size={176} tone={band.tone} sublabel="of 100" />
          <span className="mt-1 rounded-[6px] px-2 py-0.5 text-[12px] font-semibold" style={{ background: `color-mix(in srgb, ${band.color} 18%, transparent)`, color: "var(--color-ink)" }}>
            {band.label}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
          <div className="space-y-2">
            <Kicker>Where you sit</Kicker>
            <p className="max-w-md text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
              A 0–100 composite of payment history, utilization, account age, recent inquiries, and credit mix.
            </p>
          </div>
          <div>
            <div className="relative flex h-2.5 gap-[3px]">
              {BANDS.map((b) => (
                <span key={b.label} className="h-full rounded-[3px]" style={{ flexGrow: Math.min(b.max, 100) - b.min, background: b.color, opacity: b === band ? 1 : 0.35 }} />
              ))}
              <span
                className="absolute -top-1.5 h-[22px] w-[3px] -translate-x-1/2 rounded-full bg-[var(--color-ink)] ring-2 ring-[var(--color-bg-elevated)]"
                style={{ left: `${snapshot.overallScore}%` }}
              />
            </div>
            <div className="mt-2 flex">
              {BANDS.map((b) => (
                <span
                  key={b.label}
                  className={cn("text-[11px]", b === band ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink-faint)]")}
                  style={{ flexGrow: Math.min(b.max, 100) - b.min, flexBasis: 0 }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading kicker="5 factors" title="Your metrics" />
        <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
          {snapshot.metrics.map((m) => (
            <MetricRow key={m.key} metric={m} />
          ))}
        </div>
      </section>

      {improvements.length > 0 && (
        <section className="space-y-4">
          <SectionHeading kicker="Prioritized" title="Improve your profile" />
          <ol className="grid gap-4 md:grid-cols-2">
            {improvements.map((rec, i) => (
              <li
                key={rec.id}
                className="flex flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start gap-3">
                  <span className="figure flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-gold-soft)] text-[12px] font-semibold text-[var(--color-gold)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-[14.5px] font-semibold leading-snug text-[var(--color-ink)]">{rec.issue}</p>
                    <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">{rec.whyItMatters}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-[12px] border-l-[3px] border-[var(--color-mint)] bg-[var(--color-bg-subtle)] px-3.5 py-2.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Do this</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--color-ink)]">{rec.action}</p>
                </div>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1.5 pt-4 text-[12px] text-[var(--color-ink-soft)]">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp size={13} className="text-[var(--color-mint)]" />
                    {rec.expectedImpact}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-[var(--color-teal-vivid)]" />
                    {rec.timeHorizon}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <Disclaimer />
    </div>
  );
}
