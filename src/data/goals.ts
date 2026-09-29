import type { GoalDefinition } from "@/lib/types";

export const GOAL_DEFINITIONS: GoalDefinition[] = [
  { id: "build_credit", label: "Build credit", group: "Credit", description: "Establish or strengthen your credit profile from the ground up." },
  { id: "increase_approval_odds", label: "Increase approval odds", group: "Credit", description: "Position yourself for stronger approval odds on future applications." },
  { id: "establish_history", label: "Establish credit history", group: "Credit", description: "Build a track record of on-time payments and account age." },
  { id: "improve_profile", label: "Improve credit profile", group: "Credit", description: "Address utilization, inquiries, or account mix issues." },

  { id: "maximize_cashback", label: "Maximize cash back", group: "Rewards", description: "Get the most straightforward cash back on everyday spending." },
  { id: "maximize_travel", label: "Maximize travel rewards", group: "Rewards", description: "Earn transferable points for flights and hotels." },
  { id: "airline_miles", label: "Earn airline miles", group: "Rewards", description: "Focus on airline-specific mileage earning." },
  { id: "hotel_points", label: "Earn hotel points", group: "Rewards", description: "Focus on hotel loyalty point earning." },
  { id: "maximize_everyday", label: "Maximize everyday spending", group: "Rewards", description: "Optimize rewards across groceries, gas, dining, and other daily categories." },
  { id: "maximize_dining", label: "Maximize rewards with dining", group: "Rewards", description: "Prioritize cards with strong dining multipliers." },
  { id: "maximize_groceries", label: "Maximize rewards with groceries", group: "Rewards", description: "Prioritize cards with strong grocery multipliers." },

  { id: "lounge_access", label: "Airport lounge access", group: "Premium Travel", description: "Prioritize cards with lounge network access." },
  { id: "travel_protections", label: "Travel protections", group: "Premium Travel", description: "Prioritize trip cancellation, delay, and rental car coverage." },
  { id: "premium_benefits", label: "Premium travel benefits", group: "Premium Travel", description: "Elite hotel status, credits, and concierge-style perks." },

  { id: "minimize_fees", label: "Minimize annual fees", group: "Portfolio", description: "Prioritize no- or low-annual-fee cards." },
  { id: "major_purchase", label: "Prepare for a major purchase", group: "Portfolio", description: "Position your profile and available credit ahead of a large purchase." },
  { id: "consolidate_cards", label: "Consolidate my credit cards", group: "Portfolio", description: "Simplify an existing wallet by removing overlap." },
  { id: "chase_ecosystem", label: "Build a Chase ecosystem", group: "Portfolio", description: "Build a coordinated set of Chase cards that work together." },
  { id: "target_card", label: "Work toward a specific card", group: "Portfolio", description: "Build a path toward a specific card you have in mind." },
];

export function getGoalDefinition(id: string): GoalDefinition | undefined {
  return GOAL_DEFINITIONS.find((g) => g.id === id);
}
