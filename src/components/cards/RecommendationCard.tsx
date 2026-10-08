"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import type { CardRecommendation } from "@/lib/types";
import { getCard } from "@/data/cards";
import { getIssuer } from "@/data/issuers";
import { FitBadge } from "@/components/cards/FitBadge";
import { FactorStrip, ScoreBreakdownPanel } from "@/components/cards/ScoreBreakdownPanel";
import { CardFace } from "@/components/cards/CreditCardTile";
import { ReasonList } from "@/components/cards/ReasonList";
import { formatCurrency, cn } from "@/lib/utils";

export function RecommendationCard({
  recommendation,
  highlight,
  layout = "full",
}: {
  recommendation: CardRecommendation;
  highlight?: boolean;
  layout?: "full" | "compact";
}) {
  const [expanded, setExpanded] = useState(false);
  const card = getCard(recommendation.cardId);
  if (!card) return null;
  const issuer = getIssuer(card.issuerId);
  const compact = layout === "compact";

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]",
        highlight ? "border-[color-mix(in_srgb,var(--color-mint)_55%,var(--color-border))]" : "border-[var(--color-border)]"
      )}
    >
      {highlight && <div className="h-1 w-full bg-[linear-gradient(90deg,var(--color-mint),var(--color-teal-vivid),var(--color-gold-vivid))]" />}

      <div className={cn("flex flex-1 flex-col p-5", !compact && "sm:p-6")}>
        <div className={cn("flex gap-4", compact ? "flex-col" : "flex-col sm:flex-row")}>
          {!compact && (
            <Link href={`/card-finder/${card.id}`} className="group block w-full shrink-0 sm:w-40" tabIndex={-1} aria-hidden="true">
              <CardFace card={card} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </Link>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-[var(--color-ink-faint)]">{issuer?.name}</p>
                <Link
                  href={`/card-finder/${card.id}`}
                  className="group/link inline-flex items-center gap-1 font-display text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[var(--color-ink)]"
                >
                  {card.name}
                  <ArrowUpRight size={15} className="text-[var(--color-ink-faint)] transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </Link>
              </div>
              <FitBadge fitLabel={recommendation.fitLabel} />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-[var(--color-ink-faint)]">
              <span>
                Fit <span className="figure font-semibold text-[var(--color-ink)]">{recommendation.score.total}</span>/100
              </span>
              <span>
                Fee{" "}
                <span className="figure font-semibold text-[var(--color-ink)]">
                  {card.annualFee === 0 ? "$0" : formatCurrency(card.annualFee)}
                </span>
              </span>
              {recommendation.estimatedAnnualValue !== 0 && (
                <span>
                  Est. net value{" "}
                  <span className={cn("figure font-semibold", recommendation.estimatedAnnualValue > 0 ? "text-[var(--color-accent)]" : "text-[var(--color-coral)]")}>
                    {formatCurrency(recommendation.estimatedAnnualValue)}/yr
                  </span>
                </span>
              )}
            </div>

            <FactorStrip score={recommendation.score} className="mt-3" height={6} />
          </div>
        </div>

        <ReasonList
          className="mt-4"
          dense={compact}
          reasons={recommendation.reasons.slice(0, compact ? 2 : 4)}
          cautions={recommendation.cautions.slice(0, compact ? 1 : 2)}
        />

        <div className="mt-auto pt-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex items-center gap-1.5 rounded-[8px] text-[12.5px] font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)]"
          >
            Why this recommendation?
            <ChevronDown size={14} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-dashed border-[var(--color-border-strong)] pt-4">
                <ScoreBreakdownPanel score={recommendation.score} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}
