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
import { CardFace } from "@/components/cards/CreditCardTile";
import { ReasonList } from "@/components/cards/ReasonList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Panel";
import { HardInquiryWarning } from "@/components/ui/Disclaimer";
import { AddCardModal } from "@/components/cards/AddCardModal";
import { useToast } from "@/components/ui/Toast";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Check, ExternalLink, Plus, Plane, Hotel, Gift, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

export default function CardDetailPage({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = use(params);
  const profile = useAppStore((s) => s.profile);
  const addCard = useAppStore((s) => s.addCard);
  const { show } = useToast();
  const [addOpen, setAddOpen] = useState(false);

  const card = getCard(cardId);
  if (!card) notFound();
  if (!profile) return null;

  const issuer = getIssuer(card.issuerId);
  const owned = profile.ownedCards.find((oc) => oc.cardId === cardId);
  const recommendation = !owned ? scoreCard(card, profile) : null;
  const value = estimateCardValue(card, profile.spending);
  const maxMultiplier = Math.max(1, ...card.rewardCategories.map((rc) => rc.multiplier));

  return (
    <div className="space-y-8">
      <Link href="/card-finder" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]">
        <ArrowLeft size={14} /> Card Finder
      </Link>

      {/* Hero */}
      <section className="bg-grid relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
        <div
          className="pointer-events-none absolute -left-20 -top-28 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: issuer?.accentColor }}
        />
        <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[300px_1fr] md:items-center">
          <CardFace card={card} className="mx-auto w-full max-w-[300px] [transform:perspective(900px)_rotateY(-8deg)_rotateX(4deg)]" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Kicker tone="ink">{issuer?.name}</Kicker>
              <h1 className="font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink)] lg:text-[38px]">{card.name}</h1>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {owned ? <Badge tone="success">In your wallet</Badge> : recommendation && <FitBadge fitLabel={recommendation.fitLabel} />}
                <Badge>{card.annualFee === 0 ? "No annual fee" : `${formatCurrency(card.annualFee)} annual fee`}</Badge>
                <Badge>{card.network.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-border)]">
              <Figure label="Est. rewards" value={formatCurrency(value.annualRewardsValue)} />
              <Figure label="Net of fee" value={formatCurrency(value.netAnnualValue)} tone={value.netAnnualValue >= 0 ? "pos" : "neg"} />
              {owned ? <Figure label="Open" value={`${owned.monthsOpen} mo`} /> : <Figure label="Fit score" value={`${recommendation?.score.total ?? "—"}`} suffix="/100" />}
            </div>
            <p className="text-[11.5px] text-[var(--color-ink-faint)]">Estimates use your stated monthly spending.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {recommendation && (
            <Block title="Why it fits — and why it might not" kicker="Explainability">
              <ReasonList reasons={recommendation.reasons} cautions={recommendation.cautions} />
              <div className="mt-5 border-t border-dashed border-[var(--color-border-strong)] pt-5">
                <ScoreBreakdownPanel score={recommendation.score} />
              </div>
            </Block>
          )}

          <Block title="Earning rates" kicker="Rewards">
            {card.rewardCategories.length === 0 ? (
              <p className="text-[13.5px] text-[var(--color-ink-faint)]">No elevated categories.</p>
            ) : (
              <ul className="space-y-2.5">
                {card.rewardCategories.map((rc) => (
                  <li key={rc.category} className="grid grid-cols-[minmax(0,140px)_1fr_auto] items-center gap-3 text-[13px]">
                    <span className="truncate capitalize text-[var(--color-ink-soft)]">{rc.category.replace(/_/g, " ")}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                      <span
                        className="block h-full rounded-full bg-[linear-gradient(90deg,var(--color-teal-vivid),var(--color-mint))]"
                        style={{ width: `${(rc.multiplier / maxMultiplier) * 100}%` }}
                      />
                    </span>
                    <span className="figure text-right font-semibold text-[var(--color-ink)]">
                      {rc.multiplier}x
                      {rc.cap ? <span className="ml-1 text-[11px] font-normal text-[var(--color-ink-faint)]">to {formatCurrency(rc.cap)}/yr</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Block>

          <Block title="Benefits" kicker="Included">
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {card.benefits.map((b) => (
                <li key={b.label} className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--color-ink-soft)]">
                  <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span>
                    <span className="font-medium text-[var(--color-ink)]">{b.label}.</span> {b.description}
                  </span>
                </li>
              ))}
            </ul>
          </Block>

          {card.transferPartnerIds.length > 0 && (
            <Block title="Transfer partners" kicker="Points">
              <div className="flex flex-wrap gap-2">
                {card.transferPartnerIds.map((id) => {
                  const partner = getTransferPartner(id);
                  if (!partner) return null;
                  const Icon = partner.type === "airline" ? Plane : Hotel;
                  return (
                    <span
                      key={id}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-[9px] px-2.5 py-1.5 text-[12.5px] font-medium",
                        partner.type === "airline" ? "bg-[var(--color-teal-soft)] text-[var(--color-teal)]" : "bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]"
                      )}
                    >
                      <Icon size={13} />
                      {partner.name}
                    </span>
                  );
                })}
              </div>
            </Block>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-gold-soft)] text-[var(--color-gold)]">
                <Gift size={16} />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Welcome offer</p>
                <p className="mt-1 text-[13.5px] font-medium leading-snug text-[var(--color-ink)]">{card.welcomeOffer.description}</p>
                {card.welcomeOffer.spendRequirement > 0 && (
                  <p className="mt-1 text-[12px] text-[var(--color-ink-faint)]">
                    After <span className="figure">{formatCurrency(card.welcomeOffer.spendRequirement)}</span> spend in {card.welcomeOffer.timeframeMonths} months
                  </p>
                )}
              </div>
            </div>

            <HardInquiryWarning />

            <a href={card.applicationUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button size="lg" className="w-full" iconRight={<ExternalLink size={15} />}>
                Continue to {issuer?.name}
              </Button>
            </a>
            {!owned && (
              <Button size="md" variant="secondary" className="w-full" icon={<Plus size={15} />} onClick={() => setAddOpen(true)}>
                I already have this card
              </Button>
            )}
          </div>

          <div className="space-y-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-[var(--color-teal-vivid)]" />
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">Eligibility considerations</p>
            </div>
            <ul className="space-y-2 text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">
              <li>
                Typical minimum credit standing:{" "}
                <span className="font-medium capitalize text-[var(--color-ink)]">{card.eligibility.minCreditScoreBand.replace("_", " ")}</span>
              </li>
              <li>{card.eligibility.incomeGuidance}</li>
              {card.eligibility.issuerRules.map((r) => (
                <li key={r}>{r}</li>
              ))}
              <li className="text-[var(--color-ink-faint)]">{card.eligibility.notes}</li>
            </ul>
          </div>

          <div className="rounded-[14px] border border-dashed border-[var(--color-border-strong)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Data freshness</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-ink-faint)]">
              Last verified{" "}
              <span className="text-[var(--color-ink-soft)]">
                {new Date(card.dataFreshness.lastVerified).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>{" "}
              from {card.dataFreshness.source}. Confidence: {card.dataFreshness.confidence}. Terms change — confirm current details with the issuer.
            </p>
          </div>
        </aside>
      </div>

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

function Block({ title, kicker, children }: { title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="mb-4 space-y-1.5">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2 className="font-display text-[17px] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Figure({ label, value, tone, suffix }: { label: string; value: string; tone?: "pos" | "neg"; suffix?: string }) {
  return (
    <div className="bg-[var(--color-bg-elevated)] px-3.5 py-3">
      <p className="text-[11px] text-[var(--color-ink-faint)]">{label}</p>
      <p
        className={cn(
          "figure mt-0.5 text-[17px] font-semibold text-[var(--color-ink)]",
          tone === "pos" && "text-[var(--color-accent)]",
          tone === "neg" && "text-[var(--color-coral)]"
        )}
      >
        {value}
        {suffix && <span className="text-[12px] font-normal text-[var(--color-ink-faint)]">{suffix}</span>}
      </p>
    </div>
  );
}
