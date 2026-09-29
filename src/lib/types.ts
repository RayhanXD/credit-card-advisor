// Core data model for the credit-card strategy platform.
// Kept independent of any UI framework so the recommendation engine can be
// unit-tested and later swapped onto a real backend/API without touching components.

// ---------- User financial profile ----------

export type AgeRange = "18_20" | "21_24" | "25_34" | "35_44" | "45_54" | "55_64" | "65_plus";

export type EmploymentStatus =
  | "employed_full_time"
  | "employed_part_time"
  | "self_employed"
  | "student"
  | "unemployed"
  | "retired";

export type HousingStatus = "rent" | "own_with_mortgage" | "own_outright" | "live_with_family";

export type CreditScoreBand = "no_credit" | "poor" | "fair" | "good" | "very_good" | "excellent";

export const CREDIT_SCORE_BAND_RANGES: Record<CreditScoreBand, string> = {
  no_credit: "No credit history yet",
  poor: "300–579",
  fair: "580–669",
  good: "670–739",
  very_good: "740–799",
  excellent: "800–850",
};

export type AnnualFeeTolerance = "none" | "low" | "moderate" | "high";

export type UtilizationBand = "under_10" | "10_30" | "30_50" | "50_75" | "over_75";

export const UTILIZATION_BAND_RANGES: Record<UtilizationBand, string> = {
  under_10: "Under 10%",
  "10_30": "10–30%",
  "30_50": "30–50%",
  "50_75": "50–75%",
  over_75: "Over 75%",
};

export interface FinancialProfile {
  ageRange: AgeRange;
  employmentStatus: EmploymentStatus;
  annualIncome: number;
  housingStatus: HousingStatus;
  monthlyHousingPayment: number;
  monthlySpending: number;
  numOpenAccounts: number;
  creditAgeMonths: number;
  creditScoreBand: CreditScoreBand;
  estimatedScore?: number;
  utilization: UtilizationBand;
  recentApplications6mo: number;
  recentHardInquiries6mo: number;
  hasExistingLoans: boolean;
  loanTypes: string[];
  annualFeeTolerance: AnnualFeeTolerance;
}

export interface SpendingProfile {
  monthlyDining: number;
  monthlyGroceries: number;
  monthlyGas: number;
  monthlyTravel: number;
  monthlyOnline: number;
  monthlyOther: number;
}

export function totalMonthlySpend(s: SpendingProfile): number {
  return (
    s.monthlyDining + s.monthlyGroceries + s.monthlyGas + s.monthlyTravel + s.monthlyOnline + s.monthlyOther
  );
}

// ---------- Issuer relationships ----------

export interface IssuerRelationship {
  issuerId: string;
  checking: boolean;
  savings: boolean;
  investment: boolean;
}

export type IssuerRelationships = Record<string, IssuerRelationship>;

// ---------- Owned cards ----------

export interface OwnedCard {
  id: string;
  cardId: string;
  monthsOpen: number;
  creditLimit?: number;
  nickname?: string;
}

// ---------- Goals ----------

export type GoalId =
  | "build_credit"
  | "increase_approval_odds"
  | "establish_history"
  | "improve_profile"
  | "maximize_cashback"
  | "maximize_travel"
  | "airline_miles"
  | "hotel_points"
  | "maximize_everyday"
  | "lounge_access"
  | "travel_protections"
  | "premium_benefits"
  | "minimize_fees"
  | "maximize_groceries"
  | "maximize_dining"
  | "major_purchase"
  | "consolidate_cards"
  | "chase_ecosystem"
  | "target_card";

export interface GoalDefinition {
  id: GoalId;
  label: string;
  group: "Credit" | "Rewards" | "Premium Travel" | "Portfolio";
  description: string;
}

export interface UserGoal {
  id: GoalId;
  targetCardId?: string;
  priority: number;
}

// ---------- Travel preferences ----------

export type TravelFrequency = "rarely" | "few_times_year" | "monthly" | "weekly";
export type TravelScope = "mostly_domestic" | "mixed" | "mostly_international";
export type CabinPreference = "economy" | "premium_economy" | "business_first";

export interface TravelPreferences {
  homeAirport?: string;
  favoriteAirlines: string[];
  favoriteHotels: string[];
  travelFrequency: TravelFrequency;
  scope: TravelScope;
  cabinPreference: CabinPreference;
}

// ---------- User profile (aggregate) ----------

export interface UserProfile {
  id: string;
  name: string;
  financial: FinancialProfile;
  spending: SpendingProfile;
  issuerRelationships: IssuerRelationships;
  ownedCards: OwnedCard[];
  goals: UserGoal[];
  travel: TravelPreferences;
  onboardingComplete: boolean;
  createdAt: string;
  nextReviewDate: string;
}

