import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]",
        className
      )}
      {...props}
    />
  );
}

export function PanelHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6", className)} {...props} />;
}

export function PanelBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}

type KickerTone = "mint" | "gold" | "teal" | "coral" | "indigo" | "ink";

const KICKER_DOT: Record<KickerTone, string> = {
  mint: "bg-[var(--color-mint)]",
  gold: "bg-[var(--color-gold-vivid)]",
  teal: "bg-[var(--color-teal-vivid)]",
  coral: "bg-[var(--color-coral-vivid)]",
  indigo: "bg-[var(--color-indigo-vivid)]",
  ink: "bg-[var(--color-ink)]",
};

// Small mono label with a colored square: the system's section marker.
export function Kicker({ children, tone = "mint", className }: { children: ReactNode; tone?: KickerTone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-[2px]", KICKER_DOT[tone])} />
      {children}
    </span>
  );
}

export function PageHeader({
  kicker,
  kickerTone,
  title,
  description,
  actions,
  back,
}: {
  kicker?: string;
  kickerTone?: KickerTone;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: ReactNode;
}) {
  return (
    <header className="animate-rise space-y-3">
      {back}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 space-y-2">
          {kicker && <Kicker tone={kickerTone}>{kicker}</Kicker>}
          <h1 className="font-display text-[28px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--color-ink)] lg:text-[34px]">
            {title}
          </h1>
          {description && <div className="max-w-2xl text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{description}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function SectionHeading({ title, kicker, action, className }: { title: ReactNode; kicker?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <div className="space-y-1.5">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2 className="font-display text-[19px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
