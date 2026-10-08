import type { ReactNode } from "react";
import Link from "next/link";
import { Eye, Route, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const POINTS = [
  { icon: Route, text: "A step-by-step path to the card you want" },
  { icon: Eye, text: "Every recommendation explained, factor by factor" },
  { icon: ShieldCheck, text: "No SSN, account numbers, or hard pulls" },
];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh bg-[var(--color-canvas)] lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
          <Link href="/" className="text-[13px] font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]">
            Home
          </Link>
        </header>

        <main id="main-content" className="flex flex-1 items-center justify-center py-12">
          <div className="animate-rise w-full max-w-[400px]">
            <h1 className="font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--color-ink)]">{title}</h1>
            {subtitle && <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </main>

        <footer className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-[var(--color-ink-faint)]">
          <Link href="/privacy" className="hover:text-[var(--color-ink)]">Privacy</Link>
          <Link href="/terms" className="hover:text-[var(--color-ink)]">Terms</Link>
          <Link href="/cookies" className="hover:text-[var(--color-ink)]">Cookies</Link>
        </footer>
      </div>

      <aside className="relative m-3 hidden overflow-hidden rounded-[28px] bg-[#0b1a14] p-12 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(43,224,154,0.35),transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(45,212,224,0.18),transparent_65%)]" />

        {/* Ascending route motif */}
        <svg className="pointer-events-none absolute right-12 top-16 h-56 w-72 opacity-90" viewBox="0 0 280 220" fill="none" aria-hidden="true">
          <path d="M10 200 C 80 190, 90 130, 140 120 S 220 60, 266 22" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="5 7" />
          <circle cx="10" cy="200" r="6" fill="#2be09a" />
          <circle cx="140" cy="120" r="5" fill="#2dd4e0" />
          <circle cx="266" cy="22" r="7" fill="#f7c45f" />
        </svg>

        <div className="relative max-w-md">
          <p className="font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.03em]">
            Where you are. Where you&rsquo;re going. <span className="text-[#2be09a]">The path between.</span>
          </p>
          <ul className="mt-8 space-y-3.5">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[14px] text-white/75">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/10 text-[#2be09a]">
                  <Icon size={15} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
