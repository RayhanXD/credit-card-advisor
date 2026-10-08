import type { TimelineEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const MARKER_COLORS = [
  "var(--color-mint)",
  "var(--color-teal-vivid)",
  "var(--color-indigo-vivid)",
  "var(--color-gold-vivid)",
  "var(--color-coral-vivid)",
  "var(--color-ink)",
];

function offsetLabel(m: number) {
  return m === 0 ? "Today" : `+${m} mo`;
}

// The N-month strategy as a horizontal rail on wide screens (a calendar you
// read left to right) and a vertical list on narrow ones.
export function MilestoneRail({ entries, limit }: { entries: TimelineEntry[]; limit?: number }) {
  const items = limit ? entries.slice(0, limit) : entries;
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)] sm:p-6">
      {/* Wide: horizontal rail */}
      <ol className="relative hidden gap-4 lg:grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        <span className="absolute left-0 right-0 top-[7px] h-[2px] bg-[linear-gradient(90deg,var(--color-mint),var(--color-teal-vivid)_30%,var(--color-border-strong)_60%)]" />
        {items.map((e, i) => (
          <li key={e.label} className="relative space-y-3 pr-2">
            <span
              className={cn("relative block h-4 w-4 rounded-full border-[3px] border-[var(--color-bg-elevated)]", i === 0 && "shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mint)_30%,transparent)]")}
              style={{ background: MARKER_COLORS[i % MARKER_COLORS.length] }}
            />
            <div className="space-y-1">
              <p className="figure text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-ink-faint)]">{offsetLabel(e.monthOffset)}</p>
              <p className="text-[13.5px] font-semibold leading-snug text-[var(--color-ink)]">{e.label}</p>
              <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">{e.description}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Narrow: vertical */}
      <ol className="space-y-0 lg:hidden">
        {items.map((e, i) => (
          <li key={e.label} className="grid grid-cols-[16px_1fr] gap-4">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: MARKER_COLORS[i % MARKER_COLORS.length] }} />
              {i < items.length - 1 && <span className="my-1 w-[2px] flex-1 bg-[var(--color-border)]" />}
            </div>
            <div className="pb-5">
              <p className="figure text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-ink-faint)]">{offsetLabel(e.monthOffset)}</p>
              <p className="mt-0.5 text-[13.5px] font-semibold text-[var(--color-ink)]">{e.label}</p>
              <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">{e.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
