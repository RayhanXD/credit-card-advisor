import type { ImprovementRecommendation, UserProfile } from "@/lib/types";
import { buildCreditHealthSnapshot } from "@/lib/engine/creditHealth";

export function buildImprovementRecommendations(profile: UserProfile): ImprovementRecommendation[] {
  const snapshot = buildCreditHealthSnapshot(profile);
  const recs: ImprovementRecommendation[] = [];

  const byKey = Object.fromEntries(snapshot.metrics.map((m) => [m.key, m]));

  if (byKey.utilization.status === "fair" || byKey.utilization.status === "poor") {
    recs.push({
      id: "reduce_utilization",
      issue: `Your utilization is higher than we'd prefer (${byKey.utilization.rawDisplay}).`,
      whyItMatters: "Utilization is one of the most influential factors in most credit scoring models, and lower is generally better.",
      action: "Consider reducing reported balances before your statement closing date, while continuing to make at least the required payments on time. Requesting a credit-limit increase on an existing card can also help, if you won't be tempted to spend more.",
      expectedImpact: "Meaningful positive impact for most profiles — this is often the single highest-leverage improvement available.",
      timeHorizon: "Can reflect within 1 billing cycle once a lower balance is reported.",
      priority: 1,
    });
  }

  if (byKey.recent_inquiries.status === "fair" || byKey.recent_inquiries.status === "poor") {
    recs.push({
      id: "pause_applications",
      issue: `You have ${profile.financial.recentHardInquiries6mo} recent hard inquiries.`,
      whyItMatters: "Multiple inquiries in a short window can signal elevated risk to issuers and may modestly lower your score.",
      action: "Consider pausing new credit applications for a few months to let recent inquiries age and your profile stabilize.",
      expectedImpact: "Small direct score impact, but meaningfully improves approval odds on your next application.",
      timeHorizon: "Inquiries typically matter most for about 12 months, and drop off entirely after 2 years.",
      priority: 2,
    });
  }

  if (byKey.account_age.status === "fair" || byKey.account_age.status === "poor") {
    recs.push({
      id: "let_accounts_mature",
      issue: "Your average account age is still developing.",
      whyItMatters: "A longer credit history generally supports stronger scores, since it shows a longer track record of management.",
      action: "Avoid unnecessarily closing older accounts, and allow existing accounts to mature when appropriate rather than opening several new ones in a short period.",
      expectedImpact: "Gradual, compounding positive impact over time.",
      timeHorizon: "This factor improves only with time — typically visible over 12+ months.",
      priority: 3,
    });
  }

  if (byKey.credit_mix.status === "fair" || byKey.credit_mix.status === "poor") {
    recs.push({
      id: "diversify_naturally",
      issue: "Your credit mix is relatively narrow right now.",
      whyItMatters: "A healthy variety of account types can modestly help your score, though it's a smaller factor than utilization or payment history.",
      action: "Let your account mix develop naturally through your financial life. This isn't a reason to take on debt you don't otherwise need.",
      expectedImpact: "Small positive impact — treat this as a secondary consideration.",
      timeHorizon: "Reflects gradually as your broader financial picture evolves.",
      priority: 4,
    });
  }

  if (profile.financial.numOpenAccounts === 0) {
    recs.push({
      id: "establish_first_account",
      issue: "You don't yet have an open credit account.",
      whyItMatters: "Without an active account, there's no history for credit scoring models to evaluate.",
      action: "Consider a starter card suited to building history — often a secured card, a student card, or a low-limit unsecured card.",
      expectedImpact: "Establishes the foundation every other improvement builds on.",
      timeHorizon: "A credit file typically becomes scoreable after roughly 6 months of reported history.",
      priority: 1,
    });
  }

  return recs.sort((a, b) => a.priority - b.priority);
}
