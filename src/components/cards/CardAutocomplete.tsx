"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CARDS } from "@/data/cards";
import { getIssuer } from "@/data/issuers";
import type { CreditCardProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CardAutocomplete({ onSelect, excludeIds = [] }: { onSelect: (card: CreditCardProduct) => void; excludeIds?: string[] }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = CARDS.filter((c) => !excludeIds.includes(c.id));
    if (!q) return pool.slice(0, 8);
    return pool.filter((c) => c.name.toLowerCase().includes(q) || getIssuer(c.issuerId)?.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, excludeIds]);

  return (
    <div className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search for your card…"
          className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] pl-10 pr-3 text-[14px] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />
      </div>
      {focused && (
        <div className="absolute z-20 mt-1.5 max-h-72 w-full overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-[var(--shadow-popover)]">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-[13px] text-[var(--color-ink-faint)]">No cards match &ldquo;{query}&rdquo;</p>
          ) : (
            results.map((card) => {
              const issuer = getIssuer(card.issuerId);
              return (
                <button
                  key={card.id}
                  onMouseDown={() => {
                    onSelect(card);
                    setQuery("");
                  }}
                  className={cn("flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[var(--color-bg-subtle)]")}
                >
                  <span>
                    <span className="block text-[13.5px] font-medium text-[var(--color-ink)]">{card.name}</span>
                    <span className="block text-[11.5px] text-[var(--color-ink-faint)]">{issuer?.name}</span>
                  </span>
                  <span className="shrink-0 text-[11.5px] text-[var(--color-ink-faint)]">
                    {card.annualFee === 0 ? "No fee" : `$${card.annualFee}/yr`}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
