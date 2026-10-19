import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Check, X, Info } from "lucide-react";
import { Kicker } from "@/components/ui/Panel";
import { CodeBlock } from "@/components/design/CodeBlock";
import { cn } from "@/lib/utils";

export function DocPage({
  title,
  lead,
  source,
  children,
}: {
  title: string;
  lead: ReactNode;
  source?: string;
  children: ReactNode;
}) {
  return (
    <article className="space-y-12">
      <header className="animate-rise space-y-4 border-b border-[var(--color-border)] pb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-[var(--color-ink-faint)]">
          <Link href="/design" className="transition-colors hover:text-[var(--color-ink)]">
            Documentation
          </Link>
          <ChevronRight size={12} />
          <span className="font-medium text-[var(--color-ink)]">{title}</span>
        </nav>
        <h1 className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)] lg:text-[42px]">{title}</h1>
        <p className="max-w-2xl text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">{lead}</p>
        {source && (
          <p className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--color-ink-faint)]">
            <span className="font-mono uppercase tracking-[0.1em]">Source</span>
            <code className="rounded-[6px] bg-[var(--color-bg-subtle)] px-2 py-0.5 font-code text-[11.5px] text-[var(--color-ink-soft)]">{source}</code>
          </p>
        )}
      </header>
      {children}
    </article>
  );
}

export function DocSection({
  id,
  title,
  kicker,
  description,
  children,
}: {
  id?: string;
  title: string;
  kicker?: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-5">
      <div className="space-y-2">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2 className="font-display text-[24px] font-semibold tracking-[-0.025em] text-[var(--color-ink)]">{title}</h2>
        {description && <p className="max-w-2xl text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{description}</p>}
      </div>
      {children}
    </section>
  );
}

// A live preview on a ledger-grid canvas, with optional copyable code below.
export function Specimen({
  children,
  code,
  title,
  className,
  codeLabel,
}: {
  children: ReactNode;
  code?: string;
  title?: string;
  className?: string;
  codeLabel?: string;
}) {
  return (
    <figure className="space-y-2.5">
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
        {title && (
          <figcaption className="border-b border-[var(--color-border)] px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
            {title}
          </figcaption>
        )}
        <div className={cn("bg-grid relative p-6 sm:p-8", className)}>{children}</div>
      </div>
      {code && <CodeBlock code={code} label={codeLabel} />}
    </figure>
  );
}

export function DoDont({ doTitle = "Do", dontTitle = "Avoid", doItems, dontItems }: { doTitle?: string; dontTitle?: string; doItems: ReactNode[]; dontItems: ReactNode[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[var(--radius-card)] border border-[color-mix(in_srgb,var(--color-mint)_40%,var(--color-border))] bg-[var(--color-bg-elevated)] p-5">
        <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[var(--color-accent)]">
          <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[var(--color-accent-soft)]">
            <Check size={12} strokeWidth={3} />
          </span>
          {doTitle}
        </p>
        <ul className="space-y-2.5 text-[13.5px] leading-snug text-[var(--color-ink-soft)]">
          {doItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-[var(--radius-card)] border border-[color-mix(in_srgb,var(--color-coral-vivid)_35%,var(--color-border))] bg-[var(--color-bg-elevated)] p-5">
        <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[var(--color-coral)]">
          <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[var(--color-coral-soft)]">
            <X size={12} strokeWidth={3} />
          </span>
          {dontTitle}
        </p>
        <ul className="space-y-2.5 text-[13.5px] leading-snug text-[var(--color-ink-soft)]">
          {dontItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Callout({ title, children, tone = "info" }: { title: string; children: ReactNode; tone?: "info" | "gap" }) {
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-[14px] border px-4 py-3.5 text-[13.5px] leading-relaxed",
        tone === "gap"
          ? "border-[color-mix(in_srgb,var(--color-gold-vivid)_45%,var(--color-border))] bg-[var(--color-warning-soft)] text-[var(--color-ink-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-ink-soft)]"
      )}
    >
      <Info size={16} className={cn("mt-0.5 shrink-0", tone === "gap" ? "text-[var(--color-gold)]" : "text-[var(--color-ink-faint)]")} />
      <div>
        <p className="font-semibold text-[var(--color-ink)]">{title}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </aside>
  );
}

export function DataTable({ head, rows, className }: { head: string[]; rows: ReactNode[][]; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]", className)}>
      <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {rows.map((row, i) => (
            <tr key={i} className="align-top">
              {row.map((cell, j) => (
                <td key={j} className={cn("px-4 py-3 text-[var(--color-ink-soft)]", j === 0 && "font-medium text-[var(--color-ink)]")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-[5px] bg-[var(--color-bg-subtle)] px-1.5 py-0.5 font-code text-[12px] text-[var(--color-ink)]">{children}</code>;
}
