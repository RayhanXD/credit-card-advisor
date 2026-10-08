"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Logo } from "@/components/brand/Logo";

export function OnboardingShell({
  stepIndex,
  totalSteps,
  stepLabels,
  onBack,
  showBack,
  children,
  wide,
}: {
  stepIndex: number;
  totalSteps: number;
  stepLabels?: string[];
  onBack: () => void;
  showBack: boolean;
  children: ReactNode;
  wide?: boolean;
}) {
  const progress = ((stepIndex + 1) / totalSteps) * 100;
  const showRail = stepLabels && stepIndex > 0;

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-canvas)]">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-canvas)_85%,transparent)] backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 py-3.5 lg:px-10">
          <Logo size={28} />
          <div className="flex items-center gap-1">
            {showBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
              >
                <ArrowLeft size={15} />
                Back
              </button>
            )}
            <SignOutButton />
          </div>
        </div>
        <div className="h-[3px] w-full bg-[var(--color-bg-subtle)] lg:hidden">
          <motion.div
            className="h-full bg-[linear-gradient(90deg,var(--color-mint),var(--color-teal-vivid))]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-12 px-5 lg:px-10">
        {showRail && (
          <aside className="sticky top-[72px] hidden h-fit w-56 shrink-0 py-14 lg:block" aria-label="Onboarding progress">
            <p className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
              Step {stepIndex + 1} of {totalSteps}
            </p>
            <ol>
              {stepLabels.map((label, i) => {
                const done = i < stepIndex;
                const current = i === stepIndex;
                const last = i === stepLabels.length - 1;
                return (
                  <li key={label} className="grid grid-cols-[20px_1fr] gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition-colors",
                          done && "bg-[var(--color-mint)] text-[#03261a]",
                          current && "bg-[var(--color-ink)] text-[var(--color-bg-elevated)] ring-4 ring-[color-mix(in_srgb,var(--color-mint)_25%,transparent)]",
                          !done && !current && "border-[1.5px] border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-ink-faint)]"
                        )}
                      >
                        {done ? <Check size={11} strokeWidth={3} /> : i + 1}
                      </span>
                      {!last && <span className={cn("my-1 h-5 w-[2px] rounded-full", done ? "bg-[var(--color-mint)]" : "bg-[var(--color-border)]")} />}
                    </div>
                    <span
                      className={cn(
                        "pt-px text-[13px]",
                        current ? "font-semibold text-[var(--color-ink)]" : done ? "text-[var(--color-ink-soft)]" : "text-[var(--color-ink-faint)]"
                      )}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-8 flex items-start gap-2 rounded-[12px] border border-dashed border-[var(--color-border-strong)] p-3 text-[11.5px] leading-relaxed text-[var(--color-ink-faint)]">
              <Lock size={13} className="mt-0.5 shrink-0" />
              We never ask for your SSN, account numbers, or card numbers.
            </div>
          </aside>
        )}

        <main id="main-content" className={cn("flex flex-1 justify-center py-10 lg:py-14", showRail && "lg:justify-start")}>
          <div className={cn("w-full", wide ? "max-w-2xl" : "max-w-xl")}>
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export function StepHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8 space-y-3">
      {eyebrow && (
        <p className="inline-flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
          <span className="h-1.5 w-1.5 rounded-[2px] bg-[var(--color-mint)]" />
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)] lg:text-[34px]">{title}</h1>
      {subtitle && <p className="max-w-lg text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{subtitle}</p>}
    </div>
  );
}

// Groups related fields inside a step so long forms read in chunks.
export function FieldGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="space-y-5 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)] sm:p-6">
      {title && <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{title}</p>}
      {children}
    </div>
  );
}
