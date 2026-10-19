import { DocPage, DocSection, Specimen, DoDont, Code } from "@/components/design/DocParts";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Kicker } from "@/components/ui/Panel";
import { CircularScore } from "@/components/ui/CircularScore";
import { FitBadge, FitSignalBars } from "@/components/cards/FitBadge";
import { StatusSteps } from "@/components/strategy/ReadinessBreakdown";
import { ReasonList } from "@/components/cards/ReasonList";
import { CardFace } from "@/components/cards/CreditCardTile";
import { getCard } from "@/data/cards";
import { brandName } from "@/lib/site";
import type { FitLabel, ReadinessStatus } from "@/lib/types";

const FITS: FitLabel[] = ["strong_fit", "consider", "wait", "not_recommended_now"];
const STATUSES: ReadinessStatus[] = ["strong", "moderate", "developing", "weak"];

export default function MotifsPage() {
  const cardA = getCard("chase_sapphire_preferred");
  const cardB = getCard("amex_gold");
  return (
    <DocPage
      title="Motifs"
      lead={`The small repeated shapes that make ${brandName} recognizable: a mark built from a path, a mono label with a square dot, a ledger grid, and a hatch for what hasn’t been earned yet.`}
      source="src/components/brand · src/app/globals.css"
    >
      <DocSection kicker="Brand" title="The mark" description="Three ascending steps with a waypoint above the last one: the product’s idea of a path to the next card. It is independent of the final name.">
        <Specimen>
          <div className="flex flex-wrap items-end gap-8">
            {[24, 32, 48, 72].map((s) => (
              <div key={s} className="space-y-2 text-center">
                <LogoMark size={s} />
                <p className="figure text-[11px] text-[var(--color-ink-faint)]">{s}px</p>
              </div>
            ))}
            <div className="space-y-2">
              <Logo size={32} />
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">Lockup</p>
            </div>
          </div>
        </Specimen>
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
          The tile uses <Code>--logo-tile</Code>, the steps use mint at three opacities, and the waypoint is vivid gold. Keep clear space equal to one step width on every side. The wordmark is set in the display face at bold (700) and reads its text from <Code>brandName</Code>.
        </p>
      </DocSection>

      <DocSection id="kicker" kicker="Labels" title="Kicker" description="A small mono label with a colored square, used above headings to name the section. The square’s color follows the content’s meaning.">
        <Specimen code={`<Kicker tone="teal">Educational composite</Kicker>`} codeLabel="tsx">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {(["mint", "teal", "gold", "coral", "indigo", "ink"] as const).map((t) => (
              <Kicker key={t} tone={t}>
                {t}
              </Kicker>
            ))}
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="ledger" kicker="Surfaces" title="Ledger grid and hatch" description="Hero surfaces sit on a fine ledger-paper grid. Unearned score space is hatched, so what is missing is as visible as what is there.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Specimen title=".bg-grid" code={`<div className="bg-grid" />`} codeLabel="tsx">
            <div className="bg-grid flex h-28 items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[13px] text-[var(--color-ink-soft)]">Hero and empty states</div>
          </Specimen>
          <Specimen title=".bg-hatch" code={`<div className="bg-hatch" />`} codeLabel="tsx">
            <div className="bg-hatch flex h-28 items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[13px] text-[var(--color-ink-soft)]">Points not earned</div>
          </Specimen>
        </div>
      </DocSection>

      <DocSection id="signals" kicker="Signals" title="Signal bars and status steps" description="Fit and readiness are shown as discrete steps rather than a percentage, because the inputs are approximate and the product must not imply precision it doesn’t have.">
        <Specimen title="Fit signal (four bars)">
          <div className="flex flex-wrap items-center gap-4">
            {FITS.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <FitSignalBars fitLabel={f} />
                <FitBadge fitLabel={f} />
              </div>
            ))}
          </div>
        </Specimen>
        <Specimen title="Readiness status (four steps)">
          <div className="grid gap-4 sm:grid-cols-4">
            {STATUSES.map((s) => (
              <div key={s} className="space-y-2">
                <StatusSteps status={s} />
                <p className="text-[12.5px] font-medium capitalize text-[var(--color-ink)]">{s === "weak" ? "Needs work" : s}</p>
              </div>
            ))}
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="dial" kicker="Dial" title="The 270° dial" description="Tick marks around a 270° arc, a rounded fill, and an optional threshold notch for the line that matters (72% for “well-positioned”).">
        <Specimen>
          <div className="flex flex-wrap items-center gap-10">
            <CircularScore value={49} size={140} sublabel="Venture X readiness" threshold={72} tone="accent" />
            <CircularScore value={86} size={96} sublabel="Credit health" tone="teal" />
            <CircularScore value={34} size={64} tone="danger" />
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="ledger-list" kicker="Reasons" title="Reason ledger" description="A plus for what supports the fit, a minus for what weighs against it. Every recommendation carries both sides.">
        <Specimen>
          <div className="max-w-md">
            <ReasonList
              reasons={["Fits your current credit profile", "Builds on your existing Capital One relationship"]}
              cautions={["Annual fee may be higher than your stated tolerance"]}
            />
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="card-face" kicker="Cards" title="Card face" description="A stylized, generic card front, never a reproduction of any issuer’s real art. Issuer color drives a layered gradient with a fine guilloche pattern, a drawn EMV chip, and the network wordmark.">
        <Specimen>
          <div className="grid max-w-xl grid-cols-2 gap-6">
            {cardA && <CardFace card={cardA} />}
            {cardB && <CardFace card={cardB} />}
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="guardrails" kicker="Guardrails" title="Using motifs well">
        <DoDont
          doItems={[
            "Use one motif per surface so each stays meaningful.",
            "Pair the hatch with a label so unearned space is never a mystery.",
            "Draw the threshold notch only where a real threshold exists.",
          ]}
          dontItems={[
            "Recolor the mark, or place it on a mint background.",
            "Use the grid behind dense body text.",
            "Use a card face with real issuer logos or art.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
