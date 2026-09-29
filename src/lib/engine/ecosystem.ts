import type { UserProfile } from "@/lib/types";
import { CARDS, getCard } from "@/data/cards";
import { ISSUERS } from "@/data/issuers";
import { TRANSFER_PARTNERS } from "@/data/transferPartners";

export interface EcosystemScore {
  issuerId: string;
  issuerName: string;
  score: number;
  reasons: string[];
}

function fuzzyIncludes(haystack: string, needle: string): boolean {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  return h.includes(n) || n.includes(h);
}

export function rankEcosystems(profile: UserProfile): EcosystemScore[] {
  const favorites = [...profile.travel.favoriteAirlines, ...profile.travel.favoriteHotels];

  const results: EcosystemScore[] = ISSUERS.map((issuer) => {
    const reasons: string[] = [];
    let score = 0;

    const ownedIssuerCards = profile.ownedCards.filter((oc) => getCard(oc.cardId)?.issuerId === issuer.id);
    if (ownedIssuerCards.length > 0) {
      score += ownedIssuerCards.length * 3;
      reasons.push(`You already hold ${ownedIssuerCards.length} ${issuer.name} card${ownedIssuerCards.length === 1 ? "" : "s"}`);
    }

    const rel = profile.issuerRelationships[issuer.id];
    if (rel?.checking || rel?.savings || rel?.investment) {
      score += (rel.checking ? 2 : 0) + (rel.savings ? 1 : 0) + (rel.investment ? 1 : 0);
      reasons.push(`Existing ${issuer.name} banking relationship`);
    }

    const issuerCurrencies = new Set(CARDS.filter((c) => c.issuerId === issuer.id).map((c) => c.rewardsCurrency));
    const relevantPartners = TRANSFER_PARTNERS.filter((p) => p.transfersFrom.some((f) => issuerCurrencies.has(f.rewardsCurrency)));
    const matchedPartners = relevantPartners.filter((p) => favorites.some((f) => fuzzyIncludes(p.name, f)));
    if (matchedPartners.length > 0) {
      score += matchedPartners.length * 2;
      reasons.push(`Your preferred travel partners overlap: ${matchedPartners.map((p) => p.name).join(", ")}`);
    }

    if (profile.goals.some((g) => g.id === "chase_ecosystem") && issuer.id === "chase") {
      score += 3;
      reasons.push("Matches your stated goal of building a Chase ecosystem");
    }

    if (profile.goals.some((g) => g.id === "target_card" && g.targetCardId && getCard(g.targetCardId)?.issuerId === issuer.id)) {
      score += 3;
      reasons.push("Aligns with your long-term target card");
    }

    return { issuerId: issuer.id, issuerName: issuer.name, score, reasons };
  });

  return results.sort((a, b) => b.score - a.score);
}
