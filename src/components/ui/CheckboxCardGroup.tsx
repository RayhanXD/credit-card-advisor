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
    <div className={cn("grid gap-2.5", colClass)}>
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
              "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
              selected
                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]"
                : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)]"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                selected ? "border-[var(--color-bg)] bg-[var(--color-bg)]" : "border-[var(--color-border-strong)]"
              )}
            >
              {selected && <Check size={11} className="text-[var(--color-ink)]" strokeWidth={3} />}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[13.5px] font-medium">{opt.label}</span>
              {opt.description && (
                <span className={cn("text-[12px]", selected ? "text-[var(--color-bg)]/70" : "text-[var(--color-ink-faint)]")}>
                  {opt.description}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
