"use client";

import { useId } from "react";

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
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-[var(--color-ink)]">
          {label}
        </label>
        <span className="figure rounded-[6px] bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[13.5px] font-medium text-[var(--color-ink)]">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, var(--color-mint) ${pct}%, var(--color-bg-sunken) ${pct}%)`,
        }}
      />
      {hint && <span className="text-[12px] text-[var(--color-ink-faint)]">{hint}</span>}
    </div>
  );
}
