import type {
  CreditCardProduct,
  CardRecommendation,
  FitLabel,
  ScoreBreakdown,
  UserProfile,
} from "@/lib/types";
import { getCard } from "@/data/cards";
import { getIssuer } from "@/data/issuers";
import { bandRank, clamp } from "@/lib/utils";
import { estimateCardValue } from "@/lib/engine/value";

const MAX = {
  creditProfileFit: 20,
  goalAlignment: 25,
  spendingMatch: 20,
  issuerRelationship: 12,
  portfolioCompatibility: 10,
  timing: 8,
  annualFeeFit: 5,
};

const GOAL_WEIGHT_BY_PRIORITY = (priority: number) => (priority === 1 ? 1 : priority === 2 ? 0.6 : 0.4);

function creditProfileFitScore(card: CreditCardProduct, profile: UserProfile): number {
  const userRank = bandRank(profile.financial.creditScoreBand);
  const requiredRank = bandRank(card.eligibility.minCreditScoreBand);
  const diff = userRank - requiredRank;
  let fraction: number;
  if (diff >= 2) fraction = 1;
  else if (diff === 1) fraction = 0.85;
  else if (diff === 0) fraction = 0.7;
  else if (diff === -1) fraction = 0.35;
  else fraction = 0.1;

  let score = MAX.creditProfileFit * fraction;
  if (profile.financial.creditAgeMonths < card.eligibility.minCreditAgeMonths) {
    score *= 0.8;
  }
  return clamp(score, 0, MAX.creditProfileFit);
}

function goalAlignmentScore(card: CreditCardProduct, profile: UserProfile): number {
  if (profile.goals.length === 0) return MAX.goalAlignment * 0.4;

  let weightedSum = 0;
  let weightTotal = 0;

  for (const goal of profile.goals) {
    const weight = GOAL_WEIGHT_BY_PRIORITY(goal.priority);
    weightTotal += weight;
    weightedSum += weight * goalFraction(card, profile, goal.id, goal.targetCardId);
  }

  const avgFraction = weightTotal > 0 ? weightedSum / weightTotal : 0.4;
  return clamp(MAX.goalAlignment * avgFraction, 0, MAX.goalAlignment);
}

function goalFraction(
  card: CreditCardProduct,
  profile: UserProfile,
  goalId: string,
  targetCardId?: string
): number {
  const hasCategory = (cat: string, minMultiplier = 3) =>
    card.rewardCategories.some((rc) => rc.category === cat && rc.multiplier >= minMultiplier);

  switch (goalId) {
    case "build_credit":
    case "establish_history":
    case "increase_approval_odds":
    case "improve_profile": {
      const simplicity = card.annualFee === 0 ? 1 : 0.4;
      const accessible = bandRank(card.eligibility.minCreditScoreBand) <= bandRank(profile.financial.creditScoreBand) + 1 ? 1 : 0.3;
      return (simplicity + accessible) / 2;
    }
    case "maximize_cashback":
      return card.rewardsCurrency === "cashback" || card.rewardsCurrency === "discover_cashback" || card.rewardsCurrency === "wells_fargo_rewards"
        ? Math.min(1, card.baseRewardRate / 2)
        : 0.15;
    case "maximize_everyday": {
      const strongCats = card.rewardCategories.filter((rc) => rc.multiplier >= 2).length;
      return Math.min(1, strongCats / 3);
    }
    case "maximize_dining":
      return hasCategory("dining") ? 1 : 0.2;
    case "maximize_groceries":
      return hasCategory("groceries") ? 1 : 0.2;
    case "maximize_travel":
      return card.category.includes("travel") || card.category.includes("premium_travel") ? 1 : card.transferPartnerIds.length > 0 ? 0.7 : 0.15;
    case "airline_miles":
      return card.transferPartnerIds.length > 0 ? 1 : 0.2;
    case "hotel_points":
      return card.transferPartnerIds.length > 0 ? 0.9 : card.category.includes("hotel_cobrand") ? 1 : 0.2;
    case "lounge_access":
      return card.loungeAccess.length > 0 ? 1 : 0.05;
    case "travel_protections":
      return card.travelProtections.length >= 3 ? 1 : card.travelProtections.length > 0 ? 0.5 : 0.1;
    case "premium_benefits":
      return card.category.includes("premium_travel") ? 1 : 0.2;
    case "minimize_fees":
      return card.annualFee === 0 ? 1 : card.annualFee <= 100 ? 0.5 : 0.1;
    case "major_purchase":
      return card.annualFee === 0 ? 0.7 : 0.5;
    case "consolidate_cards":
      return 0.3;
    case "chase_ecosystem":
      return card.issuerId === "chase" ? 1 : 0.1;
    case "target_card": {
      if (!targetCardId) return 0.4;
      if (card.id === targetCardId) return 1;
      const target = getCard(targetCardId);
      if (!target) return 0.4;
      if (card.issuerId === target.issuerId) {
        const isStepping = bandRank(card.eligibility.minCreditScoreBand) < bandRank(target.eligibility.minCreditScoreBand);
        return isStepping ? 0.9 : 0.5;
      }
      return 0.2;
    }
    default:
      return 0.4;
  }
}

