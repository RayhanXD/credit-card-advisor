"use client";

import { FieldGroup, StepHeading } from "@/components/onboarding/OnboardingShell";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import { TextField } from "@/components/ui/TextField";
import { TagInput } from "@/components/ui/TagInput";
import { Button } from "@/components/ui/Button";
import type { CabinPreference, TravelFrequency, TravelScope, UserProfile } from "@/lib/types";
import { ArrowRight } from "lucide-react";

const FREQ_OPTIONS: { value: TravelFrequency; label: string }[] = [
  { value: "rarely", label: "Rarely" },
  { value: "few_times_year", label: "A few times a year" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
];

const SCOPE_OPTIONS: { value: TravelScope; label: string }[] = [
  { value: "mostly_domestic", label: "Mostly domestic" },
  { value: "mixed", label: "Mixed" },
  { value: "mostly_international", label: "Mostly international" },
];

const CABIN_OPTIONS: { value: CabinPreference; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium economy" },
  { value: "business_first", label: "Business / First" },
];

export function StepTravel({
  profile,
  onChange,
  onNext,
}: {
  profile: UserProfile;
  onChange: (updater: (p: UserProfile) => UserProfile) => void;
  onNext: () => void;
}) {
  const t = profile.travel;
  return (
    <div>
      <StepHeading eyebrow="Travel" title="Your travel habits" subtitle="Since travel rewards are part of your goals, this helps us match the right ecosystem and transfer partners." />
      <div className="space-y-6">
        <FieldGroup>
          <TextField
            label="Home airport (optional)"
            value={t.homeAirport ?? ""}
            onChange={(e) => onChange((p) => ({ ...p, travel: { ...p.travel, homeAirport: e.target.value } }))}
            placeholder="e.g. SFO"
          />

          <TagInput
            label="Favorite airlines"
            values={t.favoriteAirlines}
            onChange={(v) => onChange((p) => ({ ...p, travel: { ...p.travel, favoriteAirlines: v } }))}
            placeholder="Type an airline and press Enter"
          />

          <TagInput
            label="Favorite hotels"
            values={t.favoriteHotels}
            onChange={(v) => onChange((p) => ({ ...p, travel: { ...p.travel, favoriteHotels: v } }))}
            placeholder="Type a hotel brand and press Enter"
          />

          <div className="space-y-2">
            <p className="text-[13px] font-medium text-[var(--color-ink)]">How often do you travel?</p>
            <RadioCardGroup columns={2} options={FREQ_OPTIONS} value={t.travelFrequency} onChange={(v) => onChange((p) => ({ ...p, travel: { ...p.travel, travelFrequency: v } }))} />
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Domestic vs. international</p>
            <RadioCardGroup columns={3} options={SCOPE_OPTIONS} value={t.scope} onChange={(v) => onChange((p) => ({ ...p, travel: { ...p.travel, scope: v } }))} />
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Typical cabin</p>
            <RadioCardGroup columns={3} options={CABIN_OPTIONS} value={t.cabinPreference} onChange={(v) => onChange((p) => ({ ...p, travel: { ...p.travel, cabinPreference: v } }))} />
          </div>
        </FieldGroup>

        <Button size="lg" className="w-full" onClick={onNext} iconRight={<ArrowRight size={17} />}>
          Continue
        </Button>
      </div>
    </div>
  );
}
