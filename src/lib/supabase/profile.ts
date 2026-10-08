import type { FinancialProfile, IssuerRelationships, NotificationPrefs, OwnedCard, SpendingProfile, TravelPreferences, UserGoal, UserProfile } from "@/lib/types";
import { DEFAULT_NOTIFICATION_PREFS } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

function asDateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

function asNotificationPrefs(value: unknown): NotificationPrefs {
  const raw = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  return {
    renewals: raw.renewals !== false,
    readiness: raw.readiness !== false,
    utilization: raw.utilization !== false,
    reviews: raw.reviews !== false,
  };
}

export function rowToProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    financial: row.financial as unknown as FinancialProfile,
    spending: row.spending as unknown as SpendingProfile,
    issuerRelationships: row.issuer_relationships as unknown as IssuerRelationships,
    ownedCards: (row.owned_cards as unknown as OwnedCard[]) ?? [],
    goals: (row.goals as unknown as UserGoal[]) ?? [],
    travel: row.travel as unknown as TravelPreferences,
    onboardingComplete: row.onboarding_complete,
    createdAt: row.created_at,
    nextReviewDate: row.next_review_date ? `${row.next_review_date}T00:00:00.000Z` : "",
    notificationPrefs: asNotificationPrefs(row.notification_prefs),
  };
}

export function profileToRow(profile: UserProfile): ProfileInsert {
  return {
    id: profile.id,
    name: profile.name,
    financial: profile.financial as unknown as ProfileInsert["financial"],
    spending: profile.spending as unknown as ProfileInsert["spending"],
    issuer_relationships: profile.issuerRelationships as unknown as ProfileInsert["issuer_relationships"],
    owned_cards: profile.ownedCards as unknown as ProfileInsert["owned_cards"],
    goals: profile.goals as unknown as ProfileInsert["goals"],
    travel: profile.travel as unknown as ProfileInsert["travel"],
    onboarding_complete: profile.onboardingComplete,
    next_review_date: asDateOnly(profile.nextReviewDate),
    created_at: profile.createdAt,
    notification_prefs: (profile.notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS) as unknown as ProfileInsert["notification_prefs"],
  };
}

export async function fetchMyProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
  if (error) throw error;
  return data ? rowToProfile(data) : null;
}

export async function upsertMyProfile(profile: UserProfile): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("profiles").upsert(profileToRow(profile), { onConflict: "id" });
  if (error) throw error;
}
