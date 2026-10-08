"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DEMO_PERSONAS } from "@/data/personas";
import { demoProfilesEnabled } from "@/lib/flags";
import { brandName } from "@/lib/site";
import { ArrowRight, Clock, Eye, ShieldCheck } from "lucide-react";

const PROMISES = [
  { icon: Clock, label: "About 4 minutes" },
  { icon: ShieldCheck, label: "No SSN or account numbers" },
  { icon: Eye, label: "Every score explained" },
];

export function StepWelcome({ onStart, onDemo }: { onStart: () => void; onDemo: (personaId: string) => void | Promise<void> }) {
  return (
    <div className="py-4 text-center">
      <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-mint)]" />
        Let&rsquo;s build your path
      </p>
      <h1 className="mt-5 font-display text-[36px] font-semibold leading-[1.04] tracking-[-0.03em] text-[var(--color-ink)] lg:text-[48px]">
        Where you are.
        <br />
        <span className="bg-[linear-gradient(90deg,var(--color-accent),var(--color-teal))] bg-clip-text text-transparent">Where you&rsquo;re going.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
        Tell us about your finances, your cards, and your goals. We&rsquo;ll build the path — not just a list of cards.
      </p>
      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={onStart} iconRight={<ArrowRight size={17} />}>
          Build My Strategy
        </Button>
      </div>
      <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {PROMISES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-1.5 text-[12.5px] text-[var(--color-ink-soft)]">
            <Icon size={13} className="text-[var(--color-teal-vivid)]" />
            {label}
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-6 max-w-sm text-[11.5px] text-[var(--color-ink-faint)]">
        By continuing, you agree to {brandName}&rsquo;s{" "}
        <Link href="/terms" target="_blank" className="underline underline-offset-2 hover:text-[var(--color-ink-soft)]">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-[var(--color-ink-soft)]">
          Privacy Policy
        </Link>
        .
      </p>

      {demoProfilesEnabled() && (
        <div className="mt-14 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border-strong)] p-5">
          <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Or explore with a demo profile</p>
          <div className="flex flex-wrap justify-center gap-2">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => onDemo(p.id)}
                className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-mint)] hover:text-[var(--color-ink)]"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
