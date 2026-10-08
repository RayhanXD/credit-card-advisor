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
        eyebrow="Relationships"
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
                aria-pressed={selected}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-control)] border px-3.5 py-3 text-left transition-[border-color,background-color,box-shadow]",
                  selected
                    ? "border-[var(--color-mint)] bg-[var(--color-accent-soft)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mint)_18%,transparent)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]"
                )}
              >
                <span className="h-3 w-3 shrink-0 rounded-[4px]" style={{ background: issuer.accentColor }} />
                <span className="flex-1 text-[13px] font-medium text-[var(--color-ink)]">{issuer.name}</span>
                {selected && <Check size={14} strokeWidth={3} className="text-[var(--color-accent)]" />}
              </button>
            );
          })}
        </div>

        {selectedIssuerIds.length > 0 && (
          <div className="space-y-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-card)]">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Which accounts?</p>
            {selectedIssuerIds.map((issuerId) => {
              const issuer = ISSUERS.find((i) => i.id === issuerId)!;
              const rel = profile.issuerRelationships[issuerId];
              return (
                <div key={issuerId} className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-[var(--color-bg-subtle)] px-3 py-2.5">
                  <span className="text-[13px] font-medium">{issuer.name}</span>
                  <div className="flex gap-1.5">
                    {(["checking", "savings", "investment"] as const).map((field) => (
                      <button
                        key={field}
                        onClick={() => toggleField(issuerId, field)}
                        aria-pressed={!!rel?.[field]}
                        className={cn(
                          "rounded-[7px] border px-2.5 py-1 text-[11.5px] font-medium capitalize transition-colors",
                          rel?.[field]
                            ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg-elevated)]"
                            : "border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
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
