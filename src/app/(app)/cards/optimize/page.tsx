"use client";

import Link from "next/link";
import { ArrowLeft, Layers, TrendingDown, PiggyBank, Gift } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { buildPortfolioOptimization } from "@/lib/engine/portfolioOptimizer";
import { getCard } from "@/data/cards";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

const TYPE_CONFIG = {
  overlap: { icon: Layers, tone: "warning" as const, label: "Overlap" },
  missing_category: { icon: TrendingDown, tone: "accent" as const, label: "Gap" },
  fee_review: { icon: PiggyBank, tone: "danger" as const, label: "Fee review" },
  unused_benefit: { icon: Gift, tone: "neutral" as const, label: "Unused benefit" },
};

export default function OptimizeWalletPage() {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return null;

  const insights = buildPortfolioOptimization(profile);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/cards" className="mb-3 flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
          <ArrowLeft size={14} /> My Cards
        </Link>
        <h1 className="text-[24px] font-semibold tracking-tight">Optimize My Wallet</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">
          Overlap, gaps, and fees worth a second look across your {profile.ownedCards.length} card{profile.ownedCards.length === 1 ? "" : "s"}.
        </p>
      </div>

      {insights.length === 0 ? (
        <EmptyState
          title="Your wallet looks well-optimized"
          description="We didn't find meaningful overlap, coverage gaps, or fee inefficiencies based on your current spending pattern."
        />
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => {
            const config = TYPE_CONFIG[insight.type];
            const Icon = config.icon;
            return (
              <div key={insight.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-ink-soft)]">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="text-[14.5px] font-medium text-[var(--color-ink)]">{insight.title}</p>
                      <Badge tone={config.tone}>{config.label}</Badge>
                    </div>
                    <p className="text-[13.5px] text-[var(--color-ink-soft)]">{insight.description}</p>
                    <div className="mt-3 rounded-xl bg-[var(--color-bg-subtle)] px-3.5 py-2.5">
                      <p className="text-[12.5px] font-medium text-[var(--color-ink)]">Suggested action</p>
                      <p className="mt-0.5 text-[13px] text-[var(--color-ink-soft)]">{insight.suggestedAction}</p>
                    </div>
                    {insight.cardIds.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {insight.cardIds.map((id) => {
                          const card = getCard(id);
                          return card ? (
                            <Link
                              key={id}
                              href={`/card-finder/${id}`}
                              className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
                            >
                              {card.name}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
