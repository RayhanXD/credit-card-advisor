import type { OptimizationInsight, UserProfile } from "@/lib/types";
import { CARDS, getCard } from "@/data/cards";
import { estimateCardValue } from "@/lib/engine/value";
import { scoreAllCards } from "@/lib/engine/scoring";
import { monthlySpendForCategory } from "@/lib/utils";

const SPEND_CATEGORIES = ["dining", "groceries", "gas", "travel", "online_retail"];
const CATEGORY_LABEL: Record<string, string> = {
  dining: "dining",
  groceries: "groceries",
  gas: "gas",
  travel: "travel",
  online_retail: "online shopping",
};

export function buildPortfolioOptimization(profile: UserProfile): OptimizationInsight[] {
  const insights: OptimizationInsight[] = [];
  const owned = profile.ownedCards.map((oc) => ({ oc, card: getCard(oc.cardId) })).filter((x) => x.card);

  if (owned.length === 0) return insights;

  // 1. Overlap detection: multiple owned cards with strong rates in the same category.
  for (const category of SPEND_CATEGORIES) {
    const strong = owned.filter((o) => o.card!.rewardCategories.some((rc) => rc.category === category && rc.multiplier >= 2));
    if (strong.length >= 2) {
      const sorted = [...strong].sort(
        (a, b) =>
          Math.max(...b.card!.rewardCategories.filter((rc) => rc.category === category).map((rc) => rc.multiplier)) -
          Math.max(...a.card!.rewardCategories.filter((rc) => rc.category === category).map((rc) => rc.multiplier))
      );
      const best = sorted[0];
      const rest = sorted.slice(1);
      insights.push({
        id: `overlap_${category}`,
        type: "overlap",
        title: `Overlapping ${CATEGORY_LABEL[category] ?? category} rewards`,
        description: `${rest.map((r) => r.card!.name).join(" and ")} ${rest.length === 1 ? "earns" : "earn"} a similar rate on ${CATEGORY_LABEL[category] ?? category} as ${best.card!.name}, which earns the highest rate in your wallet for this category.`,
        cardIds: strong.map((s) => s.card!.id),
        suggestedAction: `Route your ${CATEGORY_LABEL[category] ?? category} spend to ${best.card!.name} for the strongest return, and consider whether the other card still earns its keep elsewhere.`,
      });
    }
  }

  // 2. Missing category: meaningful spend with no strong-earning owned card.
  for (const category of SPEND_CATEGORIES) {
    const monthlySpend = monthlySpendForCategory(category, profile.spending);
    if (monthlySpend < 150) continue;
    const covered = owned.some((o) => o.card!.rewardCategories.some((rc) => rc.category === category && rc.multiplier >= 2));
    if (covered) continue;

    const ownedIds = new Set(profile.ownedCards.map((oc) => oc.cardId));
    const candidates = CARDS.filter((c) => !ownedIds.has(c.id) && c.rewardCategories.some((rc) => rc.category === category && rc.multiplier >= 3));
    if (candidates.length === 0) continue;
    const best = scoreAllCards(candidates, profile)[0];
    const bestCard = getCard(best.cardId)!;

    insights.push({
      id: `gap_${category}`,
      type: "missing_category",
      title: `You're earning a base rate on ${CATEGORY_LABEL[category] ?? category}`,
      description: `You spend about $${Math.round(monthlySpend)}/month on ${CATEGORY_LABEL[category] ?? category}, but no card in your wallet earns an elevated rate there.`,
      cardIds: [],
      suggestedAction: `${bestCard.name} could meaningfully improve this — it's estimated to be a ${best.fitLabel === "strong_fit" ? "strong" : "reasonable"} fit for your overall profile too.`,
    });
  }

  // 3. Fee review: cards whose estimated net annual value is negative.
  for (const { card } of owned) {
    if (!card || card.annualFee === 0) continue;
    const { netAnnualValue } = estimateCardValue(card, profile.spending);
    if (netAnnualValue < 0) {
      insights.push({
        id: `fee_${card.id}`,
        type: "fee_review",
        title: `${card.name}'s fee may not be earning its keep`,
        description: `Based on your current spending pattern, the estimated rewards value from ${card.name} doesn't fully offset its $${card.annualFee} annual fee.`,
        cardIds: [card.id],
        suggestedAction:
          card.productChangeTargets.length > 0 || true
            ? `Consider whether you're using this card's other benefits (credits, protections, lounge access). If not, ask the issuer about a product change to a no-fee option, or reassess whether to keep the account open.`
            : `Reassess whether this card still fits your spending pattern.`,
      });
    }
  }

  // 4. Unused benefits (heuristic): premium travel cards with lounge access but low travel spend.
  for (const { card } of owned) {
    if (!card) continue;
    if (card.loungeAccess.length > 0 && profile.spending.monthlyTravel < 150) {
      insights.push({
        id: `unused_${card.id}`,
        type: "unused_benefit",
        title: `${card.name}'s travel benefits may be going unused`,
        description: `This card includes lounge access and travel-focused perks, but your stated travel spend is relatively low.`,
        cardIds: [card.id],
        suggestedAction: "If your travel patterns change, these benefits could become valuable — otherwise, weigh them against the annual fee.",
      });
    }
  }

  return insights;
}
