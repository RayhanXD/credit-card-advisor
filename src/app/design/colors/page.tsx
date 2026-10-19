import Link from "next/link";
import { DocPage, DocSection, DataTable, Callout, Code, Specimen } from "@/components/design/DocParts";
import { TokenSwatch } from "@/components/design/TokenSwatch";
import { FactorStrip } from "@/components/cards/ScoreBreakdownPanel";
import { SeriesSwatches } from "@/components/design/SeriesSwatches";
import { Badge } from "@/components/ui/Badge";

type Group = { title: string; kicker: string; note: string; tokens: [string, string][] };

const GROUPS: Group[] = [
  {
    title: "Surfaces",
    kicker: "Neutrals",
    note: "Neutrals are tinted toward green so surfaces, borders, and shadows read as one family.",
    tokens: [
      ["--color-canvas", "Page background"],
      ["--color-bg-elevated", "Cards, panels, inputs, modals"],
      ["--color-bg-subtle", "Hover fills, chips, segmented tracks"],
      ["--color-bg-sunken", "Hatch fill, slider track, code blocks"],
      ["--color-border", "Hairlines and card outlines"],
      ["--color-border-strong", "Input hover, dashed dividers, ticks"],
    ],
  },
  {
    title: "Ink",
    kicker: "Text",
    note: "Three steps of text. Soft is for body copy, faint is for captions and labels.",
    tokens: [
      ["--color-ink", "Headings, figures, primary text"],
      ["--color-ink-soft", "Body copy"],
      ["--color-ink-faint", "Captions, labels, placeholders"],
    ],
  },
  {
    title: "Primary action",
    kicker: "Action",
    note: "Ink in light mode, mint in dark mode. One primary action per view.",
    tokens: [
      ["--color-primary", "Primary button fill"],
      ["--color-primary-hover", "Primary button hover"],
      ["--color-primary-ink", "Text on the primary fill"],
    ],
  },
  {
    title: "Brand mint",
    kicker: "Brand",
    note: "Mint is the brand and the positive signal. Never use it as text on a light surface; use the deeper accent for that.",
    tokens: [
      ["--color-mint", "Brand fill, focus ring, positive data"],
      ["--color-mint-bright", "Highlights on dark surfaces"],
      ["--color-accent", "Brand text, links, selected labels"],
      ["--color-accent-fill", "Brand fill that must hold text"],
      ["--color-accent-soft", "Selected tiles, positive tints"],
      ["--color-accent-ink", "Text on accent fills"],
    ],
  },
  {
    title: "Gold",
    kicker: "Data hue",
    note: "Caution, “wait”, and attention.",
    tokens: [
      ["--color-gold", "Text on gold-soft"],
      ["--color-gold-vivid", "Bars, markers, fills"],
      ["--color-gold-soft", "Tinted backgrounds"],
      ["--color-gold-ink", "Text on vivid gold"],
    ],
  },
  {
    title: "Teal",
    kicker: "Data hue",
    note: "Solid, “consider”, and informational data.",
    tokens: [
      ["--color-teal", "Text on teal-soft"],
      ["--color-teal-vivid", "Bars, markers, fills"],
      ["--color-teal-soft", "Tinted backgrounds"],
    ],
  },
  {
    title: "Coral",
    kicker: "Data hue",
    note: "Negative signal and “not right now”. Used sparingly; it is never a decoration.",
    tokens: [
      ["--color-coral", "Text on coral-soft"],
      ["--color-coral-vivid", "Bars, markers, fills"],
      ["--color-coral-soft", "Tinted backgrounds"],
    ],
  },
  {
    title: "Indigo",
    kicker: "Data hue",
    note: "Categorical data that is neither good nor bad (for example, the “unused benefit” insight type).",
    tokens: [
      ["--color-indigo", "Text on indigo-soft"],
      ["--color-indigo-vivid", "Bars, markers, fills"],
      ["--color-indigo-soft", "Tinted backgrounds"],
    ],
  },
  {
    title: "Semantic",
    kicker: "Status",
    note: "Aliases of the hues above, named for what they mean in alerts and badges.",
    tokens: [
      ["--color-success", "Success text and icons"],
      ["--color-success-soft", "Success tint"],
      ["--color-warning", "Warning text and icons"],
      ["--color-warning-soft", "Warning tint"],
      ["--color-danger", "Danger text and destructive fill"],
      ["--color-danger-soft", "Danger tint"],
      ["--color-danger-ink", "Text on the danger fill"],
    ],
  },
];

