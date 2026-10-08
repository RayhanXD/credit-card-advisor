import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CardRecommendation, CreditCardProduct } from "@/lib/types";
import { getIssuer } from "@/data/issuers";
import { FitBadge } from "@/components/cards/FitBadge";
import { FactorStrip } from "@/components/cards/ScoreBreakdownPanel";
import { CardFace } from "@/components/cards/CreditCardTile";
import { formatCurrency } from "@/lib/utils";

export function CardListRow({ card, recommendation }: { card: CreditCardProduct; recommendation?: CardRecommendation }) {
  const issuer = getIssuer(card.issuerId);
  const topCategories = card.rewardCategories.filter((rc) => rc.multiplier >= 2).slice(0, 3);

  return (
    <Link
      href={`/card-finder/${card.id}`}
      className="group grid grid-cols-[56px_1fr_auto] items-center gap-4 px-4 py-3.5 transition-colors hover:bg-[var(--color-bg-subtle)] sm:grid-cols-[64px_minmax(0,1fr)_180px_160px] sm:px-5"
    >
      <CardFace card={card} size="sm" />

      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold text-[var(--color-ink)]">{card.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[var(--color-ink-faint)]">
          <span>{issuer?.name}</span>
          <span aria-hidden="true">·</span>
          <span className="figure">{card.annualFee === 0 ? "$0" : `${formatCurrency(card.annualFee)}`}/yr</span>
          {topCategories.map((rc) => (
            <span key={rc.category} className="hidden rounded-[5px] bg-[var(--color-bg-subtle)] px-1.5 py-px text-[11px] capitalize text-[var(--color-ink-soft)] group-hover:bg-[var(--color-bg-elevated)] md:inline">
              <span className="figure font-semibold text-[var(--color-ink)]">{rc.multiplier}x</span> {rc.category.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </div>

      {recommendation ? (
        <div className="hidden items-center gap-3 sm:flex">
          <FactorStrip score={recommendation.score} height={5} className="flex-1" />
          <span className="figure w-7 text-right text-[13px] font-semibold text-[var(--color-ink)]">{recommendation.score.total}</span>
        </div>
      ) : (
        <span className="hidden sm:block" />
      )}

      <div className="flex items-center justify-end gap-2">
        {recommendation && <FitBadge fitLabel={recommendation.fitLabel} className="hidden sm:inline-flex" />}
        {recommendation && <span className="figure text-[13px] font-semibold text-[var(--color-ink)] sm:hidden">{recommendation.score.total}</span>}
        <ChevronRight size={16} className="text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
