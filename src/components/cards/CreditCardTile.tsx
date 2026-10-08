"use client";

import { getIssuer } from "@/data/issuers";
import type { CreditCardProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

const NETWORK_LABEL: Record<string, string> = {
  visa: "VISA",
  mastercard: "mastercard",
  amex: "AMEX",
  discover: "DISCOVER",
};

// A stylized, generic card front — deliberately not a reproduction of any
// issuer's real card art. Issuer color drives a layered gradient with a fine
// guilloche pattern, a drawn EMV chip, and the network wordmark.
export function CardFace({ card, className, size = "md" }: { card: CreditCardProduct; className?: string; size?: "sm" | "md" }) {
  const issuer = getIssuer(card.issuerId);
  const accent = issuer?.accentColor ?? "#1c2a24";
  const small = size === "sm";

  return (
    <div className={cn("@container", className)}>
      <div
        className={cn(
          "relative isolate flex aspect-[1.586] w-full flex-col justify-between overflow-hidden p-[7cqw] text-left text-white",
          small ? "rounded-[clamp(4px,6cqw,10px)]" : "rounded-[clamp(10px,6cqw,18px)]"
        )}
        style={{
          background: `radial-gradient(120% 90% at 100% 0%, ${shade(accent, 28)} 0%, transparent 55%), radial-gradient(90% 80% at 0% 100%, ${shade(accent, -32)} 0%, transparent 60%), ${accent}`,
          boxShadow: `0 1px 0 rgba(255,255,255,0.18) inset, 0 18px 40px -18px ${shade(accent, -20)}`,
        }}
      >
        <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.16]" viewBox="0 0 320 200" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <path
              key={i}
              d={`M -20 ${150 - i * 9} C 60 ${110 - i * 9}, 140 ${200 - i * 9}, 340 ${80 - i * 7}`}
              stroke="white"
              strokeWidth="0.6"
              fill="none"
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.14)_48%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-[clamp(5px,3.6cqw,11px)] font-medium uppercase tracking-[0.14em] text-white/75">
            {issuer?.name}
          </span>
          {!small && card.annualFee === 0 && (
            <span className="shrink-0 rounded-[5px] bg-white/15 px-1.5 py-0.5 font-mono text-[clamp(7px,3.2cqw,10px)] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
              $0 fee
            </span>
          )}
        </div>

        {!small && (
          <div className="flex items-center gap-[3cqw]">
            <span className="relative h-[9cqw] w-[12cqw] overflow-hidden rounded-[5px] bg-[linear-gradient(135deg,#f6dc93,#c79a3e_55%,#efcf7c)] shadow-[0_0_0_0.5px_rgba(0,0,0,0.25)_inset]">
              <span className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
              <span className="absolute inset-y-0 left-1/3 w-px bg-black/20" />
              <span className="absolute inset-y-0 left-2/3 w-px bg-black/20" />
            </span>
            <svg viewBox="0 0 14 16" fill="none" aria-hidden="true" className="h-[5.5cqw] w-[5cqw] opacity-70">
              {[3, 6.5, 10].map((x, i) => (
                <path key={x} d={`M ${x} ${3 - i} Q ${x + 3 + i} 8 ${x} ${13 + i}`} stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              ))}
            </svg>
          </div>
        )}

        <div className="flex items-end justify-between gap-[3cqw]">
          <p className="line-clamp-2 font-display text-[clamp(6px,5.4cqw,17px)] font-semibold leading-[1.15] tracking-[-0.01em] text-white">
            {card.name}
          </p>
          <span
            className={cn(
              "shrink-0 text-[clamp(5px,3.6cqw,12px)] font-semibold italic tracking-[0.04em] text-white/85",
              card.network === "mastercard" && "not-italic lowercase"
            )}
          >
            {NETWORK_LABEL[card.network] ?? card.network.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CreditCardTile({ card, onClick, className }: { card: CreditCardProduct; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={`${card.name} details`}
      className={cn(
        "group block w-full rounded-[18px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:rotate-[-0.6deg]",
        className
      )}
    >
      <CardFace card={card} />
    </button>
  );
}

export function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}
