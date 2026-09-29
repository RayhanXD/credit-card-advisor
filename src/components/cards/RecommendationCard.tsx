"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Check, AlertTriangle } from "lucide-react";
import type { CardRecommendation } from "@/lib/types";
import { getCard } from "@/data/cards";
import { getIssuer } from "@/data/issuers";
import { FitBadge } from "@/components/cards/FitBadge";
import { ScoreBreakdownPanel } from "@/components/cards/ScoreBreakdownPanel";
import { formatCurrency, cn } from "@/lib/utils";

export function RecommendationCard({ recommendation, highlight }: { recommendation: CardRecommendation; highlight?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const card = getCard(recommendation.cardId);
  if (!card) return null;
  const issuer = getIssuer(card.issuerId);

  return (
    <div
      className={cn(
        "rounded-2xl border bg-[var(--color-bg-elevated)] p-5 transition-shadow",
        highlight ? "border-[var(--color-ink)] shadow-[var(--shadow-card-hover)]" : "border-[var(--color-border)]"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11.5px] font-medium text-[var(--color-ink-faint)]">{issuer?.name}</p>
          <Link href={`/card-finder/${card.id}`} className="text-[16px] font-semibold text-[var(--color-ink)] hover:underline">
            {card.name}
          </Link>
          <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-soft)]">
            {card.annualFee === 0 ? "No annual fee" : `${formatCurrency(card.annualFee)}/yr`} · Fit score {recommendation.score.total}/100
          </p>
        </div>
        <FitBadge fitLabel={recommendation.fitLabel} />
      </div>

      <div className="mt-4 space-y-1.5">
        {recommendation.reasons.slice(0, 4).map((r) => (
          <div key={r} className="flex items-start gap-2 text-[13px] text-[var(--color-ink-soft)]">
            <Check size={14} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
            {r}
          </div>
        ))}
        {recommendation.cautions.slice(0, 2).map((c) => (
          <div key={c} className="flex items-start gap-2 text-[13px] text-[var(--color-ink-soft)]">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--color-warning)]" />
            {c}
          </div>
        ))}
      </div>

      {recommendation.estimatedAnnualValue !== 0 && (
        <p className="mt-3 text-[12.5px] text-[var(--color-ink-faint)]">
          Estimated net annual value:{" "}
          <span className="font-medium text-[var(--color-ink)]">{formatCurrency(recommendation.estimatedAnnualValue)}</span>
        </p>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-accent)]"
      >
        Why this recommendation?
        <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="mt-4 border-t border-[var(--color-border)] pt-4">
          <ScoreBreakdownPanel score={recommendation.score} />
        </div>
      )}
    </div>
  );
}
