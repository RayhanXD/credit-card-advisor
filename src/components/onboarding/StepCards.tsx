"use client";

import { StepHeading } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/Button";
import { CardAutocomplete } from "@/components/cards/CardAutocomplete";
import { getCard } from "@/data/cards";
import { getIssuer } from "@/data/issuers";
import { CardFace } from "@/components/cards/CreditCardTile";
import type { UserProfile } from "@/lib/types";
import { ArrowRight, X } from "lucide-react";

export function StepCards({
  profile,
  onChange,
  onNext,
}: {
  profile: UserProfile;
  onChange: (updater: (p: UserProfile) => UserProfile) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="Current cards"
        title="What cards do you already have?"
        subtitle="We'll factor these into every recommendation. Skip this if you're starting from scratch."
      />
      <div className="space-y-4">
        <CardAutocomplete
          excludeIds={profile.ownedCards.map((oc) => oc.cardId)}
          onSelect={(card) =>
            onChange((p) => ({
              ...p,
              ownedCards: [...p.ownedCards, { id: `owned_${Date.now()}_${card.id}`, cardId: card.id, monthsOpen: 12 }],
            }))
          }
        />

        {profile.ownedCards.length > 0 && (
          <div className="space-y-2">
            {profile.ownedCards.map((oc) => {
              const card = getCard(oc.cardId);
              if (!card) return null;
              return (
                <div key={oc.id} className="animate-rise flex items-center gap-3 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2.5 pr-3 shadow-[var(--shadow-card)]">
                  <CardFace card={card} size="sm" className="w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{card.name}</p>
                    <p className="text-[11.5px] text-[var(--color-ink-faint)]">{getIssuer(card.issuerId)?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-[12px] text-[var(--color-ink-soft)]">
                      <span className="hidden sm:inline">Months open</span>
                      <span className="sm:hidden">Mo.</span>
                      <input
                        type="number"
                        min={0}
                        value={oc.monthsOpen}
                        onChange={(e) =>
                          onChange((p) => ({
                            ...p,
                            ownedCards: p.ownedCards.map((x) => (x.id === oc.id ? { ...x, monthsOpen: Number(e.target.value) } : x)),
                          }))
                        }
                        className="figure h-8 w-16 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 text-[12.5px] outline-none focus:border-[var(--color-mint)]"
                      />
                    </label>
                    <button
                      onClick={() => onChange((p) => ({ ...p, ownedCards: p.ownedCards.filter((x) => x.id !== oc.id) }))}
                      className="rounded-[8px] p-1.5 text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-danger)]"
                      aria-label={`Remove ${card.name}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button size="lg" className="w-full" onClick={onNext} iconRight={<ArrowRight size={17} />}>
          {profile.ownedCards.length > 0 ? "Continue" : "I don't have any cards yet"}
        </Button>
      </div>
    </div>
  );
}
