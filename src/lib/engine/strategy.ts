import type { CardJourney, CardRecommendation, ReadinessAssessment, StrategySummary, UserProfile } from "@/lib/types";
import { CARDS, getCard } from "@/data/cards";
import { scoreAllCards } from "@/lib/engine/scoring";
import { buildCardJourney } from "@/lib/engine/journey";
import { assessReadiness } from "@/lib/engine/readiness";
import { buildStrategyTimeline } from "@/lib/engine/timeline";
import { getGoalDefinition } from "@/data/goals";

export interface FullStrategy {
  topRecommendation: CardRecommendation | null;
  allRecommendations: CardRecommendation[];
  journey: CardJourney | null;
  readiness: ReadinessAssessment | null;
  summary: StrategySummary;
  primaryGoalLabel: string;
}

export function computeFullStrategy(profile: UserProfile): FullStrategy {
  const ownedIds = new Set(profile.ownedCards.map((oc) => oc.cardId));
  const candidateCards = CARDS.filter((c) => !ownedIds.has(c.id));
  const allRecommendations = scoreAllCards(candidateCards, profile);
  const topRecommendation = allRecommendations[0] ?? null;

  const primaryGoal = [...profile.goals].sort((a, b) => a.priority - b.priority)[0];
  const primaryGoalDef = primaryGoal ? getGoalDefinition(primaryGoal.id) : undefined;
  const primaryGoalLabel = primaryGoalDef?.label ?? "Build my credit card strategy";

  let journey: CardJourney | null = null;
  let readiness: ReadinessAssessment | null = null;

  if (primaryGoal?.id === "target_card" && primaryGoal.targetCardId) {
    journey = buildCardJourney(profile, primaryGoal.targetCardId);
    readiness = assessReadiness(profile, primaryGoal.targetCardId);
  }

  const targetCard = primaryGoal?.targetCardId ? getCard(primaryGoal.targetCardId) : undefined;
  const nextStepCardId = journey?.steps.find((s) => s.timing === "now")?.cardId ?? topRecommendation?.cardId;
  const nextStepCard = nextStepCardId ? getCard(nextStepCardId) : undefined;

  const headline = targetCard ? `Build toward ${targetCard.name}` : primaryGoalLabel;

  const narrative = buildNarrative(profile, primaryGoalLabel, nextStepCard?.name, targetCard?.name, readiness?.overallPercent);

  const timeline = buildStrategyTimeline(profile, nextStepCardId, primaryGoal?.targetCardId);

  return {
    topRecommendation,
    allRecommendations,
    journey,
    readiness,
    primaryGoalLabel,
    summary: { headline, narrative, nextStepCardId, timeline },
  };
}

function buildNarrative(
  profile: UserProfile,
  goalLabel: string,
  nextCardName?: string,
  targetCardName?: string,
  readinessPercent?: number
): string {
  const parts: string[] = [];
  parts.push(`Your stated priority right now is to ${goalLabel.toLowerCase()}.`);

  if (targetCardName && readinessPercent !== undefined) {
    if (readinessPercent >= 72) {
      parts.push(`Based on your current profile, you're well-positioned to evaluate ${targetCardName} directly.`);
    } else {
      parts.push(
        `Based on your current profile, we'd suggest an intermediate step before ${targetCardName} rather than applying right away.`
      );
    }
  }

  if (nextCardName) {
    parts.push(`Your recommended next step is ${nextCardName}.`);
  }

  parts.push("This reflects your credit profile, existing cards, spending, and goals — not a guarantee of approval.");

  return parts.join(" ");
}
