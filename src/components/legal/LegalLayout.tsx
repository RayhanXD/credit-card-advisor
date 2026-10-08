import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Logo } from "@/components/brand/Logo";
import { Kicker } from "@/components/ui/Panel";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
];

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--color-canvas)]">
      <header className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]">
            <ArrowLeft size={14} /> Home
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 pt-12 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Legal" className="hidden lg:block">
          <ul className="sticky top-8 space-y-1 border-l border-[var(--color-border)]">
            {LEGAL_LINKS.map((l) => {
              const active = l.label === title;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "-ml-px block border-l-2 border-[var(--color-mint)] py-1 pl-4 text-[13px] font-semibold text-[var(--color-ink)]"
                        : "block py-1 pl-4 text-[13px] text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                    }
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main id="main-content" className="min-w-0 max-w-[68ch]">
          <Kicker>Legal · Updated {updated}</Kicker>
          <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)]">{title}</h1>
          <div className="mt-10 space-y-8 text-[14.5px] leading-[1.7] text-[var(--color-ink-soft)] [&_a]:font-medium [&_a]:text-[var(--color-accent)] [&_strong]:font-semibold [&_strong]:text-[var(--color-ink)]">
            {children}
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-8">
      <h2 className="mb-3 font-display text-[19px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="rounded-[5px] bg-[var(--color-warning-soft)] px-1.5 py-0.5 font-mono text-[12.5px] text-[var(--color-warning)]">{children}</span>;
}
