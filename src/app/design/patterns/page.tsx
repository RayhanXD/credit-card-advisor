import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DocPage, DocSection, Code, DataTable } from "@/components/design/DocParts";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { ReadinessBreakdown } from "@/components/strategy/ReadinessBreakdown";
import { JourneyTimeline } from "@/components/strategy/JourneyTimeline";
import { MilestoneRail } from "@/components/strategy/MilestoneRail";
import { getPersona } from "@/data/personas";
import { computeFullStrategy } from "@/lib/engine/strategy";

function Wire({ title, source, live, children, notes }: { title: string; source: string; live?: string; children: React.ReactNode; notes: string[] }) {
  return (
    <div className="grid gap-5 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)] md:grid-cols-[260px_1fr]">
      <div className="bg-grid flex items-center justify-center rounded-[14px] border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">{children}</div>
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-[19px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{title}</h3>
          {live && (
            <Link href={live} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--color-accent)] hover:underline">
              View live <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
        <ul className="space-y-1.5 text-[13.5px] leading-snug text-[var(--color-ink-soft)]">
          {notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-ink-faint)]" />
              {n}
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-[var(--color-ink-faint)]">
          <Code>{source}</Code>
        </p>
      </div>
    </div>
  );
}

const bar = "rounded-[3px] bg-[var(--color-ink)] opacity-80";
const block = "rounded-[5px] bg-[var(--color-bg-subtle)]";

