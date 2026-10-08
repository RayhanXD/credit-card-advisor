"use client";

import { StepHeading } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/Button";
import { CardAutocomplete } from "@/components/cards/CardAutocomplete";
import { GOAL_DEFINITIONS } from "@/data/goals";
import { getCard } from "@/data/cards";
import type { GoalId, UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight, X } from "lucide-react";

const GROUPS = ["Credit", "Rewards", "Premium Travel", "Portfolio"] as const;

export function StepGoals({
  profile,
  onChange,
  onNext,
}: {
  profile: UserProfile;
  onChange: (updater: (p: UserProfile) => UserProfile) => void;
  onNext: () => void;
}) {
  const selectedIds = profile.goals.map((g) => g.id);
  const targetGoal = profile.goals.find((g) => g.id === "target_card");

  function toggleGoal(id: GoalId) {
    onChange((p) => {
      const exists = p.goals.some((g) => g.id === id);
      if (exists) {
        const filtered = p.goals.filter((g) => g.id !== id);
        return { ...p, goals: filtered.map((g, i) => ({ ...g, priority: i + 1 })) };
      }
      return { ...p, goals: [...p.goals, { id, priority: p.goals.length + 1 }] };
    });
  }

  return (
    <div>
      <StepHeading
        eyebrow="Goals"
        title="What are you trying to accomplish?"
        subtitle="Pick as many as apply. The first one you select becomes your top priority."
      />
      <div className="space-y-6">
        {GROUPS.map((group) => (
          <div key={group} className="space-y-2">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{group}</p>
            <div className="flex flex-wrap gap-2">
              {GOAL_DEFINITIONS.filter((g) => g.group === group).map((g) => {
                const idx = selectedIds.indexOf(g.id);
                const selected = idx !== -1;
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    aria-pressed={selected}
                    className={cn(
                      "flex items-center gap-2 rounded-[11px] border px-3.5 py-2 text-[13px] font-medium transition-[border-color,background-color,box-shadow]",
                      selected
                        ? "border-[var(--color-mint)] bg-[var(--color-accent-soft)] text-[var(--color-ink)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mint)_18%,transparent)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-ink-soft)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    {selected && (
                      <span className="figure flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] bg-[var(--color-ink)] px-1 text-[10px] font-bold text-[var(--color-mint)]">
                        {idx + 1}
                      </span>
                    )}
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {targetGoal && (
          <div className="space-y-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)]">
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Which card do you have in mind?</p>
            {targetGoal.targetCardId ? (
              <div className="flex items-center justify-between rounded-[12px] bg-[var(--color-bg-subtle)] px-3.5 py-2.5">
                <span className="text-[13.5px] font-medium">{getCard(targetGoal.targetCardId)?.name}</span>
                <button
                  onClick={() =>
                    onChange((p) => ({
                      ...p,
                      goals: p.goals.map((g) => (g.id === "target_card" ? { ...g, targetCardId: undefined } : g)),
                    }))
                  }
                  aria-label={`Remove ${getCard(targetGoal.targetCardId)?.name} as target card`}
                  className="text-[var(--color-ink-faint)] hover:text-[var(--color-danger)]"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <CardAutocomplete
                onSelect={(card) =>
                  onChange((p) => ({
                    ...p,
                    goals: p.goals.map((g) => (g.id === "target_card" ? { ...g, targetCardId: card.id } : g)),
                  }))
                }
              />
            )}
          </div>
        )}

        <Button size="lg" className="w-full" onClick={onNext} disabled={profile.goals.length === 0} iconRight={<ArrowRight size={17} />}>
          Continue
        </Button>
      </div>
    </div>
  );
}
