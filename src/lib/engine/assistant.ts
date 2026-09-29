import type { UserProfile } from "@/lib/types";
import { CARDS, getCard } from "@/data/cards";
import { getIssuer } from "@/data/issuers";
import { TRANSFER_PARTNERS, partnersForCurrency } from "@/data/transferPartners";
import { assessReadiness } from "@/lib/engine/readiness";
import { computeFullStrategy } from "@/lib/engine/strategy";
import { buildImprovementRecommendations } from "@/lib/engine/improvements";
import { buildPortfolioOptimization } from "@/lib/engine/portfolioOptimizer";

// The Card Advisor is intentionally NOT a free-form LLM call in this prototype.
// It matches the user's question to an intent, pulls the answer from the
// structured recommendation engine / card database, and renders a templated
// response. This keeps every answer traceable to real, inspectable data
// instead of a model inventing terms, partners, or approval odds.

export interface AdvisorAnswer {
  text: string;
  cardId?: string;
  kind: "personalized" | "educational" | "unable";
}

const CARD_ALIASES: Record<string, string[]> = {
  capital_one_venture_x: ["venture x", "venturex"],
  capital_one_venture: ["capital one venture", "venture card"],
  capital_one_savor: ["savor", "capital one savor"],
  capital_one_savorone: ["savorone", "savor one"],
  capital_one_quicksilver: ["quicksilver"],
  capital_one_platinum_secured: ["capital one secured", "platinum secured"],
  chase_sapphire_preferred: ["sapphire preferred", "csp"],
  chase_sapphire_reserve: ["sapphire reserve", "csr"],
  chase_freedom_unlimited: ["freedom unlimited"],
  chase_freedom_flex: ["freedom flex"],
  amex_platinum: ["amex platinum", "platinum card", "the platinum card"],
  amex_gold: ["amex gold", "gold card"],
  amex_blue_cash_preferred: ["blue cash preferred"],
  amex_blue_cash_everyday: ["blue cash everyday"],
  citi_double_cash: ["double cash"],
  citi_custom_cash: ["custom cash"],
  citi_strata_premier: ["strata premier"],
  discover_it_cash_back: ["discover it", "discover it cash back"],
  discover_it_student_cash_back: ["discover it student", "discover student"],
  boa_customized_cash_rewards: ["customized cash"],
  boa_premium_rewards: ["boa premium rewards", "bank of america premium rewards"],
  wells_fargo_active_cash: ["active cash"],
  wells_fargo_autograph: ["autograph"],
  usbank_altitude_go: ["altitude go"],
  usbank_altitude_reserve: ["altitude reserve"],
};

function findMentionedCard(question: string): string | undefined {
  const q = question.toLowerCase();
  for (const card of CARDS) {
    const aliases = CARD_ALIASES[card.id] ?? [];
    if (aliases.some((a) => q.includes(a))) return card.id;
  }
  return undefined;
}

function findMentionedPartner(question: string) {
  const q = question.toLowerCase();
  return TRANSFER_PARTNERS.find((p) => q.includes(p.name.toLowerCase()) || q.includes(p.id.replace(/_/g, " ")));
}

function findMentionedIssuer(question: string) {
  const q = question.toLowerCase();
  const map: Record<string, string> = {
    chase: "chase",
    "capital one": "capital_one",
    amex: "amex",
    "american express": "amex",
    citi: "citi",
    "bank of america": "bank_of_america",
    "wells fargo": "wells_fargo",
    "us bank": "us_bank",
    "u.s. bank": "us_bank",
    discover: "discover",
  };
  for (const key of Object.keys(map)) {
    if (q.includes(key)) return getIssuer(map[key]);
  }
  return undefined;
}

