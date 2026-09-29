import type { TimelineEntry, UserProfile } from "@/lib/types";
import { getCard } from "@/data/cards";
import { buildImprovementRecommendations } from "@/lib/engine/improvements";

export function buildStrategyTimeline(profile: UserProfile, topRecommendationCardId?: string, targetCardId?: string): TimelineEntry[] {
  const improvements = buildImprovementRecommendations(profile);
  const topIssue = improvements[0];
  const topCard = topRecommendationCardId ? getCard(topRecommendationCardId) : undefined;
  const targetCard = targetCardId ? getCard(targetCardId) : undefined;

  const entries: TimelineEntry[] = [
    {
      monthOffset: 0,
      label: "Today",
      description: `${profile.ownedCards.length} card${profile.ownedCards.length === 1 ? "" : "s"} in your wallet, ${
        profile.financial.creditAgeMonths
      } months of credit history.`,
    },
    {
      monthOffset: 3,
      label: "Month 3",
      description: topIssue ? topIssue.action : "Maintain low utilization and on-time payments across every account.",
    },
    {
      monthOffset: 6,
      label: "Month 6",
      description: topCard ? `Evaluate ${topCard.name} as your next card.` : "Evaluate whether a new card opportunity fits your profile.",
    },
    {
      monthOffset: 12,
      label: "Month 12",
      description: targetCard
        ? `Reassess your profile against ${targetCard.name}'s typical requirements.`
        : "Reassess your full portfolio for overlap, unused benefits, and fee efficiency.",
    },
    {
      monthOffset: 18,
      label: "Month 18",
      description: targetCard ? `Evaluate readiness for ${targetCard.name}.` : "Review annual fees against the value you're actually getting.",
    },
    {
      monthOffset: 24,
      label: "Month 24",
      description: "Optimize your full portfolio — confirm every card still earns its keep.",
    },
  ];

  return entries;
}
