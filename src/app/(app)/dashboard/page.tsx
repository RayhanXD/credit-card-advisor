"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { computeFullStrategy } from "@/lib/engine/strategy";
import { buildCreditHealthSnapshot } from "@/lib/engine/creditHealth";
import { estimateCardValue } from "@/lib/engine/value";
import { getCard } from "@/data/cards";
import { CircularScore } from "@/components/ui/CircularScore";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { CardFace } from "@/components/cards/CreditCardTile";
import { MilestoneRail } from "@/components/strategy/MilestoneRail";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Kicker, PageHeader, SectionHeading } from "@/components/ui/Panel";
import { formatCurrency, formatMonthYear } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, CalendarClock, Plus } from "lucide-react";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const linkClass =
  "group inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)]";

export default function DashboardPage() {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return null;

  const strategy = computeFullStrategy(profile);
  const health = buildCreditHealthSnapshot(profile);
  const walletValue = profile.ownedCards.reduce((sum, oc) => {
    const card = getCard(oc.cardId);
    if (!card) return sum;
    return sum + estimateCardValue(card, profile.spending).annualRewardsValue;
  }, 0);
  const totalFees = profile.ownedCards.reduce((sum, oc) => sum + (getCard(oc.cardId)?.annualFee ?? 0), 0);
  const nextCard = strategy.summary.nextStepCardId ? getCard(strategy.summary.nextStepCardId) : undefined;
  const readinessCard = strategy.readiness ? getCard(strategy.readiness.cardId) : undefined;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-10">
      <PageHeader
        kicker={today}
        title={
          <>
            {greeting()}, {profile.name.split(" ")[0] || "there"}.
          </>
        }
        description="Here’s where you stand and what to do next."
      />

      {/* Position */}
      <section className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
          <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-mint)_22%,transparent),transparent_70%)]" />
          <div className="relative grid h-full gap-6 p-5 sm:grid-cols-[1fr_200px] sm:p-7">
            <div className="flex flex-col">
              <Kicker>Current strategy</Kicker>
              <p className="mt-3 font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)] sm:text-[30px]">
                {strategy.primaryGoalLabel}
              </p>
              <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
                {strategy.summary.headline !== strategy.primaryGoalLabel
                  ? strategy.summary.headline
                  : `${profile.goals.length} goal${profile.goals.length === 1 ? "" : "s"} guiding your path.`}
              </p>
              <div className="mt-auto pt-6">
                <Link href="/strategy" className={linkClass}>
                  Open full strategy <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <Link
              href={nextCard ? `/card-finder/${nextCard.id}` : "/strategy"}
              className="group flex flex-col gap-3 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Recommended next step</span>
              {nextCard ? (
                <>
                  <CardFace card={nextCard} className="max-w-[220px] transition-transform duration-300 group-hover:-translate-y-0.5 sm:max-w-none" />
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-semibold leading-snug text-[var(--color-ink)]">{nextCard.name}</span>
                    <ArrowUpRight size={15} className="mt-0.5 shrink-0 text-[var(--color-ink-faint)]" />
                  </span>
                </>
              ) : (
                <span className="text-[13px] text-[var(--color-ink-soft)]">Building your path — see your strategy.</span>
              )}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/credit-health"
            className="group flex flex-col items-center rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-center shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <span className="self-start font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Credit health</span>
            <CircularScore value={health.overallScore} size={112} tone={health.overallScore >= 70 ? "success" : "warning"} sublabel="of 100" className="my-2" />
            <span className="mt-auto text-[12px] font-semibold text-[var(--color-accent)] group-hover:text-[var(--color-ink)]">View breakdown →</span>
          </Link>

          {strategy.readiness ? (
            <Link
              href="/strategy"
              className="group flex flex-col items-center rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-center shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="self-start truncate font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                Readiness
              </span>
              <CircularScore
                value={strategy.readiness.overallPercent}
                size={112}
                tone={strategy.readiness.overallPercent >= 72 ? "success" : "warning"}
                threshold={72}
                label={`${strategy.readiness.overallPercent}%`}
                sublabel={readinessCard?.name}
                className="my-2"
              />
              <span className="mt-auto text-[12px] font-semibold text-[var(--color-accent)] group-hover:text-[var(--color-ink)]">Full path →</span>
            </Link>
          ) : (
            <Link
              href="/cards"
              className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Wallet value</span>
              <span className="figure mt-auto text-[28px] font-semibold leading-none text-[var(--color-ink)]">{formatCurrency(walletValue)}</span>
              <span className="mt-1.5 text-[12px] text-[var(--color-ink-faint)]">est. rewards / year</span>
              <span className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                <span
                  className="bg-[var(--color-mint)]"
                  style={{ width: `${walletValue + totalFees > 0 ? (walletValue / (walletValue + totalFees)) * 100 : 0}%` }}
                />
                <span className="bg-[var(--color-coral-vivid)]" style={{ width: `${walletValue + totalFees > 0 ? (totalFees / (walletValue + totalFees)) * 100 : 0}%` }} />
              </span>
              <span className="mt-1.5 text-[11px] text-[var(--color-ink-faint)]">
                vs <span className="figure">{formatCurrency(totalFees)}</span> in fees
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* Strategy timeline */}
      <section className="space-y-4">
        <SectionHeading
          kicker="Next 24 months"
          title="Your strategy"
          action={
            <Link href="/strategy" className={linkClass}>
              Full strategy <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />
        <MilestoneRail entries={strategy.summary.timeline} limit={4} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {strategy.topRecommendation && (
          <div className="space-y-4">
            <SectionHeading kicker="Highest fit" title="Top recommendation" />
            <RecommendationCard recommendation={strategy.topRecommendation} highlight />
          </div>
        )}

        <div className="space-y-4">
          <SectionHeading
            kicker={`${profile.ownedCards.length} card${profile.ownedCards.length === 1 ? "" : "s"}`}
            title="Your wallet"
            action={
              <Link href="/cards" className={linkClass}>
                Manage <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            }
          />
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
            {profile.ownedCards.length === 0 ? (
              <div className="p-5">
                <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
                  No cards yet. Your recommended first card is on the left.
                </p>
                <Link href="/cards" className={`${linkClass} mt-3`}>
                  <Plus size={13} /> Add a card you have
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {profile.ownedCards.slice(0, 4).map((oc) => {
                  const card = getCard(oc.cardId);
                  if (!card) return null;
                  return (
                    <li key={oc.id} className="flex items-center gap-3 px-4 py-3">
                      <CardFace card={card} size="sm" className="w-12 shrink-0" />
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--color-ink)]">{card.name}</span>
                      <span className="figure text-[12px] text-[var(--color-ink-faint)]">{card.annualFee === 0 ? "$0" : `$${card.annualFee}`}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="flex items-center gap-2.5 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
              <CalendarClock size={14} className="text-[var(--color-teal-vivid)]" />
              <span className="text-[12.5px] text-[var(--color-ink-soft)]">
                Next review <span className="font-semibold text-[var(--color-ink)]">{formatMonthYear(profile.nextReviewDate)}</span>
              </span>
            </div>
          </div>
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}
