import type { UserProfile } from "@/lib/types";

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function monthsAgoISO(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString();
}

const emptyRelationships = {
  chase: { issuerId: "chase", checking: false, savings: false, investment: false },
  capital_one: { issuerId: "capital_one", checking: false, savings: false, investment: false },
  amex: { issuerId: "amex", checking: false, savings: false, investment: false },
  citi: { issuerId: "citi", checking: false, savings: false, investment: false },
  bank_of_america: { issuerId: "bank_of_america", checking: false, savings: false, investment: false },
  wells_fargo: { issuerId: "wells_fargo", checking: false, savings: false, investment: false },
  us_bank: { issuerId: "us_bank", checking: false, savings: false, investment: false },
  discover: { issuerId: "discover", checking: false, savings: false, investment: false },
};

// ---------------- Persona 1: First-time card seeker ----------------
const maya: UserProfile = {
  id: "persona_maya",
  name: "Maya Chen",
  createdAt: monthsAgoISO(0),
  onboardingComplete: true,
  nextReviewDate: daysFromNow(90),
  financial: {
    ageRange: "21_24",
    employmentStatus: "employed_full_time",
    annualIncome: 48000,
    housingStatus: "rent",
    monthlyHousingPayment: 1400,
    monthlySpending: 2100,
    numOpenAccounts: 0,
    creditAgeMonths: 0,
    creditScoreBand: "no_credit",
    utilization: "under_10",
    recentApplications6mo: 0,
    recentHardInquiries6mo: 0,
    hasExistingLoans: false,
    loanTypes: [],
    annualFeeTolerance: "none",
  },
  spending: {
    monthlyDining: 300,
    monthlyGroceries: 350,
    monthlyGas: 120,
    monthlyTravel: 80,
    monthlyOnline: 200,
    monthlyOther: 250,
  },
  issuerRelationships: {
    ...emptyRelationships,
    chase: { issuerId: "chase", checking: true, savings: true, investment: false },
  },
  ownedCards: [],
  goals: [{ id: "build_credit", priority: 1 }],
  travel: {
    favoriteAirlines: [],
    favoriteHotels: [],
    travelFrequency: "rarely",
    scope: "mostly_domestic",
    cabinPreference: "economy",
  },
};

// ---------------- Persona 2: Student building toward Venture X ----------------
const jordan: UserProfile = {
  id: "persona_jordan",
  name: "Jordan Patel",
  createdAt: monthsAgoISO(0),
  onboardingComplete: true,
  nextReviewDate: daysFromNow(120),
  financial: {
    ageRange: "18_20",
    employmentStatus: "student",
    annualIncome: 14000,
    housingStatus: "live_with_family",
    monthlyHousingPayment: 0,
    monthlySpending: 650,
    numOpenAccounts: 1,
    creditAgeMonths: 8,
    creditScoreBand: "fair",
    estimatedScore: 660,
    utilization: "30_50",
    recentApplications6mo: 1,
    recentHardInquiries6mo: 1,
    hasExistingLoans: true,
    loanTypes: ["student"],
    annualFeeTolerance: "none",
  },
  spending: {
    monthlyDining: 150,
    monthlyGroceries: 120,
    monthlyGas: 60,
    monthlyTravel: 40,
    monthlyOnline: 150,
    monthlyOther: 130,
  },
  issuerRelationships: {
    ...emptyRelationships,
    capital_one: { issuerId: "capital_one", checking: true, savings: false, investment: false },
  },
  ownedCards: [{ id: "owned_1", cardId: "discover_it_student_cash_back", monthsOpen: 8, creditLimit: 1500 }],
  goals: [
    { id: "target_card", targetCardId: "capital_one_venture_x", priority: 1 },
    { id: "build_credit", priority: 2 },
  ],
  travel: {
    favoriteAirlines: ["United"],
    favoriteHotels: [],
    travelFrequency: "rarely",
    scope: "mostly_domestic",
    cabinPreference: "economy",
  },
};