function spendingMatchScore(card: CreditCardProduct, profile: UserProfile): number {
  const { netAnnualValue, annualRewardsValue } = estimateCardValue(card, profile.spending);
  if (annualRewardsValue <= 0) return MAX.spendingMatch * 0.15;
  // Scale: $250+ net annual value maps to full score; scales down from there.
  const fraction = clamp(netAnnualValue / 250, -0.2, 1);
  return clamp(MAX.spendingMatch * Math.max(fraction, 0.1), 0, MAX.spendingMatch);
}

function issuerRelationshipScore(card: CreditCardProduct, profile: UserProfile): number {
  const rel = profile.issuerRelationships[card.issuerId];
  let score = 0;
  if (rel?.checking) score += 5;
  if (rel?.savings) score += 3;
  if (rel?.investment) score += 4;
  const alreadyHoldsIssuerCard = profile.ownedCards.some((oc) => getCard(oc.cardId)?.issuerId === card.issuerId);
  if (alreadyHoldsIssuerCard) score += 4;
  return clamp(score, 0, MAX.issuerRelationship);
}

function portfolioCompatibilityScore(card: CreditCardProduct, profile: UserProfile): number {
  const ownedCards = profile.ownedCards.map((oc) => getCard(oc.cardId)).filter(Boolean) as CreditCardProduct[];
  if (ownedCards.length === 0) return MAX.portfolioCompatibility;

  const cardTopCategories = new Set(card.rewardCategories.filter((rc) => rc.multiplier >= 2).map((rc) => rc.category));
  let overlapCount = 0;
  let gapFillCount = 0;

  for (const cat of cardTopCategories) {
    const alreadyCovered = ownedCards.some((oc) => oc.rewardCategories.some((rc) => rc.category === cat && rc.multiplier >= 2));
    if (alreadyCovered) overlapCount++;
    else gapFillCount++;
  }

  const total = cardTopCategories.size || 1;
  const overlapPenalty = (overlapCount / total) * 6;
  const gapBonus = (gapFillCount / total) * 3;
  return clamp(MAX.portfolioCompatibility - overlapPenalty + gapBonus, 0, MAX.portfolioCompatibility);
}

function timingScore(profile: UserProfile): number {
  const inquiries = profile.financial.recentHardInquiries6mo;
  if (inquiries === 0) return MAX.timing;
  if (inquiries === 1) return MAX.timing * 0.75;
  if (inquiries === 2) return MAX.timing * 0.5;
  if (inquiries === 3) return MAX.timing * 0.25;
  return 0;
}

function annualFeeFitScore(card: CreditCardProduct, profile: UserProfile): number {
  if (card.annualFee === 0) return MAX.annualFeeFit;
  const tolerance = profile.financial.annualFeeTolerance;
  if (tolerance === "none") return 0;
  if (tolerance === "low") return card.annualFee <= 100 ? MAX.annualFeeFit : card.annualFee <= 150 ? MAX.annualFeeFit * 0.5 : 0;
  if (tolerance === "moderate") return card.annualFee <= 150 ? MAX.annualFeeFit : card.annualFee <= 400 ? MAX.annualFeeFit * 0.7 : MAX.annualFeeFit * 0.3;
  return card.annualFee <= 700 ? MAX.annualFeeFit : MAX.annualFeeFit * 0.5;
}

