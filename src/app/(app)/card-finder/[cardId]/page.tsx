"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getCard } from "@/data/cards";
import { getIssuer } from "@/data/issuers";
import { getTransferPartner } from "@/data/transferPartners";
import { scoreCard } from "@/lib/engine/scoring";
import { estimateCardValue } from "@/lib/engine/value";
import { FitBadge } from "@/components/cards/FitBadge";
import { ScoreBreakdownPanel } from "@/components/cards/ScoreBreakdownPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HardInquiryWarning } from "@/components/ui/Disclaimer";
import { AddCardModal } from "@/components/cards/AddCardModal";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Check, AlertTriangle, ExternalLink, Plus, ChevronDown } from "lucide-react";
import { notFound } from "next/navigation";

export default function CardDetailPage({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = use(params);
  const profile = useAppStore((s) => s.profile);
  const addCard = useAppStore((s) => s.addCard);
  const { show } = useToast();
  const [scoreOpen, setScoreOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const card = getCard(cardId);
  if (!card) notFound();
  if (!profile) return null;

  const issuer = getIssuer(card.issuerId);
  const owned = profile.ownedCards.find((oc) => oc.cardId === cardId);
  const recommendation = !owned ? scoreCard(card, profile) : null;
  const value = estimateCardValue(card, profile.spending);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/card-finder" className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
        <ArrowLeft size={14} /> Card Finder
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[12.5px] font-medium text-[var(--color-ink-faint)]">{issuer?.name}</p>
          <h1 className="text-[26px] font-semibold tracking-tight">{card.name}</h1>
          <p className="mt-1 text-[13.5px] text-[var(--color-ink-soft)]">
            {card.annualFee === 0 ? "No annual fee" : `${formatCurrency(card.annualFee)} annual fee`} · {card.network.toUpperCase()}
          </p>
        </div>
        {owned ? (
          <Badge tone="success">In Your Wallet</Badge>
        ) : (
          recommendation && <FitBadge fitLabel={recommendation.fitLabel} />
        )}
      </div>

      {owned ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Est. annual value" value={formatCurrency(value.annualRewardsValue)} />
          <Stat label="Net of fee" value={formatCurrency(value.netAnnualValue)} />
          <Stat label="Open" value={`${owned.monthsOpen} mo`} />
        </div>
      ) : (
        recommendation && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[var(--color-ink-soft)]">Fit score</p>
                <p className="text-[26px] font-semibold tabular-nums">{recommendation.score.total}/100</p>
              </div>
              <Button size="sm" variant="secondary" icon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
                I have this card
              </Button>
            </div>
            <div className="mt-4 space-y-1.5">
              {recommendation.reasons.map((r) => (
                <div key={r} className="flex items-start gap-2 text-[13px] text-[var(--color-ink-soft)]">
                  <Check size={14} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                  {r}
                </div>
              ))}
              {recommendation.cautions.map((c) => (
                <div key={c} className="flex items-start gap-2 text-[13px] text-[var(--color-ink-soft)]">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--color-warning)]" />
                  {c}
                </div>
              ))}
            </div>
            <button onClick={() => setScoreOpen((v) => !v)} className="mt-4 flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-accent)]">
              Why this recommendation?
              <ChevronDown size={14} className={scoreOpen ? "rotate-180" : ""} />
            </button>
            {scoreOpen && (
              <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                <ScoreBreakdownPanel score={recommendation.score} />
              </div>
            )}
          </div>
        )
      )}

      <Section title="Welcome Offer">
        <p className="text-[13.5px] text-[var(--color-ink-soft)]">{card.welcomeOffer.description}</p>
        {card.welcomeOffer.spendRequirement > 0 && (
          <p className="mt-1 text-[12.5px] text-[var(--color-ink-faint)]">
            After {formatCurrency(card.welcomeOffer.spendRequirement)} in purchases within {card.welcomeOffer.timeframeMonths} months.
          </p>
        )}
      </Section>

      <Section title="Rewards">
        <div className="space-y-2">
          {card.rewardCategories.map((rc) => (
            <div key={rc.category} className="flex items-center justify-between text-[13.5px]">
              <span className="capitalize text-[var(--color-ink-soft)]">{rc.category.replace(/_/g, " ")}</span>
              <span className="font-medium text-[var(--color-ink)]">
                {rc.multiplier}x{rc.cap ? ` (up to ${formatCurrency(rc.cap)}/yr)` : ""}
              </span>
            </div>
          ))}
          {card.rewardCategories.length === 0 && <p className="text-[13.5px] text-[var(--color-ink-faint)]">No elevated categories.</p>}
        </div>
      </Section>

      <Section title="Benefits">
        <div className="space-y-2.5">
          {card.benefits.map((b) => (
            <div key={b.label} className="flex items-start gap-2 text-[13.5px] text-[var(--color-ink-soft)]">
              <Check size={14} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
              <span>
                <span className="font-medium text-[var(--color-ink)]">{b.label}:</span> {b.description}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {card.transferPartnerIds.length > 0 && (
        <Section title="Transfer Partners">
          <div className="flex flex-wrap gap-1.5">
            {card.transferPartnerIds.map((id) => {
              const partner = getTransferPartner(id);
              return partner ? (
                <span key={id} className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink-soft)]">
                  {partner.name}
                </span>
              ) : null;
            })}
          </div>
        </Section>
      )}

      <Section title="Eligibility Considerations">
        <ul className="space-y-1.5 text-[13.5px] text-[var(--color-ink-soft)]">
          <li>Typical minimum credit standing: {card.eligibility.minCreditScoreBand.replace("_", " ")}</li>
          <li>{card.eligibility.incomeGuidance}</li>
          {card.eligibility.issuerRules.map((r) => (
            <li key={r}>{r}</li>
          ))}
          <li className="text-[var(--color-ink-faint)]">{card.eligibility.notes}</li>
        </ul>
      </Section>

      <Section title="Data Freshness">
        <p className="text-[12.5px] text-[var(--color-ink-faint)]">
          Last verified {new Date(card.dataFreshness.lastVerified).toLocaleDateString("en-US", { month: "long", year: "numeric" })} from{" "}
          {card.dataFreshness.source}. Confidence: {card.dataFreshness.confidence}. Card terms can change — always confirm current
          details with the issuer.
        </p>
      </Section>

      <HardInquiryWarning />

      <a href={card.applicationUrl} target="_blank" rel="noopener noreferrer" className="block">
        <Button size="lg" className="w-full" iconRight={<ExternalLink size={16} />}>
          Continue to {issuer?.name}
        </Button>
      </a>

      <AddCardModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        excludeIds={profile.ownedCards.map((oc) => oc.cardId)}
        onAdd={(c, monthsOpen) => {
          addCard({ id: `owned_${Date.now()}`, cardId: c.id, monthsOpen });
          show(`${c.name} added to your wallet`, "success");
        }}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
      <p className="mb-3 text-[13px] font-semibold text-[var(--color-ink)]">{title}</p>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">{label}</p>
      <p className="text-[17px] font-semibold tabular-nums">{value}</p>
    </div>
  );
}
