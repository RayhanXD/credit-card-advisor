"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CardAutocomplete } from "@/components/cards/CardAutocomplete";
import { CardFace } from "@/components/cards/CreditCardTile";
import { inputClass } from "@/components/ui/TextField";
import { getIssuer } from "@/data/issuers";
import { cn } from "@/lib/utils";
import { getCard } from "@/data/cards";
import type { CreditCardProduct } from "@/lib/types";

export function AddCardModal({
  open,
  onClose,
  excludeIds,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  excludeIds: string[];
  onAdd: (card: CreditCardProduct, monthsOpen: number) => void;
}) {
  const [selected, setSelected] = useState<CreditCardProduct | null>(null);
  const [monthsOpen, setMonthsOpen] = useState(12);

  function reset() {
    setSelected(null);
    setMonthsOpen(12);
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Add a card"
    >
      <div className="space-y-4">
        {!selected ? (
          <CardAutocomplete excludeIds={excludeIds} onSelect={(card) => setSelected(getCard(card.id) ?? card)} />
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-[14px] bg-[var(--color-bg-subtle)] p-3">
              <CardFace card={selected} size="sm" className="w-20 shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold">{selected.name}</p>
                <p className="text-[12px] text-[var(--color-ink-faint)]">{getIssuer(selected.issuerId)?.name}</p>
              </div>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[var(--color-ink)]">How many months have you had it?</span>
              <input
                type="number"
                min={0}
                value={monthsOpen}
                onChange={(e) => setMonthsOpen(Number(e.target.value))}
                className={cn(inputClass, "figure px-3.5")}
              />
            </label>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={reset}>
                Choose different card
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onAdd(selected, monthsOpen);
                  reset();
                  onClose();
                }}
              >
                Add card
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
