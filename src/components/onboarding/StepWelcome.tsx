"use client";

import { Button } from "@/components/ui/Button";
import { DEMO_PERSONAS } from "@/data/personas";
import { ArrowRight } from "lucide-react";

export function StepWelcome({ onStart, onDemo }: { onStart: () => void; onDemo: (personaId: string) => void }) {
  return (
    <div className="text-center">
      <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-[var(--color-ink)] lg:text-[40px]">
        Build your credit card strategy.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
        Tell us where you are today and where you want to go. We&rsquo;ll build the path — not just a list of cards.
      </p>
      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={onStart} iconRight={<ArrowRight size={17} />}>
          Build My Strategy
        </Button>
      </div>

      <div className="mt-14 border-t border-[var(--color-border)] pt-6">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">
          Or explore instantly with a demo profile
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {DEMO_PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => onDemo(p.id)}
              className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--color-ink-soft)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