// ---------- Card database ----------

export type RewardsCurrency =
  | "cashback"
  | "chase_ur"
  | "amex_mr"
  | "capital_one_miles"
  | "citi_thankyou"
  | "wells_fargo_rewards"
  | "usbank_points"
  | "discover_cashback";

export type CardCategory =
  | "cash_back"
  | "travel"
  | "premium_travel"
  | "business"
  | "student"
  | "hotel_cobrand"
  | "airline_cobrand"
  | "balance_transfer";

export interface RewardCategoryRate {
  category: string;
  multiplier: number;
  cap?: number;
  notes?: string;
}

export interface CardBenefit {
  label: string;
  description: string;
}

export interface WelcomeOffer {
  description: string;
  spendRequirement: number;
  timeframeMonths: number;
}

export interface EligibilityGuidance {
  minCreditScoreBand: CreditScoreBand;
  minCreditAgeMonths: number;
  maxRecentInquiries6mo: number;
  incomeGuidance: string;
  issuerRules: string[];
  notes: string;
}

export interface DataFreshness {
  lastVerified: string;
  source: string;
  confidence: "high" | "medium" | "low";
}

export interface CreditCardProduct {
  id: string;
  name: string;
  issuerId: string;
  network: "visa" | "mastercard" | "amex" | "discover";
  category: CardCategory[];
  annualFee: number;
  rewardsCurrency: RewardsCurrency;
  baseRewardRate: number;
  rewardCategories: RewardCategoryRate[];
  welcomeOffer: WelcomeOffer;
  benefits: CardBenefit[];
  loungeAccess: string[];
  travelProtections: string[];
  transferPartnerIds: string[];
  eligibility: EligibilityGuidance;
  productChangeTargets: string[];
  applicationUrl: string;
  dataFreshness: DataFreshness;
}

export interface Issuer {
  id: string;
  name: string;
  accentColor: string;
  applicationRules: string[];
  contact: {
    customerService: string;
    fraud: string;
    lostStolen: string;
    website: string;
  };
}

export interface TransferPartner {
  id: string;
  name: string;
  type: "airline" | "hotel";
  transfersFrom: { rewardsCurrency: RewardsCurrency; ratio: string }[];
}

// ---------- Recommendation engine outputs ----------

export interface ScoreBreakdown {
  creditProfileFit: number;
  goalAlignment: number;
  spendingMatch: number;
  issuerRelationship: number;
  portfolioCompatibility: number;
  timing: number;
  annualFeeFit: number;
  total: number;
}

export type FitLabel = "strong_fit" | "consider" | "not_recommended_now" | "wait";

export interface CardRecommendation {
  cardId: string;
  score: ScoreBreakdown;
  fitLabel: FitLabel;
  reasons: string[];
  cautions: string[];
  estimatedAnnualValue: number;
}

export interface JourneyStep {
  order: number;
  title: string;
  cardId?: string;
  description: string;
  reasons: string[];
  timing: "now" | "next" | "later";
}

export interface CardJourney {
  goalCardId: string;
  steps: JourneyStep[];
  estimatedTimelineMonths: number;
}

export type ReadinessStatus = "strong" | "moderate" | "developing" | "weak";

export interface ReadinessComponent {
  label: string;
  status: ReadinessStatus;
  explanation: string;
}

export interface ReadinessAssessment {
  cardId: string;
  overallPercent: number;
  components: ReadinessComponent[];
  summary: string;
}

export interface CreditHealthMetric {
  key: string;
  label: string;
  valuePercent: number;
  rawDisplay: string;
  status: "excellent" | "good" | "fair" | "poor";
  explanation: string;
  whyItMatters: string;
  howToImprove: string;
  timeframe: string;
}

export interface CreditHealthSnapshot {
  overallScore: number;
  metrics: CreditHealthMetric[];
}

export interface ImprovementRecommendation {
  id: string;
  issue: string;
  whyItMatters: string;
  action: string;
  expectedImpact: string;
  timeHorizon: string;
  priority: number;
}

export interface OptimizationInsight {
  id: string;
  type: "overlap" | "missing_category" | "unused_benefit" | "fee_review";
  title: string;
  description: string;
  cardIds: string[];
  suggestedAction: string;
}

export interface TimelineEntry {
  monthOffset: number;
  label: string;
  description: string;
}

export interface StrategySummary {
  headline: string;
  narrative: string;
  nextStepCardId?: string;
  timeline: TimelineEntry[];
}
