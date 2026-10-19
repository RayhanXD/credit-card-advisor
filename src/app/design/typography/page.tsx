import { DocPage, DocSection, Specimen, DoDont, Code } from "@/components/design/DocParts";

const SCALE: { name: string; usage: string; cls: string; sample: string; sampleCls: string }[] = [
  { name: "Display XL", usage: "Landing hero", cls: "font-display 44/56/68 · extrabold 800 · leading 0.98 · tracking −0.035em", sample: "Your cards should work together.", sampleCls: "font-display text-[40px] font-extrabold leading-[0.98] tracking-[-0.035em]" },
  { name: "Display L", usage: "Landing section titles", cls: "font-display 34/44 · semibold · leading 1.05 · tracking −0.03em", sample: "Know when you’re ready.", sampleCls: "font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em]" },
  { name: "Wordmark", usage: "Logo lockup text", cls: "font-display 18 · bold 700 · tracking −0.02em", sample: "Strata", sampleCls: "font-display text-[18px] font-bold tracking-[-0.02em]" },
  { name: "Nav link", usage: "Landing header navigation", cls: "Inter 14 · semibold 600 · ink · hover accent", sample: "How it works", sampleCls: "text-[14px] font-semibold text-[var(--color-ink)]" },
  { name: "Page title", usage: "PageHeader h1", cls: "font-display 28/34 · semibold · leading 1.08 · tracking −0.025em", sample: "Ask anything about your cards.", sampleCls: "font-display text-[28px] font-semibold leading-[1.08] tracking-[-0.025em]" },
  { name: "Section heading", usage: "SectionHeading h2", cls: "font-display 19 · semibold · tracking −0.02em", sample: "Your metrics", sampleCls: "font-display text-[19px] font-semibold tracking-[-0.02em]" },
  { name: "Card title", usage: "Recommendation and journey titles", cls: "font-display 17 · semibold · tracking −0.015em", sample: "Capital One SavorOne", sampleCls: "font-display text-[17px] font-semibold tracking-[-0.015em]" },
  { name: "Lead", usage: "Page descriptions", cls: "Inter 14.5 · ink-soft · relaxed", sample: "Built from what you’ve shared, not your actual FICO or VantageScore.", sampleCls: "text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]" },
  { name: "Body", usage: "Descriptions, list items", cls: "Inter 13–13.5 · ink-soft · relaxed", sample: "Matches your actual spending habits.", sampleCls: "text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]" },
  { name: "Caption", usage: "Meta, hints, footnotes", cls: "Inter 12–12.5 · ink-faint", sample: "Verified May 2025 from issuer pages.", sampleCls: "text-[12.5px] text-[var(--color-ink-faint)]" },
  { name: "Kicker", usage: "Section markers, card labels", cls: "Inter 10.5 · medium · uppercase · tracking 0.12em · ink-faint", sample: "Educational composite", sampleCls: "font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]" },
  { name: "Figure", usage: "Money, scores, percentages", cls: ".figure · Inter · tabular · tracking −0.02em", sample: "$1,240  78/100  72%", sampleCls: "figure text-[22px] font-semibold text-[var(--color-ink)]" },
];

export default function TypographyPage() {
  return (
    <DocPage
      title="Typography"
      lead="Two families with two jobs. Manrope Semibold for headlines: warm, modern, confident. Inter Regular and Medium for body copy and financial data: readable, neutral, precise."
      source="src/app/layout.tsx · src/app/globals.css"
    >
      <DocSection kicker="Families" title="Two typefaces">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: "Manrope", role: "Headlines · Semibold", cls: "font-display", sample: "Your money. A clearer path.", use: "Headings, card titles, big numbers in stat cards. Warm, modern, confident. Utility: font-display." },
            { name: "Inter", role: "Body and financial data · Regular / Medium", cls: "font-sans", sample: "Build credit, understand your finances, and move confidently toward financial freedom.", use: "All body copy, UI, figures ($395, 49%, 72/100), and kickers. Readable, neutral, precise. The default font." },
          ].map((f) => (
            <div key={f.name} className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)]">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{f.role}</p>
              <p className="mt-1 text-[15px] font-semibold text-[var(--color-ink)]">{f.name}</p>
              <p className={`mt-4 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-ink)] ${f.cls}`}>{f.sample}</p>
              <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">{f.use}</p>
            </div>
          ))}
        </div>
        <p className="text-[12.5px] text-[var(--color-ink-faint)]">Typefaces are open source under the SIL Open Font License, loaded through <Code>next/font/google</Code>.</p>
      </DocSection>

      <DocSection id="scale" kicker="Scale" title="The type scale" description="Sizes are the ones the product actually uses. There is no separate scale file; these are the classes on the real components.">
        <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
          {SCALE.map((s) => (
            <div key={s.name} className="grid gap-3 p-5 md:grid-cols-[180px_1fr]">
              <div>
                <p className="text-[13.5px] font-semibold text-[var(--color-ink)]">{s.name}</p>
                <p className="text-[12px] text-[var(--color-ink-faint)]">{s.usage}</p>
              </div>
              <div className="min-w-0 space-y-2">
                <p className={s.sampleCls}>{s.sample}</p>
                <p className="font-code text-[11px] leading-snug text-[var(--color-ink-faint)]">{s.cls}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="figures" kicker="Numbers" title="Figures" description="Anything the user might compare, add, or scan is set in Inter with tabular numerals, so digits line up in columns and don’t jitter when they change.">
        <Specimen
          code={`<span className="figure text-[13px] font-semibold">{formatCurrency(card.annualFee)}</span>`}
          codeLabel="tsx"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">With .figure</p>
              <div className="figure space-y-1 text-[20px] font-semibold text-[var(--color-ink)]">
                <p>$1,111.00</p>
                <p>$ 395.00</p>
                <p>$ 95.00</p>
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Without</p>
              <div className="space-y-1 text-[20px] font-semibold text-[var(--color-ink)]">
                <p>$1,111.00</p>
                <p>$ 395.00</p>
                <p>$ 95.00</p>
              </div>
            </div>
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="rules" kicker="Rules" title="Writing it down">
        <DoDont
          doItems={[
            "Sentence case for every heading, button, and label.",
            "Let headings balance and body text pretty-wrap. Both are set globally with text-wrap.",
            "Put units next to figures: $/yr, %, “mo”.",
            "Use Manrope for headlines only. Numbers, labels, and body copy stay in Inter.",
            "Set navigation in semibold ink so it reads clearly at a glance.",
          ]}
          dontItems={[
            "Title Case On Buttons Or Headings.",
            "Display type below 17px; it loses its character.",
            "Uppercase kickers for sentences. They are for short labels only.",
            "Extrabold anywhere but the landing hero. 800 is reserved for Display XL; wordmark is bold, headings are semibold.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
