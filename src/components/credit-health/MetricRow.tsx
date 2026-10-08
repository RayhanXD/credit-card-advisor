"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { CreditHealthMetric } from "@/lib/types";
import { MeterBar, statusToTone } from "@/components/ui/MeterBar";
import { cn } from "@/lib/utils";

const STATUS_TEXT: Record<CreditHealthMetric["status"], { label: string; cls: string }> = {
  excellent: { label: "Excellent", cls: "text-[var(--color-accent)]" },
  good: { label: "Good", cls: "text-[var(--color-teal)]" },
  fair: { label: "Fair", cls: "text-[var(--color-gold)]" },
  poor: { label: "Needs work", cls: "text-[var(--color-coral)]" },
};

export function MetricRow({ metric }: { metric: CreditHealthMetric }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_TEXT[metric.status];
  return (
    <div className="transition-colors">
      <button
        className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2.5 px-5 py-4 text-left transition-colors hover:bg-[var(--color-bg-subtle)] sm:grid-cols-[180px_1fr_auto_auto] sm:px-6"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-[14px] font-semibold text-[var(--color-ink)]">{metric.label}</span>
        <span className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
          <MeterBar value={metric.valuePercent} tone={statusToTone(metric.status)} ariaLabel={metric.label} />
        </span>
        <span className="flex items-center gap-3 justify-self-end sm:justify-self-auto">
          <span className="figure text-[13px] text-[var(--color-ink)]">{metric.rawDisplay}</span>
          <span className={cn("hidden w-20 text-[12px] font-semibold sm:block", status.cls)}>{status.label}</span>
        </span>
        <ChevronDown
          size={16}
          className={cn("hidden shrink-0 text-[var(--color-ink-faint)] transition-transform duration-200 sm:block", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-5 bg-[var(--color-bg-subtle)] px-5 py-5 sm:grid-cols-3 sm:px-6">
              <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)] sm:col-span-3">{metric.explanation}</p>
              <Detail title="Why it matters" body={metric.whyItMatters} />
              <Detail title="How to improve" body={metric.howToImprove} />
              <Detail title="Timeframe" body={metric.timeframe} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Detail({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{title}</p>
      <p className="text-[13px] leading-relaxed text-[var(--color-ink)]">{body}</p>
    </div>
  );
}
