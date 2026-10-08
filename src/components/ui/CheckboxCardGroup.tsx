"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export function CheckboxCardGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: CheckboxOption<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  columns?: 1 | 2 | 3;
}) {
  const colClass = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-3" }[columns];

  const toggle = (v: T) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <div className={cn("grid gap-2", colClass)}>
      {options.map((opt) => {
        const selected = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            onClick={() => toggle(opt.value)}
            className={cn(
              "group flex items-start gap-3 rounded-[var(--radius-control)] border px-3.5 py-3 text-left transition-[border-color,background-color,box-shadow] duration-150",
              selected
                ? "border-[var(--color-mint)] bg-[var(--color-accent-soft)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mint)_18%,transparent)]"
                : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]"
            )}
          >
            <span
              className={cn(
                "mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors",
                selected ? "border-[var(--color-mint)] bg-[var(--color-mint)]" : "border-[var(--color-border-strong)] group-hover:border-[var(--color-ink-faint)]"
              )}
            >
              {selected && <Check size={11} className="text-[#03261a]" strokeWidth={3.5} />}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[13.5px] font-medium text-[var(--color-ink)]">{opt.label}</span>
              {opt.description && <span className="text-[12px] text-[var(--color-ink-faint)]">{opt.description}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