export function scoreCard(card: CreditCardProduct, profile: UserProfile): CardRecommendation {
  const creditProfileFit = Math.round(creditProfileFitScore(card, profile));
  const goalAlignment = Math.round(goalAlignmentScore(card, profile));
  const spendingMatch = Math.round(spendingMatchScore(card, profile));
  const issuerRelationship = Math.round(issuerRelationshipScore(card, profile));
  const portfolioCompatibility = Math.round(portfolioCompatibilityScore(card, profile));
  const timing = Math.round(timingScore(profile));
  const annualFeeFit = Math.round(annualFeeFitScore(card, profile));

  const total = clamp(
    creditProfileFit + goalAlignment + spendingMatch + issuerRelationship + portfolioCompatibility + timing + annualFeeFit,
    0,
    100
  );

  const score: ScoreBreakdown = {
    creditProfileFit,
    goalAlignment,
    spendingMatch,
    issuerRelationship,
    portfolioCompatibility,
    timing,
    annualFeeFit,
    total,
  };

  const severelyUnqualified = bandRank(profile.financial.creditScoreBand) <= bandRank(card.eligibility.minCreditScoreBand) - 2;

  let fitLabel: FitLabel;
  if (severelyUnqualified) fitLabel = "not_recommended_now";
  else if (total >= 75) fitLabel = "strong_fit";
  else if (total >= 55) fitLabel = "consider";
  else if (total >= 35) fitLabel = "wait";
  else fitLabel = "not_recommended_now";

  const { reasons, cautions } = buildExplanations(card, profile, score, severelyUnqualified);
  const { netAnnualValue } = estimateCardValue(card, profile.spending);

  return {
    cardId: card.id,
    score,
    fitLabel,
    reasons,
    cautions,
    estimatedAnnualValue: Math.round(netAnnualValue),
  };
}

function buildExplanations(
  card: CreditCardProduct,
  profile: UserProfile,
  score: ScoreBreakdown,
  severelyUnqualified: boolean
): { reasons: string[]; cautions: string[] } {
  const reasons: string[] = [];
  const cautions: string[] = [];

  if (score.creditProfileFit >= MAX.creditProfileFit * 0.7) reasons.push("Fits your current credit profile");
  else cautions.push("Your credit profile is below what this card typically requires");

  if (score.spendingMatch >= MAX.spendingMatch * 0.6) reasons.push("Matches your actual spending habits");
  if (score.issuerRelationship >= 8) reasons.push(`Builds on your existing ${getIssuer(card.issuerId)?.name ?? card.issuerId} relationship`);
  if (score.portfolioCompatibility >= MAX.portfolioCompatibility * 0.8) reasons.push("Avoids excessive overlap with your existing portfolio");
  else if (score.portfolioCompatibility < MAX.portfolioCompatibility * 0.4) cautions.push("Overlaps meaningfully with rewards you already earn on another card");

  if (score.goalAlignment >= MAX.goalAlignment * 0.7) reasons.push("Aligns with your stated goals");
  if (score.annualFeeFit < MAX.annualFeeFit * 0.5 && card.annualFee > 0) cautions.push("Annual fee may be higher than your stated tolerance");
  if (score.timing < MAX.timing * 0.5) cautions.push("Recent credit activity may affect approval odds right now");

  if (severelyUnqualified) cautions.push("Your current credit profile is meaningfully below this card's typical requirements");

  if (reasons.length === 0) reasons.push("A reasonable general-purpose option given your profile");

  return { reasons, cautions };
}

export function scoreAllCards(cards: CreditCardProduct[], profile: UserProfile): CardRecommendation[] {
  return cards.map((c) => scoreCard(c, profile)).sort((a, b) => b.score.total - a.score.total);
}
