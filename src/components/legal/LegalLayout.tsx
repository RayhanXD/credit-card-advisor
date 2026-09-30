import Link from "next/link";
import type { ReactNode } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)]">
            <Sparkles size={16} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Strata</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
          <ArrowLeft size={14} /> Home
        </Link>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-5 pb-24">
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-ink)]">{title}</h1>
        <p className="mt-1 text-[12.5px] text-[var(--color-ink-faint)]">Last updated: {updated}</p>
        <div className="prose-legal mt-8 space-y-6 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-[16px] font-semibold text-[var(--color-ink)]">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="rounded bg-[var(--color-warning-soft)] px-1.5 py-0.5 font-mono text-[12.5px] text-[var(--color-warning)]">{children}</span>;
}
