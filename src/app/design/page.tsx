import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { FitBadge } from "@/components/cards/FitBadge";
import { Kicker } from "@/components/ui/Panel";
import { DESIGN_VERSION } from "@/components/design/docs-nav";
import { brandName } from "@/lib/site";

const SWATCHES = ["--color-mint", "--color-teal-vivid", "--color-gold-vivid", "--color-coral-vivid", "--color-indigo-vivid", "--color-ink"];

const SECTIONS = [
  {
    n: "01",
    title: "Tokens",
    href: "/design/foundations",
    body: "Color, type, motion, space, and motifs. One stylesheet, shared by every component.",
    visual: (
      <div className="flex gap-1.5">
        {SWATCHES.map((s) => (
          <span key={s} className="h-9 w-9 rounded-[10px] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-ink)_12%,transparent)]" style={{ background: `var(${s})` }} />
        ))}
      </div>
    ),
  },
  {
    n: "02",
    title: "UI",
    href: "/design/buttons",
    body: "Buttons, cards, forms, feedback, and the score components. Live, and the same code the product ships.",
    visual: (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Build my strategy</Button>
        <FitBadge fitLabel="strong_fit" />
      </div>
    ),
  },
  {
    n: "03",
    title: "Patterns",
    href: "/design/patterns",
    body: "Marketing, auth, onboarding, the app shell, and the strategy screens, built from real engine output.",
    visual: (
      <div className="flex h-12 w-40 gap-1.5 rounded-[9px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-1.5">
        <span className="w-8 rounded-[5px] bg-[var(--color-bg-subtle)]" />
        <span className="flex flex-1 flex-col gap-1">
          <span className="h-2 w-2/3 rounded-[3px] bg-[var(--color-ink)] opacity-80" />
          <span className="h-full rounded-[4px] bg-[var(--color-accent-soft)]" />
        </span>
      </div>
    ),
  },
  {
    n: "04",
    title: "Voice",
    href: "/design/voice",
    body: "Plain, specific, honest about uncertainty. What we say, and the words we never use.",
    visual: <p className="font-display text-[20px] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-ink)]">Positioning, not a promise.</p>,
  },
  {
    n: "05",
    title: "Accessibility",
    href: "/design/accessibility",
    body: "Contrast measured live from the tokens, focus, keyboard, motion, and the gaps still open.",
    visual: (
      <span className="inline-flex items-center rounded-[10px] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)] outline-2 outline-offset-2 outline-[var(--color-mint)]">
        Focus ring
      </span>
    ),
  },
];

export default function DesignHome() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-20 text-center sm:pt-28">
          <div className="animate-rise flex justify-center">
            <LogoMark size={64} />
          </div>
          <div className="animate-rise mt-6 flex justify-center" style={{ animationDelay: "60ms" }}>
            <Kicker>Design library · v{DESIGN_VERSION}</Kicker>
          </div>
          <h1 className="animate-rise mt-4 font-display text-[44px] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--color-ink)] sm:text-[60px]" style={{ animationDelay: "120ms" }}>
            The {brandName}
            <br />
            <span className="text-[var(--color-accent)]">design library.</span>
          </h1>
          <p className="animate-rise mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--color-ink-soft)]" style={{ animationDelay: "180ms" }}>
            Every token, component, and pattern that makes {brandName} feel like {brandName}. Every specimen is the real component, so what you see here is what ships.
          </p>
          <div className="animate-rise mt-9 flex justify-center" style={{ animationDelay: "240ms" }}>
            <Link
              href="/design/foundations"
              className="group inline-flex items-center gap-4 rounded-[18px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] py-2.5 pl-3 pr-2.5 shadow-[var(--shadow-card-hover)] transition-transform hover:-translate-y-0.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--color-bg-subtle)] text-[var(--color-ink)]">
                <BookOpen size={18} />
              </span>
              <span className="text-left">
                <span className="block text-[14.5px] font-semibold text-[var(--color-ink)]">Walk the library</span>
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">tokens · ui · patterns · voice</span>
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--color-primary)] text-[var(--color-primary-ink)] transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={17} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.n}
              href={s.href}
              className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-card)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex min-h-[64px] items-center">{s.visual}</div>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="figure text-[12px] text-[var(--color-ink-faint)]">{s.n}</span>
                <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{s.title}</h2>
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{s.body}</p>
              <span className="mt-4 flex items-center gap-1 text-[12.5px] font-semibold text-[var(--color-accent)]">
                Open <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
