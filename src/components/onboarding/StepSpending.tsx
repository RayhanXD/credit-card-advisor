"use client";

import { FieldGroup, StepHeading } from "@/components/onboarding/OnboardingShell";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import type { UserProfile } from "@/lib/types";
import { formatCurrency, totalMonthlySpend } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const FIELDS: { key: keyof UserProfile["spending"]; label: string; max: number; color: string }[] = [
  { key: "monthlyDining", label: "Dining & takeout", max: 1500, color: "var(--series-5)" },
  { key: "monthlyGroceries", label: "Groceries", max: 1500, color: "var(--series-1)" },
  { key: "monthlyGas", label: "Gas & transit", max: 600, color: "var(--series-3)" },
  { key: "monthlyTravel", label: "Travel", max: 2000, color: "var(--series-2)" },
  { key: "monthlyOnline", label: "Online shopping", max: 1000, color: "var(--series-4)" },
  { key: "monthlyOther", label: "Everything else", max: 1500, color: "var(--series-7)" },
];

export function StepSpending({
  profile,
  onChange,
  onNext,
}: {
  profile: UserProfile;
  onChange: (updater: (p: UserProfile) => UserProfile) => void;
  onNext: () => void;
}) {
  const total = totalMonthlySpend(profile.spending);

  function handleNext() {
    onChange((p) => ({ ...p, financial: { ...p.financial, monthlySpending: totalMonthlySpend(p.spending) } }));
    onNext();
  }

  return (
    <div>
      <StepHeading eyebrow="Spending" title="Where does your spending go?" subtitle="This is how we match rewards categories to your actual habits, not guesses." />
      <div className="space-y-6">
        <FieldGroup>
          {FIELDS.map((f) => (
            <Slider
              key={f.key}
              label={f.label}
              min={0}
              max={f.max}
              step={10}
              value={profile.spending[f.key]}
              onChange={(v) => onChange((p) => ({ ...p, spending: { ...p.spending, [f.key]: v } }))}
              formatValue={(v) => formatCurrency(v)}
            />
          ))}

          <div className="space-y-3 rounded-[14px] bg-[var(--color-bg-subtle)] p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-[var(--color-ink-soft)]">Estimated monthly total</span>
              <span className="figure text-[20px] font-semibold text-[var(--color-ink)]">{formatCurrency(total)}</span>
            </div>
            <div className="flex h-2.5 gap-[2px] overflow-hidden rounded-full bg-[var(--color-bg-sunken)]" aria-hidden="true">
              {FIELDS.map((f) =>
                profile.spending[f.key] > 0 ? (
                  <span key={f.key} className="transition-[flex-grow] duration-300" style={{ flexGrow: profile.spending[f.key], background: f.color }} />
                ) : null
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {FIELDS.map((f) => (
                <span key={f.key} className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-faint)]">
                  <span className="h-2 w-2 rounded-[2px]" style={{ background: f.color }} />
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </FieldGroup>

        <Button size="lg" className="w-full" onClick={handleNext} iconRight={<ArrowRight size={17} />}>
          Continue
        </Button>
      </div>
    </div>
  );
}
