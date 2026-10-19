"use client";

import { useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { CircularScore } from "@/components/ui/CircularScore";
import { MeterBar } from "@/components/ui/MeterBar";
import { FactorStrip } from "@/components/cards/ScoreBreakdownPanel";
import { CardFace } from "@/components/cards/CreditCardTile";
import { getCard } from "@/data/cards";

function Replayable({ title, spec, children }: { title: string; spec: string; children: (key: number) => ReactNode }) {
  const [key, setKey] = useState(0);
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <div>
          <p className="text-[13px] font-semibold text-[var(--color-ink)]">{title}</p>
          <p className="font-mono text-[10.5px] text-[var(--color-ink-faint)]">{spec}</p>
        </div>
        <button
          onClick={() => setKey((k) => k + 1)}
          aria-label={`Replay ${title}`}
          className="flex items-center gap-1.5 rounded-[8px] border border-[var(--color-border)] px-2.5 py-1 text-[12px] font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
        >
          <RotateCcw size={12} /> Replay
        </button>
      </div>
      <div className="bg-grid flex min-h-[150px] flex-1 items-center justify-center p-6">{children(key)}</div>
    </div>
  );
}

const SAMPLE = {
  goalAlignment: 23,
  creditProfileFit: 14,
  spendingMatch: 15,
  issuerRelationship: 5,
  portfolioCompatibility: 10,
  timing: 6,
  annualFeeFit: 5,
  total: 78,
};

export function MotionDemos() {
  const card = getCard("capital_one_venture_x");
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Replayable title="Rise" spec="520ms · cubic-bezier(0.22, 1, 0.36, 1) · 8px">
        {(k) => (
          <div key={k} className="animate-rise rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4 text-[13.5px] font-medium text-[var(--color-ink)] shadow-[var(--shadow-card)]">
            Page headers and hero blocks
          </div>
        )}
      </Replayable>

      <Replayable title="Dial" spec="1000ms · stroke-dasharray · same ease">
        {(k) => <CircularScore key={k} value={72} size={120} sublabel="Readiness" threshold={72} />}
      </Replayable>

      <Replayable title="Segmented meter" spec="300ms per segment · 18ms stagger">
        {(k) => (
          <div className="w-full max-w-xs">
            <MeterBar key={k} value={78} tone="teal" ariaLabel="Utilization example" />
          </div>
        )}
      </Replayable>

      <Replayable title="Factor strip" spec="700ms · 50ms stagger per factor">
        {(k) => (
          <div className="w-full max-w-sm">
            <FactorStrip key={k} score={SAMPLE} height={14} />
          </div>
        )}
      </Replayable>

      <Replayable title="Pulse ring" spec="2200ms · infinite · marks the current step">
        {() => (
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-mint)] text-[12px] font-semibold text-[#03261a]">
            <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[var(--color-mint)]" />
            <span className="relative">1</span>
          </span>
        )}
      </Replayable>

      <Replayable title="Hover lift" spec="300ms · translate −4px · rotate −0.6°">
        {() => (
          <div className="group w-44 rounded-[18px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:rotate-[-0.6deg]">
            {card && <CardFace card={card} />}
          </div>
        )}
      </Replayable>
    </div>
  );
}
