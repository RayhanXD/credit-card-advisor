import { type ClassValue, clsx } from "clsx";
import type { CreditScoreBand, SpendingProfile } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number, opts: { cents?: boolean } = {}): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts.cents ? 2 : 0,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const BAND_RANK: Record<CreditScoreBand, number> = {
  no_credit: 0,
  poor: 1,
  fair: 2,
  good: 3,
  very_good: 4,
  excellent: 5,
};

export function bandRank(band: CreditScoreBand): number {
  return BAND_RANK[band];
}

export const BAND_LABELS: Record<CreditScoreBand, string> = {
  no_credit: "No credit history",
  poor: "Poor",
  fair: "Fair",
  good: "Good",
  very_good: "Very Good",
  excellent: "Excellent",
};

export function totalMonthlySpend(s: SpendingProfile): number {
  return s.monthlyDining + s.monthlyGroceries + s.monthlyGas + s.monthlyTravel + s.monthlyOnline + s.monthlyOther;
}

const CATEGORY_TO_SPEND_KEY: Record<string, keyof SpendingProfile | "everything"> = {
  everything: "everything",
  dining: "monthlyDining",
  groceries: "monthlyGroceries",
  gas: "monthlyGas",
  travel: "monthlyTravel",
  travel_via_portal: "monthlyTravel",
  flights: "monthlyTravel",
  flights_via_portal: "monthlyTravel",
  hotels_via_portal: "monthlyTravel",
  hotels_rental_cars_via_portal: "monthlyTravel",
  flights_hotels_via_portal: "monthlyTravel",
  travel_and_mobile_wallet: "monthlyTravel",
  online_retail: "monthlyOnline",
  streaming: "monthlyOther",
  entertainment: "monthlyOther",
  drugstore: "monthlyOther",
  rotating: "monthlyOther",
  top_spend_category: "monthlyOther",
  choice_category: "monthlyOther",
};

export function monthlySpendForCategory(category: string, spending: SpendingProfile): number {
  const key = CATEGORY_TO_SPEND_KEY[category];
  if (!key) return 0;
  if (key === "everything") return totalMonthlySpend(spending);
  return spending[key];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function relativeTimeFromMonths(months: number): string {
  if (months < 1) return "brand new";
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem === 0 ? `${years} yr` : `${years} yr ${rem} mo`;
}