// ---------------- Persona 3: Cash-back optimizer ----------------
const priya: UserProfile = {
  id: "persona_priya",
  name: "Priya Nair",
  createdAt: monthsAgoISO(0),
  onboardingComplete: true,
  nextReviewDate: daysFromNow(150),
  financial: {
    ageRange: "25_34",
    employmentStatus: "employed_full_time",
    annualIncome: 82000,
    housingStatus: "rent",
    monthlyHousingPayment: 1900,
    monthlySpending: 3400,
    numOpenAccounts: 2,
    creditAgeMonths: 54,
    creditScoreBand: "very_good",
    estimatedScore: 760,
    utilization: "under_10",
    recentApplications6mo: 0,
    recentHardInquiries6mo: 0,
    hasExistingLoans: true,
    loanTypes: ["auto"],
    annualFeeTolerance: "low",
  },
  spending: {
    monthlyDining: 450,
    monthlyGroceries: 600,
    monthlyGas: 160,
    monthlyTravel: 100,
    monthlyOnline: 350,
    monthlyOther: 300,
  },
  issuerRelationships: {
    ...emptyRelationships,
    wells_fargo: { issuerId: "wells_fargo", checking: true, savings: true, investment: false },
    citi: { issuerId: "citi", checking: false, savings: false, investment: false },
  },
  ownedCards: [
    { id: "owned_1", cardId: "wells_fargo_active_cash", monthsOpen: 54, creditLimit: 8000 },
    { id: "owned_2", cardId: "citi_double_cash", monthsOpen: 30, creditLimit: 6000 },
  ],
  goals: [
    { id: "maximize_cashback", priority: 1 },
    { id: "maximize_groceries", priority: 2 },
  ],
  travel: {
    favoriteAirlines: [],
    favoriteHotels: [],
    travelFrequency: "rarely",
    scope: "mostly_domestic",
    cabinPreference: "economy",
  },
};

// ---------------- Persona 4: Frequent traveler ----------------
const daniel: UserProfile = {
  id: "persona_daniel",
  name: "Daniel Osei",
  createdAt: monthsAgoISO(0),
  onboardingComplete: true,
  nextReviewDate: daysFromNow(60),
  financial: {
    ageRange: "35_44",
    employmentStatus: "employed_full_time",
    annualIncome: 145000,
    housingStatus: "own_with_mortgage",
    monthlyHousingPayment: 2800,
    monthlySpending: 5200,
    numOpenAccounts: 3,
    creditAgeMonths: 132,
    creditScoreBand: "excellent",
    estimatedScore: 800,
    utilization: "under_10",
    recentApplications6mo: 1,
    recentHardInquiries6mo: 1,
    hasExistingLoans: true,
    loanTypes: ["mortgage"],
    annualFeeTolerance: "high",
  },
  spending: {
    monthlyDining: 700,
    monthlyGroceries: 500,
    monthlyGas: 150,
    monthlyTravel: 900,
    monthlyOnline: 400,
    monthlyOther: 400,
  },
  issuerRelationships: {
    ...emptyRelationships,
    chase: { issuerId: "chase", checking: true, savings: true, investment: true },
    amex: { issuerId: "amex", checking: false, savings: false, investment: false },
  },
  ownedCards: [
    { id: "owned_1", cardId: "chase_sapphire_preferred", monthsOpen: 40, creditLimit: 15000 },
    { id: "owned_2", cardId: "chase_freedom_unlimited", monthsOpen: 60, creditLimit: 12000 },
    { id: "owned_3", cardId: "amex_gold", monthsOpen: 14, creditLimit: 20000 },
  ],
  goals: [
    { id: "premium_benefits", priority: 1 },
    { id: "lounge_access", priority: 2 },
    { id: "airline_miles", priority: 3 },
  ],
  travel: {
    homeAirport: "SFO",
    favoriteAirlines: ["United", "Air France", "Virgin Atlantic"],
    favoriteHotels: ["Marriott Bonvoy", "Hyatt"],
    travelFrequency: "monthly",
    scope: "mixed",
    cabinPreference: "premium_economy",
  },
};

