import Link from "next/link";
import { ArrowRight, Check, X, MessagesSquare, Eye, Route, ShieldCheck } from "lucide-react";
import { PrimaryCTA, ExploreCardsCTA } from "@/components/landing/LandingCTAs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Logo } from "@/components/brand/Logo";
import { Kicker } from "@/components/ui/Panel";
import { CardFace } from "@/components/cards/CreditCardTile";
import { FitBadge } from "@/components/cards/FitBadge";
import { FactorStrip, ScoreBreakdownPanel } from "@/components/cards/ScoreBreakdownPanel";
import { JourneyTimeline } from "@/components/strategy/JourneyTimeline";
import { ReadinessBreakdown } from "@/components/strategy/ReadinessBreakdown";
import { CircularScore } from "@/components/ui/CircularScore";
import { getCard } from "@/data/cards";
import { ISSUERS } from "@/data/issuers";
import type { CardJourney, ReadinessAssessment, ScoreBreakdown } from "@/lib/types";

// Illustrative sample data so the page shows the real product components.
const SAMPLE_SCORE: ScoreBreakdown = {
  goalAlignment: 22,
  creditProfileFit: 16,
  spendingMatch: 17,
  issuerRelationship: 9,
  portfolioCompatibility: 8,
  timing: 6,
  annualFeeFit: 4,
  total: 82,
};

const SAMPLE_JOURNEY: CardJourney = {
  goalCardId: "capital_one_venture_x",
  estimatedTimelineMonths: 14,
  steps: [
    {
      order: 1,
      timing: "now",
      title: "Establish the relationship",
      cardId: "capital_one_savorone",
      description: "A no-fee card from the same issuer, so you build history where it counts.",
      reasons: ["Same issuer as your goal card", "Earns on the dining and groceries you already buy"],
    },
    {
      order: 2,
      timing: "next",
      title: "Build your profile",
      description: "Low utilization, on-time payments, and time for your accounts to mature.",
      reasons: [],
    },
    { order: 3, timing: "next", title: "Reassess", description: "Profile, account age, inquiries, income, and portfolio — checked again.", reasons: [] },
    {
      order: 4,
      timing: "later",
      title: "Potential next move: Venture X",
      cardId: "capital_one_venture_x",
      description: "A readiness assessment, never a guarantee.",
      reasons: [],
    },
  ],
};

const SAMPLE_READINESS: ReadinessAssessment = {
  cardId: "capital_one_venture_x",
  overallPercent: 64,
  summary: "Account age is your weakest area right now. Most other factors are moderate or strong.",
  components: [
    { label: "Credit profile", status: "strong", explanation: "Your credit standing meets what this card typically expects." },
    { label: "Account age", status: "developing", explanation: "Your history is still maturing relative to typical applicants." },
    { label: "Recent inquiries", status: "strong", explanation: "Few recent hard inquiries." },
    { label: "Issuer relationship", status: "moderate", explanation: "You hold one card with this issuer." },
  ],
};

const PILLARS = [
  { icon: Route, title: "A path, not a list", body: "Multi-step journeys toward the card you actually want, with checkpoints along the way.", tone: "var(--color-mint)" },
  { icon: Eye, title: "Every score explained", body: "Seven weighted factors behind every recommendation. Nothing hidden, nothing paid to rank higher.", tone: "var(--color-teal-vivid)" },
  { icon: ShieldCheck, title: "Positioning, not promises", body: "We tell you how well-positioned you are. We never claim to predict approval.", tone: "var(--color-gold-vivid)" },
];

