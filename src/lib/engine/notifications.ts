import type { UserProfile } from "@/lib/types";
import { getCard } from "@/data/cards";
import { buildCreditHealthSnapshot } from "@/lib/engine/creditHealth";
import { assessReadiness } from "@/lib/engine/readiness";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  tone: "info" | "warning" | "success";
}

// Derived deterministically from the profile so demo notifications stay
// consistent across reloads instead of appearing random.
export function buildNotifications(profile: UserProfile): AppNotification[] {
  const notifications: AppNotification[] = [];

  const feeCards = profile.ownedCards
    .map((oc) => ({ oc, card: getCard(oc.cardId) }))
    .filter((x) => x.card && x.card.annualFee > 0);
  if (feeCards.length > 0) {
    const soonest = [...feeCards].sort((a, b) => (b.oc.monthsOpen % 12) - (a.oc.monthsOpen % 12))[0];
    const monthsUntilRenewal = 12 - (soonest.oc.monthsOpen % 12);
    if (monthsUntilRenewal <= 3) {
      notifications.push({
        id: "renewal",
        title: "Annual fee renewal approaching",
        body: `${soonest.card!.name}'s $${soonest.card!.annualFee} annual fee renews in about ${monthsUntilRenewal} month${monthsUntilRenewal === 1 ? "" : "s"}. Worth reviewing whether it's still earning its keep.`,
        tone: "info",
      });
    }
  }

  if (profile.financial.recentHardInquiries6mo >= 3) {
    notifications.push({
      id: "inquiries",
      title: "Multiple recent inquiries",
      body: `You've had ${profile.financial.recentHardInquiries6mo} hard inquiries in the last 6 months. Consider pausing new applications for a bit.`,
      tone: "warning",
    });
  }

  if (profile.financial.utilization === "50_75" || profile.financial.utilization === "over_75") {
    notifications.push({
      id: "utilization",
      title: "Utilization is elevated",
      body: "Your reported utilization is on the higher side, which can weigh on your score. See Credit Health for suggested actions.",
      tone: "warning",
    });
  }

  const snapshot = buildCreditHealthSnapshot(profile);
  if (snapshot.overallScore >= 85) {
    notifications.push({
      id: "health_strong",
      title: "Your credit health looks strong",
      body: `Your Credit Health score is ${snapshot.overallScore}/100 — a good time to evaluate whether you're ready for a new card.`,
      tone: "success",
    });
  }

  const targetGoal = profile.goals.find((g) => g.id === "target_card" && g.targetCardId);
  if (targetGoal?.targetCardId) {
    const readiness = assessReadiness(profile, targetGoal.targetCardId);
    const targetCard = getCard(targetGoal.targetCardId);
    if (readiness && targetCard) {
      notifications.push({
        id: "readiness",
        title: `${targetCard.name} readiness: ${readiness.overallPercent}%`,
        body: readiness.summary,
        tone: readiness.overallPercent >= 72 ? "success" : "info",
      });
    }
  }

  const reviewDate = new Date(profile.nextReviewDate);
  const daysUntil = Math.round((reviewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 30 && daysUntil >= 0) {
    notifications.push({
      id: "review",
      title: "Strategy review coming up",
      body: `Your recommended review date is ${reviewDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}.`,
      tone: "info",
    });
  }

  return notifications;
}
