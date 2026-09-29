import Link from "next/link";
import type { CardRecommendation, CreditCardProduct } from "@/lib/types";
import { getIssuer } from "@/data/issuers";
import { FitBadge } from "@/components/cards/FitBadge";
import { formatCurrency } from "@/lib/utils";

export function CardListRow({ card, recommendation }: { card: CreditCardProduct; recommendation?: CardRecommendation }) {
  const issuer = getIssuer(card.issuerId);
  const topCategories = card.rewardCategories
    .filter((rc) => rc.multiplier >= 2)
    .slice(0, 3)
    .map((rc) => `${rc.multiplier}x ${rc.category.replace(/_/g, " ")}`);

  return (
    <Link
      href={`/card-finder/${card.id}`}
      className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 transition-shadow hover:shadow-[var(--shadow-card-hover)] sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-[11.5px] font-medium text-[var(--color-ink-faint)]">{issuer?.name}</p>
        <p className="text-[15px] font-semibold text-[var(--color-ink)]">{card.name}</p>
        <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-soft)]">
          {card.annualFee === 0 ? "No annual fee" : `${formatCurrency(card.annualFee)}/yr`}
          {topCategories.length > 0 && ` · ${topCategories.join(", ")}`}
        </p>
      </div>
      {recommendation && (
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[13px] font-medium tabular-nums text-[var(--color-ink-soft)]">{recommendation.score.total}/100</span>
          <FitBadge fitLabel={recommendation.fitLabel} />
        </div>
      )}
    </Link>
  );
}
