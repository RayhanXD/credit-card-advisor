import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  sub,
  icon,
  children,
  className,
  accent,
}: {
  label: string;
  value?: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)]",
        className
      )}
    >
      {accent && <span className="absolute inset-x-5 top-0 h-[3px] rounded-b-full" style={{ background: accent }} />}
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{label}</span>
        {icon}
      </div>
      {children ?? (
        <>
          <p className="font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-ink)]">{value}</p>
          {sub && <div className="mt-auto pt-2 text-[12.5px] text-[var(--color-ink-soft)]">{sub}</div>}
        </>
      )}
    </div>
  );
}
