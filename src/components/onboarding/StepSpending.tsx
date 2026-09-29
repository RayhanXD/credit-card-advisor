"use client";

import { StepHeading } from "@/components/onboarding/OnboardingShell";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import type { UserProfile } from "@/lib/types";
import { formatCurrency, totalMonthlySpend } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const FIELDS: { key: keyof UserProfile["spending"]; label: string; max: number }[] = [
  { key: "monthlyDining", label: "Dining & takeout", max: 1500 },
  { key: "monthlyGroceries", label: "Groceries", max: 1500 },
  { key: "monthlyGas", label: "Gas & transit", max: 600 },
  { key: "monthlyTravel", label: "Travel", max: 2000 },
  { key: "monthlyOnline", label: "Online shopping", max: 1000 },
  { key: "monthlyOther", label: "Everything else", max: 1500 },
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
      <StepHeading eyebrow="Step 6 of 9" title="Where does your spending go?" subtitle="This is how we match rewards categories to your actual habits, not guesses." />
      <div className="space-y-6">
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

        <div className="flex items-center justify-between rounded-xl bg-[var(--color-bg-subtle)] px-4 py-3">
          <span className="text-[13px] font-medium text-[var(--color-ink-soft)]">Estimated monthly total</span>
          <span className="text-[16px] font-semibold tabular-nums">{formatCurrency(total)}</span>
        </div>

        <Button size="lg" className="w-full" onClick={handleNext} iconRight={<ArrowRight size={17} />}>
          Continue
        </Button>
      </div>
    </div>
  );
}
