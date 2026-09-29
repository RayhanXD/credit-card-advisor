"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { StepWelcome } from "@/components/onboarding/StepWelcome";
import { StepFinancial } from "@/components/onboarding/StepFinancial";
import { StepCreditProfile } from "@/components/onboarding/StepCreditProfile";
import { StepBanking } from "@/components/onboarding/StepBanking";
import { StepCards } from "@/components/onboarding/StepCards";
import { StepSpending } from "@/components/onboarding/StepSpending";
import { StepGoals } from "@/components/onboarding/StepGoals";
import { StepTravel } from "@/components/onboarding/StepTravel";
import { StepComplete } from "@/components/onboarding/StepComplete";
import { BLANK_PROFILE_TEMPLATE } from "@/data/personas";
import { getCard } from "@/data/cards";
import { useAppStore } from "@/lib/store";
import type { UserProfile } from "@/lib/types";

const STEP_KEYS = ["welcome", "financial", "credit", "banking", "cards", "spending", "goals", "travel", "complete"] as const;
type StepKey = (typeof STEP_KEYS)[number];

const TRAVEL_GOAL_IDS = ["maximize_travel", "airline_miles", "hotel_points", "lounge_access", "travel_protections", "premium_benefits", "chase_ecosystem"];

function isTravelRelevant(profile: UserProfile): boolean {
  if (profile.goals.some((g) => TRAVEL_GOAL_IDS.includes(g.id))) return true;
  const targetGoal = profile.goals.find((g) => g.id === "target_card" && g.targetCardId);
  if (targetGoal?.targetCardId) {
    const card = getCard(targetGoal.targetCardId);
    if (card?.category.includes("travel") || card?.category.includes("premium_travel")) return true;
  }
  return false;
}

export default function OnboardingPage() {
  const router = useRouter();
  const loadPersona = useAppStore((s) => s.loadPersona);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const startFreshOnboarding = useAppStore((s) => s.startFreshOnboarding);

  const [draft, setDraft] = useState<UserProfile>(() => BLANK_PROFILE_TEMPLATE());
  const [stepIdx, setStepIdx] = useState(0);

  const currentKey: StepKey = STEP_KEYS[stepIdx];

  function effectiveSteps(): StepKey[] {
    return isTravelRelevant(draft) ? [...STEP_KEYS] : STEP_KEYS.filter((k) => k !== "travel");
  }

  function goNext() {
    const steps = effectiveSteps();
    const pos = steps.indexOf(currentKey);
    setStepIdx(STEP_KEYS.indexOf(steps[Math.min(pos + 1, steps.length - 1)]));
  }

  function goBack() {
    const steps = effectiveSteps();
    const pos = steps.indexOf(currentKey);
    setStepIdx(STEP_KEYS.indexOf(steps[Math.max(pos - 1, 0)]));
  }

  function handleChange(updater: (p: UserProfile) => UserProfile) {
    setDraft((prev) => updater(prev));
  }

  function handleDemo(personaId: string) {
    loadPersona(personaId);
    router.push("/dashboard");
  }

  function handleStart() {
    startFreshOnboarding();
    setDraft(BLANK_PROFILE_TEMPLATE());
    setStepIdx(1);
  }

  function handleFinish() {
    updateProfile(() => draft);
    completeOnboarding();
    router.push("/dashboard");
  }

  const steps = effectiveSteps();
  const totalSteps = steps.length;
  const displayIndex = steps.indexOf(currentKey);

  return (
    <OnboardingShell stepIndex={displayIndex} totalSteps={totalSteps} onBack={goBack} showBack={currentKey !== "welcome"} wide={currentKey === "complete"}>
      {currentKey === "welcome" && <StepWelcome onStart={handleStart} onDemo={handleDemo} />}
      {currentKey === "financial" && <StepFinancial profile={draft} onChange={handleChange} onNext={goNext} />}
      {currentKey === "credit" && <StepCreditProfile profile={draft} onChange={handleChange} onNext={goNext} />}
      {currentKey === "banking" && <StepBanking profile={draft} onChange={handleChange} onNext={goNext} />}
      {currentKey === "cards" && <StepCards profile={draft} onChange={handleChange} onNext={goNext} />}
      {currentKey === "spending" && <StepSpending profile={draft} onChange={handleChange} onNext={goNext} />}
      {currentKey === "goals" && <StepGoals profile={draft} onChange={handleChange} onNext={goNext} />}
      {currentKey === "travel" && <StepTravel profile={draft} onChange={handleChange} onNext={goNext} />}
      {currentKey === "complete" && <StepComplete profile={draft} onFinish={handleFinish} />}
    </OnboardingShell>
  );
}
