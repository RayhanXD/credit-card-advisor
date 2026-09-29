"use client";

import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getIssuer } from "@/data/issuers";
import { estimateCardValue } from "@/lib/engine/value";
import type { CreditCardProduct, OwnedCard } from "@/lib/types";
import { formatCurrency, relativeTimeFromMonths } from "@/lib/utils";
import { Check, Trash2 } from "lucide-react";

export function OwnedCardModal({
  open,
  onClose,
  card,
  ownedCard,
  spending,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  card: CreditCardProduct;
  ownedCard: OwnedCard;
  spending: Parameters<typeof estimateCardValue>[1];
  onRemove: () => void;
}) {
  const issuer = getIssuer(card.issuerId);
  const value = estimateCardValue(card, spending);
  const worthKeeping = value.netAnnualValue >= 0 || card.annualFee === 0;
  const monthsUntilRenewal = card.annualFee > 0 ? 12 - (ownedCard.monthsOpen % 12) : null;

  return (
    <Modal open={open} onClose={onClose} title={card.name} wide>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[12.5px] text-[var(--color-ink-faint)]">{issuer?.name}</p>
            <p className="text-[13px] text-[var(--color-ink-soft)]">
              {card.annualFee === 0 ? "No annual fee" : `${formatCurrency(card.annualFee)}/yr`} · Open {relativeTimeFromMonths(ownedCard.monthsOpen)}
            </p>
          </div>
          <Badge tone={worthKeeping ? "success" : "warning"}>{worthKeeping ? "Worth Keeping" : "Reconsider"}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Est. annual value" value={formatCurrency(value.annualRewardsValue)} />
          <Stat label="Net of fee" value={formatCurrency(value.netAnnualValue)} />
          {monthsUntilRenewal !== null && <Stat label="Renews in" value={`${monthsUntilRenewal} mo`} />}
        </div>

        <div>
          <p className="mb-2 text-[13px] font-medium text-[var(--color-ink)]">Rewards</p>
          <div className="space-y-1.5">
            {card.rewardCategories.map((rc) => (
              <div key={rc.category} className="flex items-center justify-between text-[13px]">
                <span className="capitalize text-[var(--color-ink-soft)]">{rc.category.replace(/_/g, " ")}</span>
                <span className="font-medium text-[var(--color-ink)]">{rc.multiplier}x</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[13px] font-medium text-[var(--color-ink)]">Benefits</p>
          <div className="space-y-2">
            {card.benefits.map((b) => (
              <div key={b.label} className="flex items-start gap-2 text-[13px] text-[var(--color-ink-soft)]">
                <Check size={14} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                <span>
                  <span className="font-medium text-[var(--color-ink)]">{b.label}:</span> {b.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <p className="text-[11px] text-[var(--color-ink-faint)]">
            Verified: {new Date(card.dataFreshness.lastVerified).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
          <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={onRemove}>
            Remove card
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-bg-subtle)] px-3 py-2.5">
      <p className="text-[11px] text-[var(--color-ink-faint)]">{label}</p>
      <p className="text-[15px] font-semibold tabular-nums text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
