import type { CardJourney, JourneyStep, UserProfile } from "@/lib/types";
import { CARDS, getCard } from "@/data/cards";
import { getIssuer } from "@/data/issuers";
import { assessReadiness } from "@/lib/engine/readiness";
import { scoreAllCards } from "@/lib/engine/scoring";
import { bandRank } from "@/lib/utils";

export function buildCardJourney(profile: UserProfile, targetCardId: string): CardJourney | null {
  const target = getCard(targetCardId);
  if (!target) return null;

  const ownedIds = new Set(profile.ownedCards.map((oc) => oc.cardId));
  const readiness = assessReadiness(profile, targetCardId);
  if (!readiness) return null;

  if (ownedIds.has(targetCardId)) {
    return {
      goalCardId: targetCardId,
      steps: [
        {
          order: 1,
          title: "Already in your wallet",
          cardId: targetCardId,
          description: `You already hold ${target.name}. Focus on using its benefits fully and maintaining your account.`,
          reasons: [],
          timing: "now",
        },
      ],
      estimatedTimelineMonths: 0,
    };
  }

  const steps: JourneyStep[] = [];

  if (readiness.overallPercent >= 72) {
    steps.push({
      order: 1,
      title: "You're well-positioned",
      cardId: targetCardId,
      description: `Based on your current profile, ${target.name} looks like a reasonable next step to evaluate.`,
      reasons: readiness.components.filter((c) => c.status === "strong" || c.status === "moderate").map((c) => c.explanation),
      timing: "now",
    });
    return { goalCardId: targetCardId, steps, estimatedTimelineMonths: 0 };
  }

  // Find a stepping-stone card: prefer same issuer, lower eligibility bar, not already owned.
  const candidates = CARDS.filter(
    (c) =>
      c.id !== targetCardId &&
      !ownedIds.has(c.id) &&
      c.issuerId === target.issuerId &&
      bandRank(c.eligibility.minCreditScoreBand) < bandRank(target.eligibility.minCreditScoreBand)
  );

  let steppingStoneId: string | undefined;
  if (candidates.length > 0) {
    const scored = scoreAllCards(candidates, profile);
    steppingStoneId = scored[0]?.cardId;
  } else {
    const scoredAll = scoreAllCards(
      CARDS.filter((c) => !ownedIds.has(c.id) && c.id !== targetCardId),
      profile
    );
    steppingStoneId = scoredAll[0]?.cardId;
  }

  const steppingStone = steppingStoneId ? getCard(steppingStoneId) : undefined;

  if (steppingStone) {
    steps.push({
      order: 1,
      title: "Establish relationship",
      cardId: steppingStone.id,
      description: `Start with ${steppingStone.name} to build history${
        steppingStone.issuerId === target.issuerId ? ` with ${getIssuer(target.issuerId)?.name ?? target.issuerId}` : ""
      } while earning rewards along the way.`,
      reasons: [
        steppingStone.issuerId === target.issuerId
          ? "Establishes a relationship with the same issuer as your target card"
          : "Builds general credit history and payment track record",
        "Earns rewards while you build toward your goal",
        steppingStone.annualFee === 0 ? "No annual fee while your profile develops" : "Manageable annual fee for this stage",
      ],
      timing: "now",
    });
  }

  steps.push({
    order: steps.length + 1,
    title: "Build your profile",
    description: "Maintain low utilization, make on-time payments, and let your account history mature.",
    reasons: ["Low utilization and on-time payments are the two biggest levers for most credit scoring models", "Account age compounds — the earlier you start, the stronger this becomes"],
    timing: "next",
  });

  steps.push({
    order: steps.length + 1,
    title: "Reassess",
    description: `After a meaningful period, revisit your credit profile, account age, recent inquiries, income, and portfolio against ${target.name}'s typical expectations.`,
    reasons: ["Readiness shifts over time as your profile develops", "Reassessing avoids applying before you're well-positioned"],
    timing: "next",
  });

  steps.push({
    order: steps.length + 1,
    title: `Potential next move: ${target.name}`,
    cardId: targetCardId,
    description: readiness.summary,
    reasons: [],
    timing: "later",
  });

  const gapMonths = Math.max(0, target.eligibility.minCreditAgeMonths - profile.financial.creditAgeMonths);
  const estimatedTimelineMonths = Math.min(24, Math.max(6, gapMonths || 12));

  return { goalCardId: targetCardId, steps, estimatedTimelineMonths };
}
