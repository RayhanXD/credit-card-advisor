import { describe, expect, it } from "vitest";
import { CARDS } from "@/data/cards";
import { DEMO_PERSONAS } from "@/data/personas";
import { buildCardJourney } from "@/lib/engine/journey";
import { assessReadiness } from "@/lib/engine/readiness";
import { scoreAllCards } from "@/lib/engine/scoring";
import type { UserProfile } from "@/lib/types";

function persona(id: string): UserProfile {
  const found = DEMO_PERSONAS.find((profile) => profile.id === id);
  if (!found) throw new Error(`missing persona ${id}`);
  return found;
}

function topScores(profile: UserProfile) {
  return scoreAllCards(CARDS, profile)
    .slice(0, 3)
    .map((rec) => ({
      cardId: rec.cardId,
      total: rec.score.total,
      fitLabel: rec.fitLabel,
    }));
}

describe("demo persona scoring", () => {
  it("locks Maya, Jordan, and Priya top scores", () => {
    expect(topScores(persona("persona_maya"))).toEqual([
      { cardId: "chase_freedom_unlimited", total: 69, fitLabel: "not_recommended_now" },
      { cardId: "chase_freedom_flex", total: 69, fitLabel: "not_recommended_now" },
      { cardId: "discover_it_student_cash_back", total: 68, fitLabel: "consider" },
    ]);
    expect(topScores(persona("persona_jordan"))).toEqual([
      { cardId: "capital_one_savorone", total: 78, fitLabel: "strong_fit" },
      { cardId: "capital_one_platinum_secured", total: 72, fitLabel: "consider" },
      { cardId: "capital_one_quicksilver", total: 72, fitLabel: "consider" },
    ]);
    expect(topScores(persona("persona_priya"))).toEqual([
      { cardId: "wells_fargo_active_cash", total: 84, fitLabel: "strong_fit" },
      { cardId: "wells_fargo_autograph", total: 82, fitLabel: "strong_fit" },
      { cardId: "capital_one_savorone", total: 80, fitLabel: "strong_fit" },
    ]);
  });

  it("locks Jordan's Venture X readiness and journey", () => {
    const jordan = persona("persona_jordan");
    const readiness = assessReadiness(jordan, "capital_one_venture_x");
    expect(readiness?.overallPercent).toBe(49);
    expect(readiness?.components.map((component) => ({ label: component.label, status: component.status }))).toEqual([
      { label: "Credit profile", status: "weak" },
      { label: "Account age", status: "weak" },
      { label: "Recent inquiries", status: "moderate" },
      { label: "Existing Capital One relationship", status: "moderate" },
      { label: "Income", status: "developing" },
      { label: "Current portfolio", status: "moderate" },
    ]);

    const journey = buildCardJourney(jordan, "capital_one_venture_x");
    expect(journey?.estimatedTimelineMonths).toBe(24);
    expect(journey?.steps.map((step) => ({ order: step.order, title: step.title, cardId: step.cardId ?? null, timing: step.timing }))).toEqual([
      { order: 1, title: "Establish relationship", cardId: "capital_one_savorone", timing: "now" },
      { order: 2, title: "Build your profile", cardId: null, timing: "next" },
      { order: 3, title: "Reassess", cardId: null, timing: "next" },
      { order: 4, title: "Potential next move: Capital One Venture X", cardId: "capital_one_venture_x", timing: "later" },
    ]);
  });
});