export function answerAdvisorQuestion(question: string, profile: UserProfile): AdvisorAnswer {
  const q = question.toLowerCase().trim();

  // 1. Readiness / "should I get X" / "am I ready for X"
  const mentionedCardId = findMentionedCard(q);
  if (mentionedCardId && (q.includes("ready") || q.includes("should i get") || q.includes("should i apply") || q.includes("worth it") || q.includes("get the"))) {
    const card = getCard(mentionedCardId)!;
    const alreadyOwned = profile.ownedCards.some((oc) => oc.cardId === mentionedCardId);
    if (alreadyOwned) {
      return {
        kind: "personalized",
        cardId: mentionedCardId,
        text: `You already have ${card.name} in your wallet. Rather than adding another card, it may be worth checking whether you're using its full benefits — take a look at Optimize My Wallet.`,
      };
    }
    const readiness = assessReadiness(profile, mentionedCardId);
    if (!readiness) return unableAnswer();
    const weakest = [...readiness.components].sort((a, b) => statusRank(a.status) - statusRank(b.status))[0];
    const text =
      readiness.overallPercent >= 72
        ? `Based on your current portfolio and profile, ${card.name} looks like a reasonable card to evaluate now. ${readiness.summary} This isn't an approval prediction — the issuer makes that call — but your positioning looks solid.`
        : `Based on your current portfolio and profile, I'd wait on ${card.name}. ${readiness.summary} The area that stands out most is your ${weakest.label.toLowerCase()}: ${weakest.explanation} Here's what I'd focus on first — see your Card Journey for a suggested path.`;
    return { kind: "personalized", cardId: mentionedCardId, text };
  }

  // 2. "what card should I get next"
  if (q.includes("next card") || q.includes("what should i get") || q.includes("should i get another card") || (q.includes("card") && q.includes("next"))) {
    const strategy = computeFullStrategy(profile);
    if (!strategy.topRecommendation) return unableAnswer();
    const card = getCard(strategy.topRecommendation.cardId)!;
    return {
      kind: "personalized",
      cardId: card.id,
      text: `Based on your credit profile, existing cards, spending, and goals, ${card.name} is your strongest next fit (score: ${strategy.topRecommendation.score.total}/100). ${strategy.topRecommendation.reasons.join(". ")}.`,
    };
  }

  // 3. Transfer partner questions
  const mentionedPartner = findMentionedPartner(q);
  if (q.includes("transfer") && mentionedPartner) {
    const eligibleCurrencies = mentionedPartner.transfersFrom.map((f) => f.rewardsCurrency);
    const ownedMatches = profile.ownedCards
      .map((oc) => getCard(oc.cardId))
      .filter((c) => c && eligibleCurrencies.includes(c.rewardsCurrency));
    const currencyNames = mentionedPartner.transfersFrom.map((f) => `${labelForCurrency(f.rewardsCurrency)} (${f.ratio})`).join(", ");
    const ownedNote = ownedMatches.length > 0 ? ` You already hold ${ownedMatches.map((c) => c!.name).join(" and ")}, which transfer${ownedMatches.length === 1 ? "s" : ""} here.` : " None of your current cards transfer here yet.";
    return {
      kind: "educational",
      text: `${mentionedPartner.name} accepts transfers from: ${currencyNames}.${ownedNote} Always confirm current transfer ratios and any transfer bonuses directly with the issuer before moving points, since they can change.`,
    };
  }
  if (q.includes("transfer") && (q.includes("partner") || q.includes("partners"))) {
    const issuer = findMentionedIssuer(q);
    if (issuer) {
      const currencyByIssuer: Record<string, string> = { chase: "chase_ur", amex: "amex_mr", capital_one: "capital_one_miles", citi: "citi_thankyou" };
      const currency = currencyByIssuer[issuer.id];
      const partners = currency ? partnersForCurrency(currency) : [];
      return {
        kind: "educational",
        text: partners.length
          ? `${issuer.name}'s transferable currency generally partners with: ${partners.map((p) => p.name).join(", ")}. Ratios and available partners can change — confirm current details with ${issuer.name} before transferring.`
          : `${issuer.name} doesn't currently offer a transferable-points program in our database, or it primarily earns fixed-value cash back/rewards instead.`,
      };
    }
  }

  // 4. Cancel a card
  if (q.includes("cancel") && mentionedCardId) {
    const card = getCard(mentionedCardId)!;
    const owns = profile.ownedCards.some((oc) => oc.cardId === mentionedCardId);
    if (!owns) {
      return { kind: "educational", cardId: mentionedCardId, text: `You don't currently show ${card.name} in your wallet, so there's nothing to cancel.` };
    }
    const insights = buildPortfolioOptimization(profile).filter((i) => i.cardIds.includes(mentionedCardId));
    const insightText = insights.length ? ` ${insights[0].suggestedAction}` : "";
    return {
      kind: "personalized",
      cardId: mentionedCardId,
      text: `Before canceling ${card.name}, consider the impact on your average account age and available credit (both can affect your score).${insightText} If the annual fee is the concern, ask the issuer about a product change to a no-fee card on the same account instead of closing it outright.`,
    };
  }

  // 5. How many cards should I have
  if (q.includes("how many cards")) {
    return {
      kind: "educational",
      text: `There's no universal right number — it depends on your ability to manage due dates, your goals, and how much value you get from each card's benefits relative to its fee. Many people do well with 2–5 well-chosen cards that cover their main spending categories without much overlap. More cards can help utilization and rewards, but only if you can manage them responsibly.`,
    };
  }

  // 6. Cash back vs travel points
  if ((q.includes("cash back") || q.includes("cashback")) && (q.includes("travel") || q.includes("points"))) {
    const spendsAbroad = profile.travel.scope !== "mostly_domestic";
    return {
      kind: "personalized",
      text: `Cash back is simple and predictable — a dollar back is always a dollar. Travel points can be worth more per point (sometimes 1.5–2x or more) if you redeem them well through transfer partners, but that takes more effort and only pays off if you actually travel enough to use them. ${
        spendsAbroad
          ? "Given your stated travel habits, a travel-points ecosystem is likely to outperform flat cash back for you if you're willing to learn redemptions."
          : "Given your stated travel habits, straightforward cash back may serve you just as well with a lot less complexity."
      }`,
    };
  }

  // 7. Why isn't my credit score improving
  if (q.includes("credit score") && (q.includes("improv") || q.includes("why") || q.includes("stuck") || q.includes("not going up"))) {
    const recs = buildImprovementRecommendations(profile);
    if (recs.length === 0) {
      return { kind: "personalized", text: `Your profile doesn't show an obvious blocker in what you've shared — utilization, inquiries, account age, and mix all look reasonably solid. Score movement can still lag reported changes by a billing cycle or two.` };
    }
    const top = recs[0];
    return {
      kind: "personalized",
      text: `The biggest lever we can see from your profile: ${top.issue} ${top.action} ${top.expectedImpact} Check the Credit Health page for the full breakdown.`,
    };
  }

  // 8. What happens if I apply / hard inquiry
  if (q.includes("what happens if i apply") || q.includes("hard inquiry") || q.includes("hard pull")) {
    return {
      kind: "educational",
      text: `Submitting a credit card application typically triggers a hard inquiry, which can cause a small, usually temporary dip in your score and stays on your report for about 2 years (though it matters most in the first several months). It can also reset any "new applications" clock issuers use internally. This platform never submits an application for you — you'd continue to the issuer's own site and see a clear warning first.`,
    };
  }

  // 9. Ecosystem / issuer relationship questions
  if (q.includes("ecosystem") || (q.includes("which") && q.includes("issuer"))) {
    const strategy = computeFullStrategy(profile);
    return {
      kind: "personalized",
      text: `Based on your existing cards and banking relationships, your strategy is currently oriented around: ${strategy.primaryGoalLabel}. ${strategy.summary.narrative}`,
    };
  }

  return unableAnswer();
}

function statusRank(status: string): number {
  return { weak: 0, developing: 1, moderate: 2, strong: 3 }[status] ?? 2;
}

function labelForCurrency(currency: string): string {
  const labels: Record<string, string> = {
    chase_ur: "Chase Ultimate Rewards",
    amex_mr: "Amex Membership Rewards",
    capital_one_miles: "Capital One Miles",
    citi_thankyou: "Citi ThankYou Points",
    cashback: "Cash back",
    discover_cashback: "Discover Cashback",
    wells_fargo_rewards: "Wells Fargo Rewards",
    usbank_points: "U.S. Bank Points",
  };
  return labels[currency] ?? currency;
}

function unableAnswer(): AdvisorAnswer {
  return {
    kind: "unable",
    text: `I can answer questions about your cards, goals, credit profile, transfer partners, and recommended next steps — but I want to stay accurate rather than guess. Try asking things like "what card should I get next?", "am I ready for Venture X?", or "which cards transfer to United?" — or check Card Finder and Resources for more.`,
  };
}
