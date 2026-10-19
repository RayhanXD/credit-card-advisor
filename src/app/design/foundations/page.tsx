import Link from "next/link";
import { DocPage, DocSection, DataTable, Callout, Code } from "@/components/design/DocParts";
import { CodeBlock } from "@/components/design/CodeBlock";
import { Panel } from "@/components/ui/Panel";
import { brandName } from "@/lib/site";

const PRINCIPLES = [
  {
    title: "Positioning, not a promise.",
    body: `Nothing in ${brandName} implies an approval. Fit is shown as a signal (four bars), readiness as a threshold on a dial, and every screen that recommends a card carries the disclaimer.`,
  },
  {
    title: "Every score has a receipt.",
    body: "Any number can be opened into its parts. The factor strip gives each factor a slot sized to its weight, and hatches the points not earned, so “why not higher” is as visible as “why this high”.",
  },
  {
    title: "Data earns color.",
    body: "Mint is the brand and the positive signal. Gold, teal, coral, and indigo carry meaning in data (score factors, fit signals, insight types), never decoration.",
  },
  {
    title: "Figures are mono, moments are display.",
    body: "Headlines use Manrope Semibold. Body copy and financial data use Inter with tabular numerals.",
  },
];

export default function FoundationsPage() {
  return (
    <DocPage
      title="Foundations"
      lead={`The ideas the rest of the library is built on, where the source of truth lives, and what is still missing. Tokens first, then components, then patterns.`}
      source="src/app/globals.css"
    >
      <DocSection kicker="Principles" title="Four rules that decide the hard calls">
        <div className="grid gap-4 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Panel key={p.title} className="p-6">
              <span className="figure text-[12px] text-[var(--color-ink-faint)]">0{i + 1}</span>
              <h3 className="mt-2 font-display text-[19px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{p.body}</p>
            </Panel>
          ))}
        </div>
      </DocSection>

      <DocSection kicker="Map" title="Where everything lives" description="Every specimen in this library renders these exact files, and colors are read live from the stylesheet, so a token change shows up here without editing the docs.">
        <DataTable
          head={["Layer", "What", "Path"]}
          rows={[
            ["Tokens", "Color, radius, shadow, series, keyframes, utilities", <Code key="a">src/app/globals.css</Code>],
            ["Fonts", "Manrope, Inter", <Code key="b">src/app/layout.tsx</Code>],
            ["Brand", "Logo mark and wordmark, product name", <><Code>src/components/brand/Logo.tsx</Code> <Code>src/lib/site.ts</Code></>],
            ["UI primitives", "Button, Badge, Panel, forms, Modal, Toast, Tooltip", <Code key="d">src/components/ui/*</Code>],
            ["Score components", "Dial, meter, factor strip, reason ledger, fit badge", <><Code>src/components/ui/*</Code> <Code>src/components/cards/*</Code></>],
            ["Strategy components", "Readiness, journey route, milestone rail", <Code key="f">src/components/strategy/*</Code>],
            ["Shells", "App shell, onboarding, auth, legal", <><Code>layout/*</Code> <Code>onboarding/*</Code> <Code>auth/*</Code> <Code>legal/*</Code></>],
          ]}
        />
      </DocSection>

      <DocSection id="using-tokens" kicker="Usage" title="Using tokens" description="Components reference CSS variables directly through Tailwind arbitrary values. There is no token build step.">
        <CodeBlock
          label="tsx"
          code={`<div className="rounded-[var(--radius-card)] border border-[var(--color-border)]
  bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
  <p className="text-[var(--color-ink-soft)]">Body copy</p>
  <span className="figure text-[var(--color-ink)]">$1,240</span>
</div>`}
        />
        <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
          Naming: <Code>--color-*</Code> for color, <Code>--series-*</Code> for the seven score-factor colors, <Code>--shadow-*</Code> for elevation, <Code>--radius-*</Code> for the two named radii. Prefer a token over a hex value, always.
        </p>
      </DocSection>

      <DocSection id="theming" kicker="Theming" title="Light and dark" description="Both themes ship together. Every token is redefined under the dark selector.">
        <CodeBlock
          label="css"
          code={`:root { --color-bg-elevated: #ffffff; /* … */ }
:root[data-theme="dark"] { --color-bg-elevated: #0c1813; /* … */ }

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));`}
        />
        <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
          The <Code>data-theme</Code> attribute is set before first paint by an inline script in the root layout, and persisted in <Code>localStorage</Code> under <Code>strata-theme</Code>. Use the sun and moon in the header to flip this page. Light is the default.
        </p>
      </DocSection>

      <DocSection id="gaps" kicker="Honest status" title="What the library does not have yet">
        <Callout tone="gap" title="Known gaps, tracked here so they get fixed">
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <strong>Button has no loading state.</strong> Async actions currently disable the button only. See <Link className="font-medium text-[var(--color-accent)] underline" href="/design/buttons">Buttons</Link>.
            </li>
            <li>
              <strong>The <Code>mint</Code> button variant is unused</strong> in the product today, and <Code>--color-bg</Code> duplicates <Code>--color-canvas</Code>.
            </li>
            <li>
              <strong>Tooltip is hover and focus only,</strong> with no placement logic, no delay, and no touch behavior.
            </li>
            <li>
              <strong>Medium buttons are 40px tall,</strong> below the 44px touch-target guideline. Small is 32px. See <Link className="font-medium text-[var(--color-accent)] underline" href="/design/accessibility">Accessibility</Link>.
            </li>
            <li>
              <strong>No automated visual tests.</strong> This site is the only regression check on components, and it is manual.
            </li>
            <li>
              <strong>Product name is not final.</strong> Every user-facing mention reads from <Code>src/lib/site.ts</Code>, and this library does too, so a rename is a one-line change.
            </li>
          </ul>
        </Callout>
      </DocSection>
    </DocPage>
  );
}