const SAMPLE_SCORE = {
  goalAlignment: 23,
  creditProfileFit: 14,
  spendingMatch: 15,
  issuerRelationship: 5,
  portfolioCompatibility: 10,
  timing: 6,
  annualFeeFit: 5,
  total: 78,
};

export default function ColorsPage() {
  return (
    <DocPage
      title="Colors"
      lead="A cool, green-tinted canvas, one brand color, and four data hues that only appear when they mean something. Swatches read their values live from the stylesheet, so flip the theme in the header to compare."
      source="src/app/globals.css"
    >
      <DocSection kicker="Ladder" title="Deep, vivid, soft" description="Each data hue comes in three steps, and the step tells you what it is for.">
        <Specimen>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "Deep", use: "Text", cls: "text-[var(--color-teal)]", note: "--color-teal" },
              { step: "Vivid", use: "Fills, bars, markers", cls: "", note: "--color-teal-vivid" },
              { step: "Soft", use: "Tinted background", cls: "", note: "--color-teal-soft" },
            ].map((s, i) => (
              <div key={s.step} className="space-y-3">
                {i === 0 && <p className={`font-display text-[28px] font-semibold tracking-[-0.02em] ${s.cls}`}>Consider</p>}
                {i === 1 && <div className="h-3 w-full rounded-full bg-[var(--color-teal-vivid)]" />}
                {i === 2 && <div className="rounded-[10px] bg-[var(--color-teal-soft)] px-3 py-2 text-[13px] text-[var(--color-teal)]">A soft panel with deep text</div>}
                <p className="text-[12.5px] text-[var(--color-ink-soft)]">
                  <span className="font-semibold text-[var(--color-ink)]">{s.step}</span> · {s.use}
                  <br />
                  <Code>{s.note}</Code>
                </p>
              </div>
            ))}
          </div>
        </Specimen>
      </DocSection>

      {GROUPS.map((g) => (
        <DocSection key={g.title} id={g.title.toLowerCase().replace(/\s+/g, "-")} kicker={g.kicker} title={g.title} description={g.note}>
          <div className="grid gap-3 sm:grid-cols-2">
            {g.tokens.map(([token, role]) => (
              <TokenSwatch key={token} token={token} role={role} />
            ))}
          </div>
        </DocSection>
      ))}

      <DocSection id="series" kicker="Data viz" title="Score-factor series" description="Seven colors, one per factor in the fit score. Each factor always has the same color, everywhere it appears.">
        <SeriesSwatches />
        <Specimen title="Live: the factor strip, in order of weight">
          <FactorStrip score={SAMPLE_SCORE} height={14} />
        </Specimen>
      </DocSection>

      <DocSection id="meaning" kicker="Consistency" title="What each color means in the product" description="The same four colors carry the same meaning in every status system, so a user learns the language once.">
        <DataTable
          head={["Signal", "Fit label", "Readiness", "Credit health", "Insight"]}
          rows={[
            [<Badge key="1" tone="success">Mint</Badge>, "Strong fit", "Strong", "Excellent", "Positive"],
            [<Badge key="2" tone="teal">Teal</Badge>, "Consider", "Moderate", "Good", "Solid, informational"],
            [<Badge key="3" tone="warning">Gold</Badge>, "Wait", "Developing", "Fair", "Caution, overlap, fee review"],
            [<Badge key="4" tone="danger">Coral</Badge>, "Not right now", "Needs work", "Poor", "Gap"],
            [<Badge key="5" tone="indigo">Indigo</Badge>, "—", "—", "—", "Unused benefit (categorical)"],
          ]}
        />
        <Callout title="Never color alone">
          Every status above also has a text label, and fit and readiness add a bar count. See <Link className="font-medium text-[var(--color-accent)] underline" href="/design/accessibility">Accessibility</Link> for the live contrast table.
        </Callout>
      </DocSection>
    </DocPage>
  );
}
