import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prefixLabel?: ReactNode;
}

export function TextField({ label, hint, prefixLabel, className, id, ...props }: TextFieldProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-[var(--color-ink)]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefixLabel && <span className="absolute left-3 text-[13px] text-[var(--color-ink-faint)]">{prefixLabel}</span>}
        <input
          id={inputId}
          className={cn(
            "h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[14px] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20",
            prefixLabel ? "pl-7 pr-3" : "px-3",
            className
          )}
          {...props}
        />
      </div>
      {hint && <span className="text-[12px] text-[var(--color-ink-faint)]">{hint}</span>}
    </div>
  );
}
