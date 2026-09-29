"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CARDS } from "@/data/cards";
import { ISSUERS } from "@/data/issuers";
import { scoreAllCards } from "@/lib/engine/scoring";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { CardListRow } from "@/components/cards/CardListRow";
import type { AnnualFeeTolerance, CardCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const FEE_FILTERS: { value: AnnualFeeTolerance | "all"; label: string }[] = [
  { value: "all", label: "Any fee" },
  { value: "none", label: "No fee" },
  { value: "low", label: "Under $100" },
  { value: "moderate", label: "Under $400" },
  { value: "high", label: "$400+" },
];

const CATEGORY_FILTERS: { value: CardCategory; label: string }[] = [
  { value: "cash_back", label: "Cash Back" },
  { value: "travel", label: "Travel" },
  { value: "premium_travel", label: "Premium Travel" },
  { value: "business", label: "Business" },
  { value: "student", label: "Student" },
  { value: "hotel_cobrand", label: "Hotel" },
  { value: "airline_cobrand", label: "Airline" },
  { value: "balance_transfer", label: "Balance Transfer" },
];

function feeMatches(fee: number, filter: AnnualFeeTolerance | "all"): boolean {
  if (filter === "all") return true;
  if (filter === "none") return fee === 0;
  if (filter === "low") return fee > 0 && fee <= 100;
  if (filter === "moderate") return fee > 100 && fee <= 400;
  return fee > 400;
}

export default function CardFinderPage() {
  const profile = useAppStore((s) => s.profile);
  const [query, setQuery] = useState("");
  const [feeFilter, setFeeFilter] = useState<AnnualFeeTolerance | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CardCategory | null>(null);
  const [issuerFilter, setIssuerFilter] = useState<string | null>(null);

  const recommended = useMemo(() => {
    if (!profile) return [];
    const ownedIds = new Set(profile.ownedCards.map((oc) => oc.cardId));
    return scoreAllCards(CARDS.filter((c) => !ownedIds.has(c.id)), profile).slice(0, 3);
  }, [profile]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CARDS.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (!feeMatches(c.annualFee, feeFilter)) return false;
      if (categoryFilter && !c.category.includes(categoryFilter)) return false;
      if (issuerFilter && c.issuerId !== issuerFilter) return false;
      return true;
    });
  }, [query, feeFilter, categoryFilter, issuerFilter]);

  const scoredFiltered = useMemo(() => {
    if (!profile) return filtered.map((card) => ({ card, recommendation: undefined }));
    const scores = scoreAllCards(filtered, profile);
    const byId = Object.fromEntries(scores.map((s) => [s.cardId, s]));
    return filtered
      .map((card) => ({ card, recommendation: byId[card.id] }))
      .sort((a, b) => (b.recommendation?.score.total ?? 0) - (a.recommendation?.score.total ?? 0));
  }, [filtered, profile]);

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Card Finder</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">Every card is scored against your actual profile.</p>
      </div>

      {recommended.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[16px] font-semibold">Recommended for You</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {recommended.map((rec, i) => (
              <RecommendationCard key={rec.cardId} recommendation={rec} highlight={i === 0} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all cards…"
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] pl-10 pr-3 text-[14px] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FEE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFeeFilter(f.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12.5px] font-medium",
                feeFilter === f.value
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]"
                  : "border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(categoryFilter === c.value ? null : c.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12.5px] font-medium",
                categoryFilter === c.value
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  : "border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ISSUERS.map((i) => (
            <button
              key={i.id}
              onClick={() => setIssuerFilter(issuerFilter === i.id ? null : i.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12.5px] font-medium",
                issuerFilter === i.id
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]"
                  : "border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
              )}
            >
              {i.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[12.5px] text-[var(--color-ink-faint)]">
          {scoredFiltered.length} card{scoredFiltered.length === 1 ? "" : "s"}
        </p>
        {scoredFiltered.map(({ card, recommendation }) => (
          <CardListRow key={card.id} card={card} recommendation={recommendation} />
        ))}
      </div>
    </div>
  );
}