// ---------------- Persona 5: Existing 5-card wallet, wants optimization ----------------
const samuel: UserProfile = {
  id: "persona_samuel",
  name: "Samuel Ortiz",
  createdAt: monthsAgoISO(0),
  onboardingComplete: true,
  nextReviewDate: daysFromNow(30),
  financial: {
    ageRange: "45_54",
    employmentStatus: "self_employed",
    annualIncome: 168000,
    housingStatus: "own_outright",
    monthlyHousingPayment: 0,
    monthlySpending: 6100,
    numOpenAccounts: 5,
    creditAgeMonths: 210,
    creditScoreBand: "excellent",
    estimatedScore: 815,
    utilization: "10_30",
    recentApplications6mo: 0,
    recentHardInquiries6mo: 0,
    hasExistingLoans: false,
    loanTypes: [],
    annualFeeTolerance: "high",
  },
  spending: {
    monthlyDining: 600,
    monthlyGroceries: 700,
    monthlyGas: 100,
    monthlyTravel: 500,
    monthlyOnline: 600,
    monthlyOther: 500,
  },
  issuerRelationships: {
    ...emptyRelationships,
    chase: { issuerId: "chase", checking: true, savings: true, investment: false },
    capital_one: { issuerId: "capital_one", checking: false, savings: false, investment: false },
    amex: { issuerId: "amex", checking: false, savings: false, investment: false },
    citi: { issuerId: "citi", checking: false, savings: false, investment: false },
  },
  ownedCards: [
    { id: "owned_1", cardId: "chase_sapphire_reserve", monthsOpen: 48, creditLimit: 25000 },
    { id: "owned_2", cardId: "chase_freedom_flex", monthsOpen: 80, creditLimit: 10000 },
    { id: "owned_3", cardId: "capital_one_venture", monthsOpen: 36, creditLimit: 18000 },
    { id: "owned_4", cardId: "citi_double_cash", monthsOpen: 100, creditLimit: 9000 },
    { id: "owned_5", cardId: "amex_blue_cash_preferred", monthsOpen: 24, creditLimit: 12000 },
  ],
  goals: [
    { id: "consolidate_cards", priority: 1 },
    { id: "minimize_fees", priority: 2 },
  ],
  travel: {
    homeAirport: "ORD",
    favoriteAirlines: ["United"],
    favoriteHotels: ["Hyatt", "Marriott Bonvoy"],
    travelFrequency: "few_times_year",
    scope: "mixed",
    cabinPreference: "business_first",
  },
};

export const DEMO_PERSONAS: UserProfile[] = [maya, jordan, priya, daniel, samuel];

export function getPersona(id: string): UserProfile | undefined {
  return DEMO_PERSONAS.find((p) => p.id === id);
}

export const BLANK_PROFILE_TEMPLATE = (): UserProfile => ({
  id: `user_${Date.now()}`,
  name: "",
  createdAt: new Date().toISOString(),
  onboardingComplete: false,
  nextReviewDate: daysFromNow(90),
  financial: {
    ageRange: "25_34",
    employmentStatus: "employed_full_time",
    annualIncome: 60000,
    housingStatus: "rent",
    monthlyHousingPayment: 1500,
    monthlySpending: 2500,
    numOpenAccounts: 0,
    creditAgeMonths: 0,
    creditScoreBand: "good",
    utilization: "30_50",
    recentApplications6mo: 0,
    recentHardInquiries6mo: 0,
    hasExistingLoans: false,
    loanTypes: [],
    annualFeeTolerance: "low",
  },
  spending: {
    monthlyDining: 200,
    monthlyGroceries: 300,
    monthlyGas: 100,
    monthlyTravel: 100,
    monthlyOnline: 150,
    monthlyOther: 200,
  },
  issuerRelationships: JSON.parse(JSON.stringify(emptyRelationships)),
  ownedCards: [],
  goals: [],
  travel: {
    favoriteAirlines: [],
    favoriteHotels: [],
    travelFrequency: "rarely",
    scope: "mostly_domestic",
    cabinPreference: "economy",
  },
});
