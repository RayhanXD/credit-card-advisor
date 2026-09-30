import Link from "next/link";
import { Sparkles, MessageCircleQuestion, Check } from "lucide-react";
import { PrimaryCTA, ExploreCardsCTA } from "@/components/landing/LandingCTAs";
import { CircularScore } from "@/components/ui/CircularScore";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)]">
            <Sparkles size={16} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Strata</span>
        </div>
        <nav className="hidden items-center gap-6 text-[13.5px] font-medium text-[var(--color-ink-soft)] sm:flex">
          <Link href="#compare" className="hover:text-[var(--color-ink)]">How it works</Link>
          <Link href="#advisor" className="hover:text-[var(--color-ink)]">Card Advisor</Link>
          <Link href="/onboarding" className="hover:text-[var(--color-ink)]">Sign in</Link>
        </nav>
        <div className="hidden sm:block">
          <PrimaryCTA label="Get started" size="sm" />
        </div>
      </header>

      <main id="main-content">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 pb-20 pt-14 text-center lg:pt-20">
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--color-ink-soft)]">
          A personal credit-card strategist, not a comparison site
        </p>
        <h1 className="text-[38px] font-semibold leading-[1.08] tracking-tight text-[var(--color-ink)] lg:text-[56px]">
          Your credit cards should work together.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--color-ink-soft)] lg:text-[18px]">
          Get a personalized strategy for the cards you have, the cards you should get next, and the goals you&rsquo;re building toward.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <PrimaryCTA />
          <ExploreCardsCTA />
        </div>
        <p className="mt-4 text-[12px] text-[var(--color-ink-faint)]">No credit card required. Takes about 4 minutes.</p>
      </section>

      {/* Comparison */}
      <section id="compare" className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="text-[28px] font-semibold tracking-tight lg:text-[34px]">Stop guessing which card to get next.</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7 opacity-70">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">Generic comparison sites</p>
            <ul className="space-y-3 text-[14px] text-[var(--color-ink-soft)]">
              <li>&ldquo;Here are the 10 best credit cards&rdquo;</li>
              <li>Same list for every visitor</li>
              <li>No sense of what you already own</li>
              <li>No path toward the card you actually want</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--color-ink)] bg-[var(--color-bg-elevated)] p-7 shadow-[var(--shadow-card-hover)]">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-wide text-[var(--color-accent)]">Your personalized strategy</p>
            <ul className="space-y-3 text-[14px] text-[var(--color-ink)]">
              {[
                "Built from your credit profile, cards, and goals",
                "Accounts for issuer relationships and overlap",
                "Shows the path, not just the destination",
                "Explains exactly why, every time",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Sample journey */}
      <section className="mx-auto max-w-4xl px-5 py-16 lg:py-24">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <h2 className="text-[28px] font-semibold tracking-tight lg:text-[34px]">Your cards. Your goals. One strategy.</h2>
          <p className="mt-3 text-[14.5px] text-[var(--color-ink-soft)]">
            Example: a Venture X goal, built from where you actually stand today.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 lg:p-8">
          <div className="space-y-0">
            {[
              { title: "Establish relationship", desc: "Capital One SavorOne — build history and earn rewards", tag: "Now" },
              { title: "Build your profile", desc: "Low utilization, on-time payments, maturing accounts", tag: "Next" },
              { title: "Reassess", desc: "Profile, account age, inquiries, income, portfolio", tag: "Next" },
              { title: "Potential next move: Venture X", desc: "A readiness assessment, not a guarantee", tag: "Later" },
            ].map((step, i, arr) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-[12px] font-semibold text-[var(--color-bg)]">
                    {i + 1}
                  </div>
                  {i < arr.length - 1 && <div className="my-1 w-px flex-1 bg-[var(--color-border-strong)]" />}
                </div>
                <div className="pb-8">
                  <span className="mb-1 inline-block rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">
                    {step.tag}
                  </span>
                  <p className="text-[15px] font-medium text-[var(--color-ink)]">{step.title}</p>
                  <p className="text-[13.5px] text-[var(--color-ink-soft)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Readiness */}
      <section className="mx-auto max-w-4xl px-5 py-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight lg:text-[34px]">Know when you&rsquo;re ready.</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
              A clear readiness breakdown across credit profile, account age, inquiries, issuer relationship, income, and
              portfolio — positioning, never a promise of approval.
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8">
            <CircularScore value={72} size={110} tone="accent" sublabel="Venture X Readiness" />
            <div className="space-y-2 text-[12.5px]">
              {[
                ["Credit profile", "Strong"],
                ["Account age", "Moderate"],
                ["Inquiries", "Strong"],
                ["Portfolio", "Moderate"],
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between gap-6">
                  <span className="text-[var(--color-ink-soft)]">{label}</span>
                  <span className="font-medium text-[var(--color-ink)]">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advisor teaser */}
      <section id="advisor" className="mx-auto max-w-4xl px-5 py-16 lg:py-24">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="text-[28px] font-semibold tracking-tight lg:text-[34px]">Ask anything.</h2>
          <p className="mt-3 text-[14.5px] text-[var(--color-ink-soft)]">Card Advisor answers from your real profile — never a guess.</p>
        </div>
        <div className="mx-auto max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-bg)]">
              <MessageCircleQuestion size={13} />
            </div>
            <span className="text-[13px] font-semibold">Card Advisor</span>
          </div>
          <div className="space-y-2.5">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[var(--color-ink)] px-3.5 py-2.5 text-[13px] text-[var(--color-bg)]">
              Should I get the Venture X?
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--color-bg-subtle)] px-3.5 py-2.5 text-[13px] leading-relaxed text-[var(--color-ink)]">
              Based on your current portfolio and goal of building toward Venture X, I&rsquo;d wait. Here&rsquo;s what I&rsquo;d focus on first…
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="mx-auto max-w-4xl px-5 py-16 lg:py-24">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="text-[28px] font-semibold tracking-tight lg:text-[34px]">Built around your financial life.</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["Chase", "Capital One", "American Express", "Citi", "Bank of America", "Wells Fargo", "U.S. Bank", "Discover"].map((n) => (
            <span key={n} className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink-soft)]">
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* End CTA */}
      <section className="mx-auto max-w-2xl px-5 py-20 text-center lg:py-28">
        <h2 className="text-[30px] font-semibold tracking-tight lg:text-[38px]">Build your credit card strategy.</h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-[var(--color-ink-soft)]">
          Educational, personalized guidance — not a guarantee of approval. You&rsquo;re always in control.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryCTA label="Build My Credit Strategy" />
        </div>
      </section>

      </main>

      <SiteFooter />
    </div>
  );
}
