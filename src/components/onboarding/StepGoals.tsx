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
        eyebrow="Step 7 of 9"
        title="What are you trying to accomplish?"
        subtitle="Pick as many as apply. The first one you select becomes your top priority."
      />
      <div className="space-y-6">
        {GROUPS.map((group) => (
          <div key={group} className="space-y-2">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">{group}</p>
            <div className="flex flex-wrap gap-2">
              {GOAL_DEFINITIONS.filter((g) => g.group === group).map((g) => {
                const idx = selectedIds.indexOf(g.id);
                const selected = idx !== -1;
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                      selected
                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]"
                        : "border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
                    )}
                  >
                    {selected && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-bg)] text-[10px] font-bold text-[var(--color-ink)]">
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
          <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Which card do you have in mind?</p>
            {targetGoal.targetCardId ? (
              <div className="flex items-center justify-between rounded-lg bg-[var(--color-bg-elevated)] px-3.5 py-2.5">
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
