"use client";

import { cn } from "@/lib/utils";

export interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export function RadioCardGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: RadioOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3;
}) {
  const colClass = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-3" }[columns];
  return (
    <div className={cn("grid gap-2.5", colClass)} role="radiogroup">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
              selected
                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)] shadow-[var(--shadow-card)]"
                : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)]"
            )}
          >
            <span className="text-[13.5px] font-medium">{opt.label}</span>
            {opt.description && (
              <span className={cn("text-[12px]", selected ? "text-[var(--color-bg)]/70" : "text-[var(--color-ink-faint)]")}>
                {opt.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
