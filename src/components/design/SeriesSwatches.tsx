"use client";

import { SCORE_FACTORS } from "@/components/cards/ScoreBreakdownPanel";
import { TokenSwatch } from "@/components/design/TokenSwatch";

// Reads the factor list from the real component, so the swatches can never
// disagree with the product about which color belongs to which factor.
export function SeriesSwatches() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {SCORE_FACTORS.map((f) => (
        <TokenSwatch key={f.key} token={f.color.replace("var(", "").replace(")", "")} role={`${f.label} · max ${f.max} pts`} />
      ))}
    </div>
  );
}
