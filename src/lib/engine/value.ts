import type { CreditCardProduct, RewardsCurrency, SpendingProfile } from "@/lib/types";
import { monthlySpendForCategory, totalMonthlySpend } from "@/lib/utils";

// Approximate cents-per-point redemption values used only to produce a rough,
// clearly-labeled "estimated annual value" for demo purposes. Real redemption
// value varies widely by how points are redeemed.
const PERCENT_STYLE_CURRENCIES: RewardsCurrency[] = ["cashback", "discover_cashback", "wells_fargo_rewards"];

const POINT_CENT_VALUE: Partial<Record<RewardsCurrency, number>> = {
  chase_ur: 1.25,
  amex_mr: 1.25,
  capital_one_miles: 1.1,
  citi_thankyou: 1.1,
  usbank_points: 1.1,
};

export interface CardValueEstimate {
  monthlyRewardsValue: number;
  annualRewardsValue: number;
  netAnnualValue: number; // rewards value minus annual fee
}

export function estimateCardValue(card: CreditCardProduct, spending: SpendingProfile): CardValueEstimate {
  const isPercentStyle = PERCENT_STYLE_CURRENCIES.includes(card.rewardsCurrency);
  const pointCentValue = POINT_CENT_VALUE[card.rewardsCurrency] ?? 1;

  const specificCategories = card.rewardCategories.filter((c) => c.category !== "everything");
  const everythingCategory = card.rewardCategories.find((c) => c.category === "everything");

  let claimedSpend = 0;
  let monthlyValue = 0;

  for (const rc of specificCategories) {
    const spend = monthlySpendForCategory(rc.category, spending);
    const cappedMonthlySpend = rc.cap ? Math.min(spend, rc.cap / 12) : spend;
    claimedSpend += spend;
    monthlyValue += categoryValue(cappedMonthlySpend, rc.multiplier, isPercentStyle, pointCentValue);
  }

  if (everythingCategory) {
    const remaining = Math.max(0, totalMonthlySpend(spending) - claimedSpend);
    monthlyValue += categoryValue(remaining, everythingCategory.multiplier, isPercentStyle, pointCentValue);
  } else if (specificCategories.length === 0 && card.baseRewardRate > 0) {
    monthlyValue += categoryValue(totalMonthlySpend(spending), card.baseRewardRate, isPercentStyle, pointCentValue);
  }

  const annualRewardsValue = monthlyValue * 12;
  return {
    monthlyRewardsValue: monthlyValue,
    annualRewardsValue,
    netAnnualValue: annualRewardsValue - card.annualFee,
  };
}

function categoryValue(monthlySpend: number, multiplier: number, isPercentStyle: boolean, pointCentValue: number): number {
  if (isPercentStyle) {
    return monthlySpend * (multiplier / 100);
  }
  return monthlySpend * multiplier * (pointCentValue / 100);
}
