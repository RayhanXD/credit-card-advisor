import type { CreditHealthMetric, CreditHealthSnapshot, UserProfile, UtilizationBand } from "@/lib/types";
import { bandRank, clamp } from "@/lib/utils";

// This "Credit Health" score is a demo composite derived from the inputs the
// user provides during onboarding. It is a simplified educational proxy, not
// an actual FICO/VantageScore calculation, and should be labeled as such in the UI.

const UTILIZATION_PERCENT_MIDPOINT: Record<UtilizationBand, number> = {
  under_10: 5,
  "10_30": 20,
  "30_50": 40,
  "50_75": 62,
  over_75: 85,
};

function statusFromPercent(pct: number): "excellent" | "good" | "fair" | "poor" {
  if (pct >= 85) return "excellent";
  if (pct >= 65) return "good";
  if (pct >= 40) return "fair";
  return "poor";
}

export function buildCreditHealthSnapshot(profile: UserProfile): CreditHealthSnapshot {
  const bandScore = bandRank(profile.financial.creditScoreBand) * 20; // 0,20,40,60,80,100

  // Payment history is not directly collected; approximate from overall band
  // and recent inquiries, since missed payments would typically also depress
  // both. This is a proxy, clearly labeled to the user as such.
  const paymentHistoryPct = clamp(bandScore + 10 - profile.financial.recentHardInquiries6mo * 5, 0, 100);

  const utilPct = UTILIZATION_PERCENT_MIDPOINT[profile.financial.utilization];
  const utilizationScorePct = clamp(100 - utilPct, 0, 100);

  const ageMonths = profile.financial.creditAgeMonths;
  const accountAgePct = clamp(Math.round((ageMonths / 84) * 100), ageMonths === 0 ? 5 : 0, 100); // 7 years = full marks

  const inquiries = profile.financial.recentHardInquiries6mo;
  const inquiriesPct = clamp(100 - inquiries * 18, 0, 100);

  const mixCount = new Set([
    ...profile.ownedCards.map(() => "credit_card"),
    ...(profile.financial.hasExistingLoans ? profile.financial.loanTypes : []),
  ]).size;
  const creditMixPct = clamp(Math.round((mixCount / 4) * 100), 10, 100);

  const metrics: CreditHealthMetric[] = [
    {
      key: "payment_history",
      label: "Payment History",
      valuePercent: Math.round(paymentHistoryPct),
      rawDisplay: `${Math.round(paymentHistoryPct)}%`,
      status: statusFromPercent(paymentHistoryPct),
      explanation: "An estimate of how consistently accounts are paid on time.",
      whyItMatters: "Payment history is typically the single largest factor in most credit scoring models.",
      howToImprove: "Pay at least the minimum on every account by the due date, every time. Consider autopay for at least the minimum.",
      timeframe: "Positive history builds over many months; a single missed payment can weigh on scores for up to several years.",
    },
    {
      key: "utilization",
      label: "Utilization",
      valuePercent: Math.round(utilizationScorePct),
      rawDisplay: `~${utilPct}% of available credit used`,
      status: statusFromPercent(utilizationScorePct),
      explanation: "How much of your available revolving credit you're currently using, across all cards.",
      whyItMatters: "Lower utilization is generally associated with stronger scores — many models favor utilization under 30%, and under 10% is often considered excellent.",
      howToImprove: "Consider paying down balances before your statement closing date, or requesting a credit-limit increase, while continuing to make at least the required payments on time.",
      timeframe: "Utilization is a snapshot — improvements can reflect within a single billing cycle after it's reported.",
    },
    {
      key: "account_age",
      label: "Account Age",
      valuePercent: accountAgePct,
      rawDisplay: `${Math.round(ageMonths)} months`,
      status: statusFromPercent(accountAgePct),
      explanation: "The average age of your credit accounts, weighted toward your oldest account.",
      whyItMatters: "A longer credit history generally supports stronger scores, since it gives more evidence of responsible management over time.",
      howToImprove: "Avoid closing your oldest accounts unnecessarily, and let new accounts season before applying for more.",
      timeframe: "This factor only improves with time — there's no way to accelerate it beyond keeping old accounts open.",
    },
    {
      key: "recent_inquiries",
      label: "Recent Inquiries",
      valuePercent: Math.round(inquiriesPct),
      rawDisplay: `${inquiries} in the last 6 months`,
      status: statusFromPercent(inquiriesPct),
      explanation: "The number of hard credit inquiries from new applications in the last 6 months.",
      whyItMatters: "Each hard inquiry can cause a small, typically temporary dip, and several in a short window may signal higher risk to issuers.",
      howToImprove: "Space out new applications, and apply only when you have a clear reason and reasonable approval odds.",
      timeframe: "Inquiries typically matter most in the first 12 months and fall off credit reports entirely after 2 years.",
    },
    {
      key: "credit_mix",
      label: "Credit Mix",
      valuePercent: creditMixPct,
      rawDisplay: `${mixCount} account type${mixCount === 1 ? "" : "s"}`,
      status: statusFromPercent(creditMixPct),
      explanation: "The variety of account types you manage — credit cards, auto loans, student loans, mortgages, and so on.",
      whyItMatters: "A healthy mix can modestly help your score, though it's one of the smaller factors and shouldn't drive new borrowing decisions.",
      howToImprove: "Let your mix develop naturally through your financial life — don't take on debt solely to diversify account types.",
      timeframe: "Changes here reflect gradually as your broader financial life evolves.",
    },
  ];

  const overallScore = Math.round(
    metrics.reduce((sum, m) => sum + m.valuePercent, 0) / metrics.length
  );

  return { overallScore, metrics };
}