export default function PatternsPage() {
  const jordan = getPersona("persona_jordan");
  const strategy = jordan ? computeFullStrategy(jordan) : null;

  return (
    <DocPage title="Screen patterns" lead="Full-screen compositions, and the strategy surfaces rendered from real engine output. The wireframes show structure; the live blocks below them are the actual components." source="src/components/layout · onboarding · auth · strategy">
      <DocSection kicker="Shells" title="Page structures">
        <div className="space-y-4">
          <Wire title="Marketing" source="src/app/page.tsx" live="/" notes={["Sticky header with logo, anchors, and one primary CTA.", "Hero on the ledger grid, then comparison, route, readiness, receipts, advisor, and an end CTA.", "Footer carries the policies and the not-advice statement."]}>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between"><span className="h-3 w-8 rounded-[3px] bg-[var(--color-ink)]" /><span className="h-3 w-12 rounded-[4px] bg-[var(--color-primary)]" /></div>
              <div className="space-y-1.5 py-3"><span className={`block h-3 w-4/5 ${bar}`} /><span className={`block h-3 w-3/5 ${bar}`} /><span className="block h-2 w-2/3 rounded-[3px] bg-[var(--color-border-strong)]" /></div>
              <div className="grid grid-cols-3 gap-1.5"><span className={`h-10 ${block}`} /><span className={`h-10 ${block}`} /><span className={`h-10 ${block}`} /></div>
            </div>
          </Wire>
          <Wire title="Auth" source="src/components/auth/AuthShell.tsx" live="/login" notes={["Two columns from the large breakpoint: the form on the left, a brand panel with three promises on the right.", "Logo and a plain “Home” link are always available.", "Errors are plain sentences under the field, never a toast."]}>
            <div className="grid w-full grid-cols-[1fr_1fr] gap-1.5">
              <div className="space-y-1.5"><span className={`block h-3 w-2/3 ${bar}`} /><span className="block h-6 rounded-[5px] border border-[var(--color-border-strong)]" /><span className="block h-6 rounded-[5px] border border-[var(--color-border-strong)]" /><span className="block h-6 rounded-[5px] bg-[var(--color-primary)]" /></div>
              <div className="rounded-[6px] bg-[var(--color-ink)] p-2"><span className="block h-2 w-3/4 rounded-[2px] bg-[var(--color-mint)]" /></div>
            </div>
          </Wire>
          <Wire title="Onboarding" source="src/components/onboarding/OnboardingShell.tsx" live="/onboarding" notes={["Sticky header with logo, Back, and sign out. A 3px progress bar on small screens; a step rail on large ones.", "One question group per step, a single full-width primary button at the bottom.", "Conditional steps (travel) are skipped, never shown empty. The step count adapts."]}>
            <div className="grid w-full grid-cols-[40px_1fr] gap-2">
              <div className="space-y-2 pt-1">{[0, 1, 2, 3].map((i) => (<span key={i} className={`block h-2 w-2 rounded-full ${i < 2 ? "bg-[var(--color-mint)]" : "border border-[var(--color-border-strong)]"}`} />))}</div>
              <div className="space-y-1.5"><span className={`block h-3 w-2/3 ${bar}`} /><span className="block h-7 rounded-[5px] border border-[var(--color-border-strong)]" /><span className="block h-7 rounded-[5px] border border-[var(--color-border-strong)]" /><span className="block h-6 rounded-[5px] bg-[var(--color-primary)]" /></div>
            </div>
          </Wire>
          <Wire title="App shell" source="src/components/layout/Sidebar.tsx · Topbar.tsx · MobileNav.tsx" live="/dashboard" notes={["Persistent sidebar from the large breakpoint, grouped as Plan, Wallet, and more. Below it, a bottom tab bar with a “More” sheet.", "The top bar holds the page title, notifications, demo profile switcher, and theme toggle.", "Content is capped at a readable width and centered."]}>
            <div className="grid w-full grid-cols-[34px_1fr] gap-1.5">
              <div className="space-y-1.5 rounded-[5px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1.5"><span className="block h-2 rounded-[2px] bg-[var(--color-ink)]" />{[0, 1, 2, 3].map((i) => (<span key={i} className="block h-1.5 rounded-[2px] bg-[var(--color-border-strong)]" />))}</div>
              <div className="space-y-1.5"><span className="block h-3 rounded-[4px] bg-[var(--color-bg-subtle)]" /><div className="grid grid-cols-3 gap-1.5"><span className={`h-9 ${block}`} /><span className={`h-9 ${block}`} /><span className={`h-9 ${block}`} /></div><span className={`block h-12 ${block}`} /></div>
            </div>
          </Wire>
        </div>
      </DocSection>

      {strategy && (
        <>
          <DocSection id="recommendation" kicker="Live · Jordan Patel" title="Recommendation" description="Student demo profile, goal: Capital One Venture X. The top recommendation is the stepping stone, not the target.">
            {strategy.topRecommendation && <RecommendationCard recommendation={strategy.topRecommendation} highlight />}
          </DocSection>

          {strategy.readiness && (
            <DocSection id="readiness" kicker="Live · Jordan Patel" title="Readiness" description="A dial with the 72% threshold notch, a plain-language verdict, and six components, each with a four-step status.">
              <ReadinessBreakdown readiness={strategy.readiness} />
            </DocSection>
          )}

          {strategy.journey && (
            <DocSection id="journey" kicker="Live · Jordan Patel" title="Card journey" description="Drawn as a route. A solid line for where you are, a dashed line for what’s ahead, and the goal card as the destination flag.">
              <JourneyTimeline journey={strategy.journey} />
            </DocSection>
          )}

          <DocSection id="rail" kicker="Live · Jordan Patel" title="Milestone rail" description="The strategy timeline as a horizontal calendar on wide screens and a vertical list on narrow ones.">
            <MilestoneRail entries={strategy.summary.timeline} />
          </DocSection>
        </>
      )}

      <DocSection id="breakpoints" kicker="Responsive" title="Breakpoints">
        <DataTable
          head={["Breakpoint", "Width", "What changes"]}
          rows={[
            [<Code key="a">sm</Code>, "640px", "Panel padding goes from 20 to 24px; two-column selection grids"],
            [<Code key="b">md</Code>, "768px", "Search field appears in the library header; multi-column lists"],
            [<Code key="c">lg</Code>, "1024px", "Sidebar replaces the bottom tab bar; onboarding step rail and the milestone rail appear"],
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
