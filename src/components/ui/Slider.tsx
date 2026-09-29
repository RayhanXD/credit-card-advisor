"use client";

import { cn } from "@/lib/utils";

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="text-[13px] font-medium text-[var(--color-ink)]">{label}</label>
        <span className="tabular-nums text-[15px] font-semibold text-[var(--color-ink)]">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("slider-input h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-bg-subtle)]")}
        style={{
          background: `linear-gradient(to right, var(--color-ink) ${pct}%, var(--color-bg-subtle) ${pct}%)`,
        }}
      />
      {hint && <span className="text-[12px] text-[var(--color-ink-faint)]">{hint}</span>}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: var(--color-ink);
          border: 3px solid var(--color-bg-elevated);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: var(--color-ink);
          border: 3px solid var(--color-bg-elevated);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
