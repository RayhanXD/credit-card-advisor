"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, SlidersHorizontal, ArrowRight, WalletCards } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getCard } from "@/data/cards";
import { CreditCardTile } from "@/components/cards/CreditCardTile";
import { OwnedCardModal } from "@/components/cards/OwnedCardModal";
import { AddCardModal } from "@/components/cards/AddCardModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/Panel";
import { useToast } from "@/components/ui/Toast";
import { estimateCardValue } from "@/lib/engine/value";
import { cn, formatCurrency, relativeTimeFromMonths } from "@/lib/utils";

export default function MyCardsPage() {
  const profile = useAppStore((s) => s.profile);
  const addCard = useAppStore((s) => s.addCard);
  const removeCard = useAppStore((s) => s.removeCard);
  const { show } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedOwnedId, setSelectedOwnedId] = useState<string | null>(null);

  if (!profile) return null;

  const rows = profile.ownedCards
    .map((oc) => {
      const card = getCard(oc.cardId);
      return card ? { oc, card, value: estimateCardValue(card, profile.spending) } : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const totalValue = rows.reduce((sum, r) => sum + r.value.annualRewardsValue, 0);
  const totalFees = rows.reduce((sum, r) => sum + r.card.annualFee, 0);
  const net = totalValue - totalFees;

  const selectedOwned = profile.ownedCards.find((oc) => oc.id === selectedOwnedId);
  const selectedCard = selectedOwned ? getCard(selectedOwned.cardId) : undefined;

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Wallet"
        title="My Cards"
        description="Every card you hold, and what it’s actually earning you."
        actions={
          <>
            <Link href="/cards/optimize">
              <Button variant="secondary" icon={<SlidersHorizontal size={15} />}>
                Optimize My Wallet
              </Button>
            </Link>
            <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
              Add a card
            </Button>
          </>
        }
      />

      {rows.length > 0 && (
        <section className="grid overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)] sm:grid-cols-[repeat(3,1fr)_1.4fr]">
          <Ledger label="Cards" value={String(rows.length)} />
          <Ledger label="Est. annual value" value={formatCurrency(totalValue)} tone="pos" />
          <Ledger label="Annual fees" value={formatCurrency(totalFees)} tone={totalFees > 0 ? "neg" : undefined} />
          <div className="col-span-full flex flex-col justify-center gap-2 border-t border-[var(--color-border)] p-5 sm:col-span-1 sm:border-l sm:border-t-0">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Net per year</span>
              <span className={cn("figure text-[20px] font-semibold", net >= 0 ? "text-[var(--color-accent)]" : "text-[var(--color-coral)]")}>
                {net >= 0 ? "+" : ""}
                {formatCurrency(net)}
              </span>
            </div>
            <div className="flex h-2 gap-[2px] overflow-hidden rounded-full">
              {rows.map((r, i) => (
                <span
                  key={r.oc.id}
                  title={`${r.card.name}: ${formatCurrency(r.value.annualRewardsValue)}`}
                  style={{ flexGrow: Math.max(r.value.annualRewardsValue, 1), background: `var(--series-${(i % 6) + 1})` }}
                />
              ))}
            </div>
            <span className="text-[11px] text-[var(--color-ink-faint)]">Share of rewards by card</span>
          </div>
        </section>
      )}

      {rows.length === 0 ? (
        <EmptyState
          icon={<WalletCards size={22} />}
          title="No cards yet"
          description="Add the cards you already have so every recommendation accounts for them — or check your dashboard for a recommended first card."
          action={
            <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
              Add your first card
            </Button>
          }
        />
      ) : (
        <section className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map(({ oc, card, value }, i) => (
            <div key={oc.id} className="animate-rise space-y-3" style={{ animationDelay: `${i * 60}ms` }}>
              <CreditCardTile card={card} onClick={() => setSelectedOwnedId(oc.id)} />
              <div className="flex items-start justify-between gap-3 px-1">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-[var(--color-ink)]">{card.name}</p>
                  <p className="text-[12px] text-[var(--color-ink-faint)]">Open {relativeTimeFromMonths(oc.monthsOpen)}</p>
                </div>
                <div className="text-right">
                  <p className={cn("figure text-[13.5px] font-semibold", value.netAnnualValue >= 0 ? "text-[var(--color-accent)]" : "text-[var(--color-coral)]")}>
                    {value.netAnnualValue >= 0 ? "+" : ""}
                    {formatCurrency(value.netAnnualValue)}
                  </p>
                  <p className="text-[11px] text-[var(--color-ink-faint)]">net / yr</p>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setAddOpen(true)}
            className="flex aspect-[1.586] flex-col items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-[var(--color-border-strong)] text-[13px] font-medium text-[var(--color-ink-faint)] transition-colors hover:border-[var(--color-mint)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-ink)]"
          >
            <Plus size={20} />
            Add a card
          </button>
        </section>
      )}

      <Link
        href="/strategy"
        className="group flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4 transition-colors hover:border-[var(--color-border-strong)]"
      >
        <p className="text-[13.5px] text-[var(--color-ink-soft)]">See how these cards compare against what we’d recommend next.</p>
        <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[var(--color-accent)]">
          My Strategy <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>

      {selectedOwned && selectedCard && (
        <OwnedCardModal
          open={!!selectedOwnedId}
          onClose={() => setSelectedOwnedId(null)}
          card={selectedCard}
          ownedCard={selectedOwned}
          spending={profile.spending}
          onRemove={() => {
            removeCard(selectedOwned.id);
            setSelectedOwnedId(null);
            show(`${selectedCard.name} removed`, "info");
          }}
        />
      )}

      <AddCardModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        excludeIds={profile.ownedCards.map((oc) => oc.cardId)}
        onAdd={(card, monthsOpen) => {
          addCard({ id: `owned_${Date.now()}`, cardId: card.id, monthsOpen });
          show(`${card.name} added to your wallet`, "success");
        }}
      />
    </div>
  );
}

function Ledger({ label, value, tone }: { label: string; value: string; tone?: "pos" | "neg" }) {
  return (
    <div className="border-b border-r border-[var(--color-border)] p-5 last:border-r-0 sm:border-b-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{label}</p>
      <p
        className={cn(
          "figure mt-2 text-[22px] font-semibold text-[var(--color-ink)]",
          tone === "pos" && "text-[var(--color-ink)]",
          tone === "neg" && "text-[var(--color-coral)]"
        )}
      >
        {value}
      </p>
    </div>
  );
}
