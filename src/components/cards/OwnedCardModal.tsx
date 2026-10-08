"use client";

import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CardFace } from "@/components/cards/CreditCardTile";
import { getIssuer } from "@/data/issuers";
import { estimateCardValue } from "@/lib/engine/value";
import type { CreditCardProduct, OwnedCard } from "@/lib/types";
import { cn, formatCurrency, relativeTimeFromMonths } from "@/lib/utils";
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
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-[200px_1fr] sm:items-center">
          <CardFace card={card} />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={worthKeeping ? "success" : "warning"}>{worthKeeping ? "Worth keeping" : "Reconsider"}</Badge>
              <span className="text-[12.5px] text-[var(--color-ink-faint)]">
                {issuer?.name} · Open {relativeTimeFromMonths(ownedCard.monthsOpen)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-border)]">
              <Stat label="Est. value" value={formatCurrency(value.annualRewardsValue)} />
              <Stat
                label="Net of fee"
                value={formatCurrency(value.netAnnualValue)}
                tone={value.netAnnualValue >= 0 ? "pos" : "neg"}
              />
              <Stat label={monthsUntilRenewal !== null ? "Renews in" : "Annual fee"} value={monthsUntilRenewal !== null ? `${monthsUntilRenewal} mo` : "$0"} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Earning rates</p>
            <div className="divide-y divide-dashed divide-[var(--color-border)]">
              {card.rewardCategories.map((rc) => (
                <div key={rc.category} className="flex items-center justify-between py-1.5 text-[13px]">
                  <span className="capitalize text-[var(--color-ink-soft)]">{rc.category.replace(/_/g, " ")}</span>
                  <span className="figure font-semibold text-[var(--color-ink)]">{rc.multiplier}x</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Benefits</p>
            <ul className="space-y-2">
              {card.benefits.map((b) => (
                <li key={b.label} className="flex items-start gap-2 text-[13px] leading-snug text-[var(--color-ink-soft)]">
                  <Check size={14} className="mt-0.5 shrink-0 text-[var(--color-mint)]" strokeWidth={2.5} />
                  <span>
                    <span className="font-medium text-[var(--color-ink)]">{b.label}.</span> {b.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          <p className="text-[11.5px] text-[var(--color-ink-faint)]">
            Terms verified {new Date(card.dataFreshness.lastVerified).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={onRemove} className="text-[var(--color-danger)] hover:text-[var(--color-danger)]">
            Remove from wallet
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "pos" | "neg" }) {
  return (
    <div className="bg-[var(--color-bg-elevated)] px-3 py-2.5">
      <p className="text-[11px] text-[var(--color-ink-faint)]">{label}</p>
      <p
        className={cn(
          "figure text-[15px] font-semibold text-[var(--color-ink)]",
          tone === "pos" && "text-[var(--color-accent)]",
          tone === "neg" && "text-[var(--color-coral)]"
        )}
      >
        {value}
      </p>
    </div>
  );
}
