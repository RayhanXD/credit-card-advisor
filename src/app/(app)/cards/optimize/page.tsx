"use client";

import Link from "next/link";
import { ArrowLeft, Layers, TrendingDown, PiggyBank, Gift, CircleCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { buildPortfolioOptimization } from "@/lib/engine/portfolioOptimizer";
import { getCard } from "@/data/cards";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/Panel";
import { CardFace } from "@/components/cards/CreditCardTile";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  overlap: { icon: Layers, label: "Overlap", color: "var(--color-gold-vivid)", text: "text-[var(--color-gold)]", soft: "bg-[var(--color-gold-soft)]" },
  missing_category: { icon: TrendingDown, label: "Coverage gap", color: "var(--color-teal-vivid)", text: "text-[var(--color-teal)]", soft: "bg-[var(--color-teal-soft)]" },
  fee_review: { icon: PiggyBank, label: "Fee review", color: "var(--color-coral-vivid)", text: "text-[var(--color-coral)]", soft: "bg-[var(--color-coral-soft)]" },
  unused_benefit: { icon: Gift, label: "Unused benefit", color: "var(--color-indigo-vivid)", text: "text-[var(--color-indigo)]", soft: "bg-[var(--color-indigo-soft)]" },
};

export default function OptimizeWalletPage() {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return null;

  const insights = buildPortfolioOptimization(profile);
  const counts = (Object.keys(TYPE_CONFIG) as (keyof typeof TYPE_CONFIG)[]).map((type) => ({
    type,
    count: insights.filter((i) => i.type === type).length,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        back={
          <Link href="/cards" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]">
            <ArrowLeft size={14} /> My Cards
          </Link>
        }
        kicker="Wallet audit"
        kickerTone="gold"
        title="Optimize My Wallet"
        description={`Overlap, gaps, and fees worth a second look across your ${profile.ownedCards.length} card${profile.ownedCards.length === 1 ? "" : "s"}.`}
      />

      {insights.length === 0 ? (
        <EmptyState
          icon={<CircleCheck size={22} />}
          title="Your wallet looks well-optimized"
          description="We didn't find meaningful overlap, coverage gaps, or fee inefficiencies based on your current spending pattern."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {counts.map(({ type, count }) => {
              const c = TYPE_CONFIG[type];
              const Icon = c.icon;
              return (
                <div
                  key={type}
                  className={cn(
                    "flex items-center gap-3 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3.5",
                    count === 0 && "opacity-55"
                  )}
                >
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-[10px]", c.soft, c.text)}>
                    <Icon size={16} />
                  </span>
                  <span>
                    <span className="figure block text-[18px] font-semibold leading-none text-[var(--color-ink)]">{count}</span>
                    <span className="text-[11.5px] text-[var(--color-ink-faint)]">{c.label}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <ul className="space-y-4">
            {insights.map((insight) => {
              const config = TYPE_CONFIG[insight.type];
              const Icon = config.icon;
              return (
                <li
                  key={insight.id}
                  className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]"
                >
                  <span className="absolute inset-y-0 left-0 w-1" style={{ background: config.color }} />
                  <div className="grid gap-5 p-5 pl-6 sm:p-6 sm:pl-7 lg:grid-cols-[1fr_300px]">
                    <div className="space-y-2">
                      <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-semibold", config.text)}>
                        <Icon size={14} />
                        {config.label}
                      </span>
                      <p className="font-display text-[17px] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">{insight.title}</p>
                      <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{insight.description}</p>
                      {insight.cardIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {insight.cardIds.map((id) => {
                            const card = getCard(id);
                            return card ? (
                              <Link
                                key={id}
                                href={`/card-finder/${id}`}
                                className="flex items-center gap-2 rounded-[10px] border border-[var(--color-border)] py-1 pl-1 pr-2.5 text-[12px] font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
                              >
                                <CardFace card={card} size="sm" className="w-9 shrink-0" />
                                {card.name}
                              </Link>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    <div className="self-start rounded-[14px] bg-[var(--color-bg-subtle)] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Suggested action</p>
                      <p className="mt-1.5 text-[13.5px] font-medium leading-relaxed text-[var(--color-ink)]">{insight.suggestedAction}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
