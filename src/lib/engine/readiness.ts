import type { ReadinessAssessment, ReadinessComponent, ReadinessStatus, UserProfile } from "@/lib/types";
import { getCard } from "@/data/cards";
import { getIssuer } from "@/data/issuers";
import { bandRank, clamp } from "@/lib/utils";

const STATUS_SCORE: Record<ReadinessStatus, number> = {
  strong: 100,
  moderate: 70,
  developing: 45,
  weak: 20,
};

export function assessReadiness(profile: UserProfile, targetCardId: string): ReadinessAssessment | null {
  const card = getCard(targetCardId);
  if (!card) return null;

  const components: ReadinessComponent[] = [];

  // Credit profile
  const rankDiff = bandRank(profile.financial.creditScoreBand) - bandRank(card.eligibility.minCreditScoreBand);
  components.push({
    label: "Credit profile",
    status: rankDiff >= 2 ? "strong" : rankDiff >= 0 ? "moderate" : rankDiff >= -1 ? "developing" : "weak",
    explanation:
      rankDiff >= 2
        ? "Your credit standing is comfortably above what this card typically requires."
        : rankDiff >= 0
        ? "Your credit standing is roughly in line with what this card typically requires."
        : "Your credit standing is currently below what this card typically requires.",
  });

  // Account age
  const ageRatio = card.eligibility.minCreditAgeMonths > 0 ? profile.financial.creditAgeMonths / card.eligibility.minCreditAgeMonths : 2;
  components.push({
    label: "Account age",
    status: ageRatio >= 1.5 ? "strong" : ageRatio >= 1 ? "moderate" : ageRatio >= 0.5 ? "developing" : "weak",
    explanation:
      ageRatio >= 1.5
        ? "Your credit history is well-established relative to this card's typical expectations."
        : ageRatio >= 1
        ? "Your credit history length is roughly at the level this card typically expects."
        : "Your credit history is still developing relative to this card's typical expectations.",
  });

  // Recent inquiries
  const inquiries = profile.financial.recentHardInquiries6mo;
  components.push({
    label: "Recent inquiries",
    status: inquiries === 0 ? "strong" : inquiries === 1 ? "moderate" : inquiries <= 2 ? "developing" : "weak",
    explanation:
      inquiries === 0
        ? "You have no recent hard inquiries, which issuers generally view favorably."
        : inquiries <= 2
        ? "You have a moderate number of recent hard inquiries."
        : "You have several recent hard inquiries, which can weigh on new applications.",
  });

  // Existing issuer relationship
  const rel = profile.issuerRelationships[card.issuerId];
  const ownsIssuerCard = profile.ownedCards.some((oc) => getCard(oc.cardId)?.issuerId === card.issuerId);
  const hasBanking = !!(rel?.checking || rel?.savings || rel?.investment);
  const issuerLabel = getIssuer(card.issuerId)?.name ?? card.issuerId.replace(/_/g, " ");
  components.push({
    label: `Existing ${issuerLabel} relationship`,
    status: ownsIssuerCard && hasBanking ? "strong" : ownsIssuerCard || hasBanking ? "moderate" : "developing",
    explanation:
      ownsIssuerCard && hasBanking
        ? `You have both a banking and credit relationship with this issuer.`
        : ownsIssuerCard || hasBanking
        ? `You have some existing relationship with this issuer.`
        : `You don't yet have a relationship with this issuer.`,
  });

  // Income
  const feeCategory = card.annualFee >= 300 ? "premium" : card.annualFee >= 90 ? "mid" : "entry";
  const incomeThresholds = { premium: [75000, 45000], mid: [45000, 28000], entry: [30000, 18000] }[feeCategory];
  const income = profile.financial.annualIncome;
  components.push({
    label: "Income",
    status: income >= incomeThresholds[0] ? "strong" : income >= incomeThresholds[1] ? "moderate" : "developing",
    explanation:
      income >= incomeThresholds[0]
        ? "Your stated income comfortably supports this card's typical profile."
        : income >= incomeThresholds[1]
        ? "Your stated income is generally in range for this card, though issuers weigh this alongside other factors."
        : "Your stated income is on the lower end of what this card's typical applicant profile shows.",
  });

  // Current portfolio
  const portfolioStrength = profile.ownedCards.length >= 2 ? "strong" : profile.ownedCards.length === 1 ? "moderate" : "developing";
  components.push({
    label: "Current portfolio",
    status: portfolioStrength,
    explanation:
      portfolioStrength === "strong"
        ? "You've managed multiple accounts, which demonstrates experience issuers like to see."
        : portfolioStrength === "moderate"
        ? "You have some account management experience, with room to build further."
        : "You have limited account history so far.",
  });

  const overallPercent = clamp(
    Math.round(components.reduce((sum, c) => sum + STATUS_SCORE[c.status], 0) / components.length),
    0,
    100
  );

  const summary =
    overallPercent >= 75
      ? `Your positioning for ${card.name} looks strong. This is not an approval guarantee, but your profile aligns well with what this card typically expects.`
      : overallPercent >= 50
      ? `You're developing well toward ${card.name}, but an intermediate step may strengthen your approval odds before applying.`
      : `We'd recommend building your profile further before applying for ${card.name}.`;

  return { cardId: targetCardId, overallPercent, components, summary };
}
