"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, SlidersHorizontal, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getCard } from "@/data/cards";
import { CreditCardTile } from "@/components/cards/CreditCardTile";
import { OwnedCardModal } from "@/components/cards/OwnedCardModal";
import { AddCardModal } from "@/components/cards/AddCardModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { estimateCardValue } from "@/lib/engine/value";
import { formatCurrency } from "@/lib/utils";
import { WalletCards } from "lucide-react";

export default function MyCardsPage() {
  const profile = useAppStore((s) => s.profile);
  const addCard = useAppStore((s) => s.addCard);
  const removeCard = useAppStore((s) => s.removeCard);
  const { show } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedOwnedId, setSelectedOwnedId] = useState<string | null>(null);

  if (!profile) return null;

  const totalValue = profile.ownedCards.reduce((sum, oc) => {
    const card = getCard(oc.cardId);
    return card ? sum + estimateCardValue(card, profile.spending).annualRewardsValue : sum;
  }, 0);
  const totalFees = profile.ownedCards.reduce((sum, oc) => sum + (getCard(oc.cardId)?.annualFee ?? 0), 0);

  const selectedOwned = profile.ownedCards.find((oc) => oc.id === selectedOwnedId);
  const selectedCard = selectedOwned ? getCard(selectedOwned.cardId) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">My Cards</h1>
          <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">Every card, and what it&rsquo;s actually earning you.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/cards/optimize">
            <Button variant="secondary" icon={<SlidersHorizontal size={15} />}>
              Optimize My Wallet
            </Button>
          </Link>
          <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
            Add a card
          </Button>
        </div>
      </div>

      {profile.ownedCards.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">Cards</p>
            <p className="text-[19px] font-semibold">{profile.ownedCards.length}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">Est. annual value</p>
            <p className="text-[19px] font-semibold tabular-nums">{formatCurrency(totalValue)}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">Total annual fees</p>
            <p className="text-[19px] font-semibold tabular-nums">{formatCurrency(totalFees)}</p>
          </div>
        </div>
      )}

      {profile.ownedCards.length === 0 ? (
        <EmptyState
          icon={<WalletCards size={28} />}
          title="No cards yet"
          description="Add the cards you already have so every recommendation accounts for them — or check your dashboard for a recommended first card."
          action={
            <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
              Add your first card
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {profile.ownedCards.map((oc) => {
            const card = getCard(oc.cardId);
            if (!card) return null;
            return <CreditCardTile key={oc.id} card={card} onClick={() => setSelectedOwnedId(oc.id)} />;
          })}
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-5 py-4">
        <p className="text-[13.5px] text-[var(--color-ink-soft)]">See how these cards compare against what we&rsquo;d recommend next.</p>
        <Link href="/strategy" className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-[var(--color-accent)]">
          My Strategy <ArrowRight size={14} />
        </Link>
      </div>

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
