"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CARDS } from "@/data/cards";
import { ISSUERS } from "@/data/issuers";
import { scoreAllCards } from "@/lib/engine/scoring";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { CardListRow } from "@/components/cards/CardListRow";
import { SCORE_FACTORS } from "@/components/cards/ScoreBreakdownPanel";
import { PageHeader, SectionHeading } from "@/components/ui/Panel";
import { inputClass } from "@/components/ui/TextField";
import { EmptyState } from "@/components/ui/EmptyState";
import { Disclaimer } from "@/components/ui/Disclaimer";
import type { AnnualFeeTolerance, CardCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const FEE_FILTERS: { value: AnnualFeeTolerance | "all"; label: string }[] = [
  { value: "all", label: "Any fee" },
  { value: "none", label: "$0" },
  { value: "low", label: "≤ $100" },
  { value: "moderate", label: "≤ $400" },
  { value: "high", label: "$400+" },
];

const CATEGORY_FILTERS: { value: CardCategory; label: string }[] = [
  { value: "cash_back", label: "Cash back" },
  { value: "travel", label: "Travel" },
  { value: "premium_travel", label: "Premium travel" },
  { value: "business", label: "Business" },
  { value: "student", label: "Student" },
  { value: "hotel_cobrand", label: "Hotel" },
  { value: "airline_cobrand", label: "Airline" },
  { value: "balance_transfer", label: "Balance transfer" },
];

function feeMatches(fee: number, filter: AnnualFeeTolerance | "all"): boolean {
  if (filter === "all") return true;
  if (filter === "none") return fee === 0;
  if (filter === "low") return fee > 0 && fee <= 100;
  if (filter === "moderate") return fee > 100 && fee <= 400;
  return fee > 400;
}

const chip = (active: boolean) =>
  cn(
    "whitespace-nowrap rounded-[9px] border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
    active
      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg-elevated)]"
      : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-ink-soft)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
  );

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

  const hasFilters = query || feeFilter !== "all" || categoryFilter || issuerFilter;
  function clearFilters() {
    setQuery("");
    setFeeFilter("all");
    setCategoryFilter(null);
    setIssuerFilter(null);
  }

  return (
    <div className="space-y-10">
      <PageHeader kicker="Scored for you" title="Card Finder" description="Every card in our database, scored against your actual profile." />

      {recommended.length > 0 && (
        <section className="space-y-4">
          <SectionHeading kicker="Top 3" title="Recommended for you" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {recommended.map((rec, i) => (
              <RecommendationCard key={rec.cardId} recommendation={rec} highlight={i === 0} layout="compact" />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <SectionHeading
          kicker={`${scoredFiltered.length} of ${CARDS.length}`}
          title="All cards"
          action={
            hasFilters ? (
              <button onClick={clearFilters} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--color-accent)] hover:text-[var(--color-ink)]">
                <X size={13} /> Clear filters
              </button>
            ) : undefined
          }
        />

        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
          <div className="space-y-3 border-b border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all cards…"
                aria-label="Search all cards"
                className={cn(inputClass, "pl-10 pr-3")}
              />
            </div>
            <FilterRow label="Fee">
              {FEE_FILTERS.map((f) => (
                <button key={f.value} onClick={() => setFeeFilter(f.value)} className={chip(feeFilter === f.value)} aria-pressed={feeFilter === f.value}>
                  {f.label}
                </button>
              ))}
            </FilterRow>
            <FilterRow label="Type">
              {CATEGORY_FILTERS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategoryFilter(categoryFilter === c.value ? null : c.value)}
                  className={chip(categoryFilter === c.value)}
                  aria-pressed={categoryFilter === c.value}
                >
                  {c.label}
                </button>
              ))}
            </FilterRow>
            <FilterRow label="Issuer">
              {ISSUERS.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setIssuerFilter(issuerFilter === i.id ? null : i.id)}
                  className={cn(chip(issuerFilter === i.id), "inline-flex items-center gap-1.5")}
                  aria-pressed={issuerFilter === i.id}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: i.accentColor }} />
                  {i.name}
                </button>
              ))}
            </FilterRow>
          </div>

          <div className="hidden grid-cols-[64px_minmax(0,1fr)_180px_160px] gap-4 border-b border-[var(--color-border)] px-5 py-2 sm:grid">
            <span />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Card</span>
            <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
              Fit factors
              <span className="flex gap-1" aria-hidden="true">
                {SCORE_FACTORS.map((f) => (
                  <span key={f.key} className="h-1.5 w-1.5 rounded-[2px]" style={{ background: f.color }} title={f.label} />
                ))}
              </span>
            </span>
            <span className="pr-6 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Fit</span>
          </div>

          {scoredFiltered.length === 0 ? (
            <div className="p-4">
              <EmptyState icon={<Search size={20} />} title="No cards match" description="Try a broader fee range or clear a filter." />
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {scoredFiltered.map(({ card, recommendation }) => (
                <CardListRow key={card.id} card={card} recommendation={recommendation} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{label}</span>
      <div className="-my-1 flex gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]">{children}</div>
    </div>
  );
}
