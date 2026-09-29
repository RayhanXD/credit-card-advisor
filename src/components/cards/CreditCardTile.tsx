"use client";

import { getIssuer } from "@/data/issuers";
import type { CreditCardProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

const NETWORK_LABEL: Record<string, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMERICAN EXPRESS",
  discover: "DISCOVER",
};

// A stylized, generic card front — deliberately not a reproduction of any
// issuer's real card art, just a premium-feeling gradient panel with the
// card's name, issuer, and network mark.
export function CreditCardTile({ card, onClick, className }: { card: CreditCardProduct; onClick?: () => void; className?: string }) {
  const issuer = getIssuer(card.issuerId);
  const accent = issuer?.accentColor ?? "#161513";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex aspect-[1.586] w-full flex-col justify-between overflow-hidden rounded-2xl p-5 text-left shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
        className
      )}
      style={{ background: `linear-gradient(135deg, ${accent} 0%, ${shade(accent, -28)} 100%)` }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, white, transparent 70%)" }}
      />
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">{issuer?.name}</span>
        {card.annualFee === 0 && (
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">No fee</span>
        )}
      </div>
      <div>
        <p className="text-[16px] font-semibold leading-snug text-white">{card.name}</p>
        <p className="mt-2 text-[10.5px] font-medium tracking-[0.12em] text-white/60">{NETWORK_LABEL[card.network] ?? card.network.toUpperCase()}</p>
      </div>
    </button>
  );
}

function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}
