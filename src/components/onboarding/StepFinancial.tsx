"use client";

import { StepHeading } from "@/components/onboarding/OnboardingShell";
import { TextField } from "@/components/ui/TextField";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import type { AnnualFeeTolerance, AgeRange, EmploymentStatus, HousingStatus, UserProfile } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "18_20", label: "18–20" },
  { value: "21_24", label: "21–24" },
  { value: "25_34", label: "25–34" },
  { value: "35_44", label: "35–44" },
  { value: "45_54", label: "45–54" },
  { value: "55_64", label: "55–64" },
  { value: "65_plus", label: "65+" },
];

const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: "employed_full_time", label: "Employed, full-time" },
  { value: "employed_part_time", label: "Employed, part-time" },
  { value: "self_employed", label: "Self-employed" },
  { value: "student", label: "Student" },
  { value: "unemployed", label: "Unemployed" },
  { value: "retired", label: "Retired" },
];

const HOUSING_OPTIONS: { value: HousingStatus; label: string }[] = [
  { value: "rent", label: "Rent" },
  { value: "own_with_mortgage", label: "Own, with mortgage" },
  { value: "own_outright", label: "Own, outright" },
  { value: "live_with_family", label: "Live with family" },
];

const FEE_TOLERANCE_OPTIONS: { value: AnnualFeeTolerance; label: string; description: string }[] = [
  { value: "none", label: "$0 only", description: "No annual fee cards" },
  { value: "low", label: "Under $100", description: "Modest fees are fine" },
  { value: "moderate", label: "Under $400", description: "If the value is there" },
  { value: "high", label: "$400+", description: "Premium cards welcome" },
];

export function StepFinancial({
  profile,
  onChange,
  onNext,
}: {
  profile: UserProfile;
  onChange: (updater: (p: UserProfile) => UserProfile) => void;
  onNext: () => void;
}) {
  const f = profile.financial;
  const canContinue = profile.name.trim().length > 0;

  return (
    <div>
      <StepHeading eyebrow="Step 2 of 9" title="Tell us about your financial picture" subtitle="Only what materially improves your recommendations — nothing more." />
      <div className="space-y-6">
        <TextField
          label="What should we call you?"
          value={profile.name}
          onChange={(e) => onChange((p) => ({ ...p, name: e.target.value }))}
          placeholder="Your name"
        />

        <div className="space-y-2">
          <p className="text-[13px] font-medium text-[var(--color-ink)]">Age range</p>
          <RadioCardGroup
            columns={3}
            options={AGE_OPTIONS}
            value={f.ageRange}
            onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, ageRange: v } }))}
          />
        </div>

        <div className="space-y-2">
          <p className="text-[13px] font-medium text-[var(--color-ink)]">Employment status</p>
          <RadioCardGroup
            columns={2}
            options={EMPLOYMENT_OPTIONS}
            value={f.employmentStatus}
            onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, employmentStatus: v } }))}
          />
        </div>

        <Slider
          label="Approximate annual income"
          min={0}
          max={300000}
          step={1000}
          value={f.annualIncome}
          onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, annualIncome: v } }))}
          formatValue={(v) => formatCurrency(v)}
        />

        <div className="space-y-2">
          <p className="text-[13px] font-medium text-[var(--color-ink)]">Housing situation</p>
          <RadioCardGroup
            columns={2}
            options={HOUSING_OPTIONS}
            value={f.housingStatus}
            onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, housingStatus: v } }))}
          />
        </div>

        <Slider
          label="Approximate monthly housing payment"
          min={0}
          max={6000}
          step={50}
          value={f.monthlyHousingPayment}
          onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, monthlyHousingPayment: v } }))}
          formatValue={(v) => formatCurrency(v)}
        />

        <div className="space-y-2">
          <p className="text-[13px] font-medium text-[var(--color-ink)]">Annual fee tolerance</p>
          <RadioCardGroup
            columns={2}
            options={FEE_TOLERANCE_OPTIONS}
            value={f.annualFeeTolerance}
            onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, annualFeeTolerance: v } }))}
          />
        </div>

        <Button size="lg" className="w-full" onClick={onNext} disabled={!canContinue} iconRight={<ArrowRight size={17} />}>
          Continue
        </Button>
      </div>
    </div>
  );
}
