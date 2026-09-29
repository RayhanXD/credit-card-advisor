"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CreditHealthMetric } from "@/lib/types";
import { MeterBar, statusToTone } from "@/components/ui/MeterBar";
import { cn } from "@/lib/utils";

export function MetricRow({ metric }: { metric: CreditHealthMetric }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
      <button className="flex w-full items-center justify-between gap-4 text-left" onClick={() => setOpen((v) => !v)}>
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--color-ink)]">{metric.label}</span>
            <span className="text-[13px] tabular-nums text-[var(--color-ink-soft)]">{metric.rawDisplay}</span>
          </div>
          <MeterBar value={metric.valuePercent} tone={statusToTone(metric.status)} />
        </div>
        <ChevronDown size={16} className={cn("mt-1 shrink-0 text-[var(--color-ink-faint)] transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-4 space-y-3 border-t border-[var(--color-border)] pt-4">
          <p className="text-[13px] text-[var(--color-ink-soft)]">{metric.explanation}</p>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">Why it matters</p>
            <p className="mt-1 text-[13px] text-[var(--color-ink-soft)]">{metric.whyItMatters}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">How to improve it</p>
            <p className="mt-1 text-[13px] text-[var(--color-ink-soft)]">{metric.howToImprove}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">Timeframe</p>
            <p className="mt-1 text-[13px] text-[var(--color-ink-soft)]">{metric.timeframe}</p>
          </div>
        </div>
      )}
    </div>
  );
}
