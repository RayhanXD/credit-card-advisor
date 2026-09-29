import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  sub,
  icon,
  children,
  className,
}: {
  label: string;
  value?: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5", className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">{label}</span>
        {icon}
      </div>
      {children ?? (
        <>
          <p className="text-[26px] font-semibold tabular-nums leading-none text-[var(--color-ink)]">{value}</p>
          {sub && <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-soft)]">{sub}</p>}
        </>
      )}
    </div>
  );
}
