import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="bg-grid relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-bg-elevated)_35%,transparent_80%)]" />
      {icon && (
        <div className="relative flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-mint)_30%,transparent)]">
          {icon}
        </div>
      )}
      <div className="relative space-y-1.5">
        <p className="font-display text-[18px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{title}</p>
        {description && <p className="mx-auto max-w-sm text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{description}</p>}
      </div>
      {action && <div className="relative">{action}</div>}
    </div>
  );
}
