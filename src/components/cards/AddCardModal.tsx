"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CardAutocomplete } from "@/components/cards/CardAutocomplete";
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
            <div className="rounded-xl bg-[var(--color-bg-subtle)] px-4 py-3">
              <p className="text-[14px] font-medium">{selected.name}</p>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[var(--color-ink)]">How many months have you had it?</span>
              <input
                type="number"
                min={0}
                value={monthsOpen}
                onChange={(e) => setMonthsOpen(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 text-[14px] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
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
