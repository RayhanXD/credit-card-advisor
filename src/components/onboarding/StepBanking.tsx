"use client";

import { StepHeading } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/Button";
import { ISSUERS } from "@/data/issuers";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";

export function StepBanking({
  profile,
  onChange,
  onNext,
}: {
  profile: UserProfile;
  onChange: (updater: (p: UserProfile) => UserProfile) => void;
  onNext: () => void;
}) {
  const selectedIssuerIds = ISSUERS.filter((i) => {
    const rel = profile.issuerRelationships[i.id];
    return rel && (rel.checking || rel.savings || rel.investment);
  }).map((i) => i.id);

  function toggleIssuer(issuerId: string) {
    onChange((p) => {
      const rel = p.issuerRelationships[issuerId];
      const isSelected = rel && (rel.checking || rel.savings || rel.investment);
      return {
        ...p,
        issuerRelationships: {
          ...p.issuerRelationships,
          [issuerId]: isSelected
            ? { issuerId, checking: false, savings: false, investment: false }
            : { issuerId, checking: true, savings: false, investment: false },
        },
      };
    });
  }

  function toggleField(issuerId: string, field: "checking" | "savings" | "investment") {
    onChange((p) => ({
      ...p,
      issuerRelationships: {
        ...p.issuerRelationships,
        [issuerId]: { ...p.issuerRelationships[issuerId], issuerId, [field]: !p.issuerRelationships[issuerId]?.[field] },
      },
    }));
  }

  return (
    <div>
      <StepHeading
        eyebrow="Step 4 of 9"
        title="Do you already have relationships with these companies?"
        subtitle="Existing banking and card relationships can meaningfully affect which cards make sense next."
      />
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ISSUERS.map((issuer) => {
            const selected = selectedIssuerIds.includes(issuer.id);
            return (
              <button
                key={issuer.id}
                onClick={() => toggleIssuer(issuer.id)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left transition-colors",
                  selected
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-subtle)]"
                )}
              >
                <span className="text-[13px] font-medium">{issuer.name}</span>
                {selected && <Check size={14} strokeWidth={3} />}
              </button>
            );
          })}
        </div>

        {selectedIssuerIds.length > 0 && (
          <div className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">Tell us a bit more</p>
            {selectedIssuerIds.map((issuerId) => {
              const issuer = ISSUERS.find((i) => i.id === issuerId)!;
              const rel = profile.issuerRelationships[issuerId];
              return (
                <div key={issuerId} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[var(--color-bg-elevated)] px-3 py-2.5">
                  <span className="text-[13px] font-medium">{issuer.name}</span>
                  <div className="flex gap-1.5">
                    {(["checking", "savings", "investment"] as const).map((field) => (
                      <button
                        key={field}
                        onClick={() => toggleField(issuerId, field)}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11.5px] font-medium capitalize",
                          rel?.[field]
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                            : "border-[var(--color-border)] text-[var(--color-ink-faint)]"
                        )}
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button size="lg" className="w-full" onClick={onNext} iconRight={<ArrowRight size={17} />}>
          Continue
        </Button>
      </div>
    </div>
  );
}
