"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { computeFullStrategy } from "@/lib/engine/strategy";
import { buildCreditHealthSnapshot } from "@/lib/engine/creditHealth";
import { estimateCardValue } from "@/lib/engine/value";
import { getCard } from "@/data/cards";
import { StatCard } from "@/components/dashboard/StatCard";
import { CircularScore } from "@/components/ui/CircularScore";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { formatCurrency, formatMonthYear } from "@/lib/utils";
import { ArrowRight, Compass, HeartPulse, Wallet, CalendarClock } from "lucide-react";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)] lg:text-[30px]">
          {greeting()}, {profile.name.split(" ")[0] || "there"}.
        </h1>
        <p className="mt-1 text-[14.5px] text-[var(--color-ink-soft)]">Here&rsquo;s your credit strategy.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Credit Health" icon={<HeartPulse size={15} className="text-[var(--color-ink-faint)]" />}>
          <div className="flex items-center gap-3">
            <CircularScore value={health.overallScore} size={56} strokeWidth={6} tone="success" />
            <Link href="/credit-health" className="text-[12.5px] font-medium text-[var(--color-accent)]">
              View breakdown →
            </Link>
          </div>
        </StatCard>

        <StatCard
          label="Current Strategy"
          value={strategy.primaryGoalLabel}
          sub={strategy.summary.headline !== strategy.primaryGoalLabel ? strategy.summary.headline : `${profile.goals.length} goal${profile.goals.length === 1 ? "" : "s"} guiding your path`}
          icon={<Compass size={15} className="text-[var(--color-ink-faint)]" />}
        />

        <StatCard
          label="Recommended Next Step"
          value={strategy.summary.nextStepCardId ? getCard(strategy.summary.nextStepCardId)?.name : "—"}
          sub={
            <Link href="/strategy" className="font-medium text-[var(--color-accent)]">
              See why →
            </Link>
          }
        />

        {strategy.readiness ? (
          <StatCard label={`${getCard(strategy.readiness.cardId)?.name ?? "Goal"} Readiness`}>
            <div className="flex items-center gap-3">
              <CircularScore value={strategy.readiness.overallPercent} size={56} strokeWidth={6} tone="accent" />
              <Link href="/strategy" className="text-[12.5px] font-medium text-[var(--color-accent)]">
                Full path →
              </Link>
            </div>
          </StatCard>
        ) : (
          <StatCard
            label="Wallet Value"
            value={formatCurrency(walletValue)}
            sub="Estimated annual rewards value"
            icon={<Wallet size={15} className="text-[var(--color-ink-faint)]" />}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Your Strategy</h2>
            <Link href="/strategy" className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-accent)]">
              Full strategy <ArrowRight size={13} />
            </Link>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <ol className="space-y-4">
              {strategy.summary.timeline.slice(0, 4).map((entry, i) => (
                <li key={entry.label} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-subtle)] text-[11.5px] font-semibold text-[var(--color-ink)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-medium text-[var(--color-ink)]">{entry.label}</p>
                    <p className="text-[13px] text-[var(--color-ink-soft)]">{entry.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {strategy.topRecommendation && (
            <div className="space-y-2">
              <h2 className="text-[15px] font-semibold">Top Recommendation</h2>
              <RecommendationCard recommendation={strategy.topRecommendation} highlight />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock size={15} className="text-[var(--color-ink-faint)]" />
              <span className="text-[13px] font-medium text-[var(--color-ink)]">Next Review</span>
            </div>
            <p className="text-[14px] text-[var(--color-ink-soft)]">{formatMonthYear(profile.nextReviewDate)}</p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <p className="mb-3 text-[13px] font-medium text-[var(--color-ink)]">Your wallet</p>
            <div className="space-y-2">
              {profile.ownedCards.length === 0 ? (
                <p className="text-[13px] text-[var(--color-ink-faint)]">No cards yet — see your recommended first card above.</p>
              ) : (
                profile.ownedCards.slice(0, 4).map((oc) => {
                  const card = getCard(oc.cardId);
                  if (!card) return null;
                  return (
                    <div key={oc.id} className="flex items-center justify-between text-[13px]">
                      <span className="text-[var(--color-ink)]">{card.name}</span>
                      <span className="text-[var(--color-ink-faint)]">{card.annualFee === 0 ? "$0" : `$${card.annualFee}`}</span>
                    </div>
                  );
                })
              )}
            </div>
            <Link href="/cards" className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-accent)]">
              Manage cards <ArrowRight size={13} />
            </Link>
          </div>

          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
