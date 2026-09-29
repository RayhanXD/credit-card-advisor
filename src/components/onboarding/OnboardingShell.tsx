"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardingShell({
  stepIndex,
  totalSteps,
  onBack,
  showBack,
  children,
  wide,
}: {
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  showBack: boolean;
  children: ReactNode;
  wide?: boolean;
}) {
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <div className="flex items-center justify-between px-6 py-5 lg:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)]">
            <Sparkles size={14} />
          </div>
          <span className="text-[14px] font-semibold">Strata</span>
        </div>
        {showBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        ) : (
          <span />
        )}
      </div>

      <div className="h-1 w-full bg-[var(--color-bg-subtle)]">
        <motion.div
          className="h-full bg-[var(--color-ink)]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="flex flex-1 items-start justify-center px-5 py-10 lg:py-16">
        <div className={cn("w-full", wide ? "max-w-2xl" : "max-w-lg")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function StepHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8 space-y-2">
      {eyebrow && <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-accent)]">{eyebrow}</p>}
      <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-[var(--color-ink)] lg:text-[30px]">{title}</h1>
      {subtitle && <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{subtitle}</p>}
    </div>
  );
}