export default function LandingPage() {
  const heroCards = ["chase_sapphire_preferred", "amex_gold", "capital_one_venture_x"].map((id) => getCard(id)).filter((c) => c !== undefined);
  const featured = getCard("chase_sapphire_preferred");

  return (
    <div className="min-h-dvh bg-[var(--color-canvas)]">
      <header className="sticky top-0 z-30 border-b border-transparent bg-[color-mix(in_srgb,var(--color-canvas)_80%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-[var(--color-ink-soft)] md:flex">
            <Link href="#how" className="transition-colors hover:text-[var(--color-ink)]">How it works</Link>
            <Link href="#explain" className="transition-colors hover:text-[var(--color-ink)]">Transparency</Link>
            <Link href="#advisor" className="transition-colors hover:text-[var(--color-ink)]">Card Advisor</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-[10px] px-3 py-1.5 text-[13.5px] font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]">
              Sign in
            </Link>
            <PrimaryCTA label="Get started" size="sm" />
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute right-[-10%] top-[-20%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-mint)_20%,transparent),transparent_65%)]" />
          <div className="pointer-events-none absolute bottom-[-30%] left-[30%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-teal-vivid)_14%,transparent),transparent_65%)]" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-28 lg:pt-20">
            <div className="animate-rise">
              <Kicker>A credit-card strategist, not a comparison site</Kicker>
              <h1 className="mt-5 font-display text-[44px] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--color-ink)] sm:text-[56px] lg:text-[68px]">
                Your cards should work <span className="relative whitespace-nowrap text-[var(--color-accent)]">together<svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7 C 50 2, 120 2, 198 6" stroke="var(--color-gold-vivid)" strokeWidth="3" fill="none" strokeLinecap="round" /></svg></span>.
              </h1>
              <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-[var(--color-ink-soft)]">
                A personalized strategy for the cards you have, the card to get next, and the path to the one you really want — with
                every recommendation explained.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <PrimaryCTA />
                <ExploreCardsCTA />
              </div>
              <p className="mt-5 text-[12.5px] text-[var(--color-ink-faint)]">No credit check. No account numbers. About 4 minutes.</p>
            </div>

            {/* Composed product visual */}
            <div className="relative mx-auto h-[420px] w-full max-w-[460px] sm:h-[460px]" aria-hidden="true">
              {heroCards.map((card, i) => (
                <div
                  key={card.id}
                  className="absolute left-1/2 top-6 w-[72%]"
                  style={{ transform: `translateX(-50%) translate(${(i - 1) * 34}px, ${i * 26}px) rotate(${(i - 1) * 7}deg)`, zIndex: i }}
                >
                  <CardFace card={card} />
                </div>
              ))}

              {featured && (
                <div className="absolute bottom-0 left-0 z-10 w-[78%] rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-popover)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-[var(--color-ink-faint)]">Next move</p>
                      <p className="text-[14px] font-semibold text-[var(--color-ink)]">{featured.name}</p>
                    </div>
                    <FitBadge fitLabel="strong_fit" />
                  </div>
                  <FactorStrip score={SAMPLE_SCORE} className="mt-3" height={7} />
                  <div className="mt-2 flex justify-between text-[11px] text-[var(--color-ink-faint)]">
                    <span>7 factors</span>
                    <span className="figure font-semibold text-[var(--color-ink)]">82/100 fit</span>
                  </div>
                </div>
              )}

              <div className="absolute right-0 top-[52%] z-10 flex items-center gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 pr-4 shadow-[var(--shadow-popover)]">
                <CircularScore value={64} size={64} tone="warning" threshold={72} label="64%" />
                <div>
                  <p className="text-[11px] text-[var(--color-ink-faint)]">Venture X readiness</p>
                  <p className="text-[13px] font-semibold text-[var(--color-ink)]">Not yet — here&rsquo;s why</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="mx-auto grid max-w-6xl divide-y divide-[var(--color-border)] px-5 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
            {PILLARS.map(({ icon: Icon, title, body, tone }) => (
              <div key={title} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ background: `color-mix(in srgb, ${tone} 16%, transparent)`, color: tone }}>
                  <Icon size={17} />
                </span>
                <p className="mt-4 font-display text-[18px] font-semibold tracking-[-0.02em]">{title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 lg:px-8 lg:py-28">
          <div className="max-w-xl">
            <Kicker tone="coral">The problem</Kicker>
            <h2 className="mt-4 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] lg:text-[44px]">Stop guessing which card to get next.</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-7">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Generic comparison sites</p>
              <ol className="mt-5 space-y-2 opacity-60">
                {["Best travel card", "Best cash back card", "Best premium card"].map((t, i) => (
                  <li key={t} className="flex items-center gap-3 rounded-[12px] bg-[var(--color-bg-elevated)] px-3 py-2.5 text-[13px] text-[var(--color-ink-soft)]">
                    <span className="figure text-[var(--color-ink-faint)]">#{i + 1}</span> {t}
                  </li>
                ))}
              </ol>
              <ul className="mt-6 space-y-2.5 text-[14px] text-[var(--color-ink-soft)]">
                {["Same list for every visitor", "No sense of what you already own", "No path toward the card you want"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <X size={16} className="mt-0.5 shrink-0 text-[var(--color-coral)]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_srgb,var(--color-mint)_50%,var(--color-border))] bg-[var(--color-bg-elevated)] p-7 shadow-[var(--shadow-card-hover)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-mint),var(--color-teal-vivid),var(--color-gold-vivid))]" />
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-accent)]">Your personalized strategy</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["Built from you", "Your credit profile, cards, spending, and goals."],
                  ["Aware of your wallet", "Accounts for issuer relationships and overlap."],
                  ["Shows the path", "Step-by-step, not just the destination."],
                  ["Explains why", "A factor-by-factor breakdown, every time."],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>
                      <span className="block text-[14.5px] font-semibold text-[var(--color-ink)]">{t}</span>
                      <span className="text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Kicker tone="teal">The Card Journey</Kicker>
              <h2 className="mt-4 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] lg:text-[42px]">Your goals. Your cards. One route.</h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                Want a Venture X but not quite there? We map the steps from where you actually stand — honestly, without false encouragement or a flat no.
              </p>
            </div>
            <JourneyTimeline journey={SAMPLE_JOURNEY} />
          </div>
        </section>

        {/* Readiness */}
        <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="mb-10 max-w-xl">
            <Kicker tone="gold">Readiness</Kicker>
            <h2 className="mt-4 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] lg:text-[42px]">Know when you&rsquo;re ready.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
              Six factors, each rated, with the weakest one called out. The notch marks where you&rsquo;re well-positioned — positioning, never a promise of approval.
            </p>
          </div>
          <ReadinessBreakdown readiness={SAMPLE_READINESS} />
        </section>

        {/* Explainability */}
        <section id="explain" className="scroll-mt-20 border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div>
              <Kicker tone="indigo">Transparency</Kicker>
              <h2 className="mt-4 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] lg:text-[42px]">Every score comes with a receipt.</h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                Goals, credit, spending, issuer relationship, portfolio fit, timing, and fee — weighted, scored, and shown. The hatched space is what a card
                didn&rsquo;t earn, so you see why it isn&rsquo;t higher, too.
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-canvas)] p-6 shadow-[var(--shadow-card)]">
              <ScoreBreakdownPanel score={SAMPLE_SCORE} />
            </div>
          </div>
        </section>

        {/* Advisor */}
        <section id="advisor" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
            <div className="order-2 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card-hover)] lg:order-1">
              <div className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--color-ink)] text-[var(--color-mint)]">
                  <MessagesSquare size={15} />
                </span>
                <span className="text-[13.5px] font-semibold">Card Advisor</span>
              </div>
              <div className="space-y-3">
                <div className="ml-auto max-w-[80%] rounded-[16px_4px_16px_16px] bg-[var(--color-ink)] px-3.5 py-2.5 text-[13.5px] text-[var(--color-bg-elevated)]">
                  Should I get the Venture X?
                </div>
                <div className="max-w-[88%] rounded-[4px_16px_16px_16px] bg-[var(--color-bg-subtle)] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-[var(--color-ink)]">
                  Based on your current portfolio and goal, I&rsquo;d wait. Your account age is the weakest factor right now — a SavorOne first would build history with the same issuer.
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Kicker tone="teal">Card Advisor</Kicker>
              <h2 className="mt-4 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] lg:text-[42px]">Ask anything.</h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                Answers come from your real profile and our card database — never invented, and never an approval prediction. If it doesn&rsquo;t know, it says so.
              </p>
            </div>
          </div>
        </section>

        {/* Issuers */}
        <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8">
          <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Built around the issuers you already bank with</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {ISSUERS.map((i) => (
              <span key={i.id} className="flex items-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2 text-[13px] font-medium text-[var(--color-ink-soft)]">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: i.accentColor }} />
                {i.name}
              </span>
            ))}
          </div>
        </section>

        {/* End CTA */}
        <section className="px-5 pb-20 lg:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[#0b1a14] px-6 py-16 text-center sm:px-12 lg:py-20">
            <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(43,224,154,0.35),transparent_70%)]" />
            <h2 className="relative font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-white lg:text-[48px]">Build your credit card strategy.</h2>
            <p className="relative mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
              Educational, personalized guidance — not a guarantee of approval. You&rsquo;re always in control.
            </p>
            <Link
              href="/signup"
              className="group relative mt-8 inline-flex h-12 items-center gap-2 rounded-[14px] bg-[#2be09a] px-6 text-[14.5px] font-semibold text-[#03261a] transition-transform hover:-translate-y-0.5"
            >
              Build My Credit Strategy
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
