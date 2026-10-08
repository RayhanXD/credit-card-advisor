"use client";

import { FieldGroup, StepHeading } from "@/components/onboarding/OnboardingShell";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import { CheckboxCardGroup } from "@/components/ui/CheckboxCardGroup";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import type { CreditScoreBand, UserProfile, UtilizationBand } from "@/lib/types";
import { CREDIT_SCORE_BAND_RANGES, UTILIZATION_BAND_RANGES } from "@/lib/types";
import { relativeTimeFromMonths } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const SCORE_OPTIONS: { value: CreditScoreBand; label: string; description: string }[] = (
  Object.keys(CREDIT_SCORE_BAND_RANGES) as CreditScoreBand[]
).map((band) => ({
  value: band,
  label: band === "no_credit" ? "No credit yet" : band.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  description: CREDIT_SCORE_BAND_RANGES[band],
}));

const UTIL_OPTIONS: { value: UtilizationBand; label: string }[] = (Object.keys(UTILIZATION_BAND_RANGES) as UtilizationBand[]).map(
  (band) => ({ value: band, label: UTILIZATION_BAND_RANGES[band] })
);

const LOAN_OPTIONS = [
  { value: "auto", label: "Auto loan" },
  { value: "student", label: "Student loan" },
  { value: "mortgage", label: "Mortgage" },
  { value: "personal", label: "Personal loan" },
];

export function StepCreditProfile({
  profile,
  onChange,
  onNext,
}: {
  profile: UserProfile;
  onChange: (updater: (p: UserProfile) => UserProfile) => void;
  onNext: () => void;
}) {
  const f = profile.financial;

  return (
    <div>
      <StepHeading eyebrow="Credit profile" title="Your credit profile" subtitle="Approximate is fine — this shapes which cards are realistic right now." />
      <div className="space-y-6">
        <FieldGroup>
          <div className="space-y-2">
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Approximate credit score range</p>
            <RadioCardGroup
              columns={2}
              options={SCORE_OPTIONS}
              value={f.creditScoreBand}
              onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, creditScoreBand: v } }))}
            />
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Estimated overall credit utilization</p>
            <RadioCardGroup
              columns={3}
              options={UTIL_OPTIONS}
              value={f.utilization}
              onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, utilization: v } }))}
            />
          </div>

          <Slider
            label="Number of open accounts"
            min={0}
            max={15}
            value={f.numOpenAccounts}
            onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, numOpenAccounts: v } }))}
          />

          <Slider
            label="Approximate credit age"
            min={0}
            max={300}
            step={1}
            value={f.creditAgeMonths}
            onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, creditAgeMonths: v } }))}
            formatValue={(v) => relativeTimeFromMonths(v)}
          />

          <Slider
            label="Applications in the last 6 months"
            min={0}
            max={8}
            value={f.recentApplications6mo}
            onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, recentApplications6mo: v } }))}
          />

          <Slider
            label="Hard inquiries in the last 6 months"
            min={0}
            max={8}
            value={f.recentHardInquiries6mo}
            onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, recentHardInquiries6mo: v } }))}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-[var(--color-ink)]">Existing loans</p>
              <button
                type="button"
                onClick={() =>
                  onChange((p) => ({
                    ...p,
                    financial: { ...p.financial, hasExistingLoans: !p.financial.hasExistingLoans, loanTypes: p.financial.hasExistingLoans ? [] : p.financial.loanTypes },
                  }))
                }
                className="text-[12.5px] font-semibold text-[var(--color-accent)] hover:text-[var(--color-ink)]"
              >
                {f.hasExistingLoans ? "I have none" : "I have some"}
              </button>
            </div>
            {f.hasExistingLoans && (
              <CheckboxCardGroup
                columns={2}
                options={LOAN_OPTIONS}
                value={f.loanTypes}
                onChange={(v) => onChange((p) => ({ ...p, financial: { ...p.financial, loanTypes: v } }))}
              />
            )}
          </div>
        </FieldGroup>

        <Button size="lg" className="w-full" onClick={onNext} iconRight={<ArrowRight size={17} />}>
          Continue
        </Button>
      </div>
    </div>
  );
}
