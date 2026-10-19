import { DocPage, DocSection, DataTable, Callout, Code, Specimen } from "@/components/design/DocParts";
import { ContrastTable, type ContrastPair } from "@/components/design/ContrastTable";
import { CodeBlock } from "@/components/design/CodeBlock";
import { Button } from "@/components/ui/Button";
import { FitBadge } from "@/components/cards/FitBadge";
import { FactorStrip } from "@/components/cards/ScoreBreakdownPanel";
import { CircularScore } from "@/components/ui/CircularScore";

const PAIRS: ContrastPair[] = [
  { fg: "--color-ink", bg: "--color-bg-elevated", use: "Headings, figures", need: 4.5 },
  { fg: "--color-ink-soft", bg: "--color-bg-elevated", use: "Body copy", need: 4.5 },
  { fg: "--color-ink-faint", bg: "--color-bg-elevated", use: "Captions, labels, placeholders", need: 4.5 },
  { fg: "--color-ink-faint", bg: "--color-bg-subtle", use: "Captions on tinted chips", need: 4.5 },
  { fg: "--color-accent", bg: "--color-bg-elevated", use: "Links, brand text", need: 4.5 },
  { fg: "--color-accent", bg: "--color-accent-soft", use: "Selected labels, positive badge", need: 4.5 },
  { fg: "--color-teal", bg: "--color-teal-soft", use: "“Consider” badge", need: 4.5 },
  { fg: "--color-gold", bg: "--color-gold-soft", use: "“Wait” badge, cautions", need: 4.5 },
  { fg: "--color-coral", bg: "--color-coral-soft", use: "“Not right now” badge", need: 4.5 },
  { fg: "--color-indigo", bg: "--color-indigo-soft", use: "Categorical badge", need: 4.5 },
  { fg: "--color-primary-ink", bg: "--color-primary", use: "Primary button label", need: 4.5 },
  { fg: "--color-danger-ink", bg: "--color-danger", use: "Danger button label", need: 4.5 },
  { fg: "#03261a", bg: "--color-mint", use: "Label on a mint fill", need: 4.5 },
  { fg: "--color-mint", bg: "--color-bg-elevated", use: "Mint bars and markers (graphics only, never text)", need: 3 },
  { fg: "--color-border-strong", bg: "--color-bg-elevated", use: "Input borders and dividers", need: 3 },
];

export default function AccessibilityPage() {
  return (
    <DocPage
      title="Accessibility"
      lead="A quality bar for every change, not an audit after launch. Contrast below is measured live from the tokens, so it reflects the theme you are looking at. Open gaps are listed at the bottom, on purpose."
      source="src/app/globals.css · src/components/ui/Modal.tsx"
    >
      <DocSection kicker="Contrast" title="Measured, not claimed" description="WCAG 2.x ratios computed in your browser from the live token values. Toggle the theme in the header to check both. Text needs 4.5:1; graphics and UI borders need 3:1.">
        <ContrastTable pairs={PAIRS} />
        <Callout tone="gap" title="Two rows fail in the light theme, and that is a real finding">
          The grade is the ratio’s best-case use; “meets need” compares it to what that pairing requires. Text pairings all pass. But mint graphics on white and the strong border token fall under the 3:1 that WCAG 1.4.11 asks of meaningful graphics and UI boundaries. See gap 1 below. Check the dark theme too; the numbers differ.
        </Callout>
      </DocSection>

      <DocSection id="focus" kicker="Focus" title="Visible, consistent, never removed" description="Every interactive element shows the same 2px mint outline with a 2px offset on keyboard focus. Press Tab in this block.">
        <Specimen>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <a href="#focus" className="rounded-[8px] px-2 py-1 text-[13.5px] font-medium text-[var(--color-accent)] underline">
              A link
            </a>
            <input aria-label="Example input" placeholder="An input" className="h-10 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 text-[14px] outline-none focus:border-[var(--color-mint)]" />
          </div>
        </Specimen>
        <CodeBlock label="css" code={`:focus-visible { outline: 2px solid var(--color-mint); outline-offset: 2px; }`} />
      </DocSection>

      <DocSection id="keyboard" kicker="Keyboard" title="Operable without a mouse">
        <DataTable
          head={["Pattern", "Behavior"]}
          rows={[
            ["Skip link", <>The first focusable element on every page jumps to <Code>#main-content</Code>.</>],
            ["Modal", "Moves focus in on open, traps Tab and Shift+Tab inside, closes on Escape, and returns focus to the trigger."],
            ["Selection tiles", <>Real buttons with <Code>role=&quot;radio&quot;</Code> or <Code>&quot;checkbox&quot;</Code> and <Code>aria-checked</Code>. Space and Enter toggle.</>],
            ["Tag input", "Enter or comma commits a tag. Each tag’s remove button has an accessible name."],
            ["Search palette", "⌘K or Ctrl+K opens it. Arrow keys move, Enter opens, Escape closes."],
            ["Tooltip", "Opens on focus as well as hover."],
          ]}
        />
      </DocSection>

      <DocSection id="semantics" kicker="Semantics" title="Scores that screen readers can read" description="Visual scores each carry a text equivalent, so the number and its meaning are available without sight.">
        <Specimen>
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <CircularScore value={72} size={112} sublabel="Readiness" threshold={72} />
            <div className="space-y-4">
              <FitBadge fitLabel="strong_fit" />
              <FactorStrip score={{ goalAlignment: 23, creditProfileFit: 14, spendingMatch: 15, issuerRelationship: 5, portfolioCompatibility: 10, timing: 6, annualFeeFit: 5, total: 78 }} height={12} />
            </div>
          </div>
        </Specimen>
        <DataTable
          head={["Component", "Exposed as"]}
          rows={[
            [<Code key="a">CircularScore</Code>, <><Code>role=&quot;meter&quot;</Code> with value, min, max, and a label</>],
            [<Code key="b">MeterBar</Code>, <><Code>role=&quot;progressbar&quot;</Code> with value and label</>],
            [<Code key="c">FactorStrip</Code>, <><Code>role=&quot;img&quot;</Code> whose label reads every factor, for example “Fit score 78 of 100. Goal alignment 23 of 25, …”</>],
            [<Code key="d">FitBadge</Code>, "Text label plus bars. The bars are decorative (aria-hidden); the text carries the meaning."],
            ["Icon-only buttons", <>Always an <Code>aria-label</Code>, such as “Dismiss notification” or “Close”.</>],
          ]}
        />
      </DocSection>

      <DocSection id="color" kicker="Color" title="Never color alone">
        <p className="max-w-2xl text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
          Status always pairs color with something else: a word (Strong fit, Needs work), a count of bars or steps, or a plus or minus sign. A user who can’t distinguish mint from gold can still read every state.
        </p>
      </DocSection>

      <DocSection id="motion" kicker="Motion" title="Reduced motion">
        <p className="max-w-2xl text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
          <Code>prefers-reduced-motion</Code> collapses every animation and transition at the document level. See <Code>/design/motion</Code> for the rule and why every animation must still land on a meaningful end state.
        </p>
      </DocSection>

      <DocSection id="gaps" kicker="Honest status" title="Open gaps">
        <Callout tone="gap" title="Known issues, in rough priority order">
          <ol className="mt-1 list-decimal space-y-1.5 pl-5">
            <li>
              <strong>Non-text contrast (measured above).</strong> In the light theme, mint fills on white are about 2.3:1 and <Code>--color-border-strong</Code> on white is about 1.6:1, both below the 3:1 WCAG 1.4.11 sets for graphics and component boundaries. It is softened today because every mint graphic sits beside a number or label and every input has a visible label, but the input outline itself is faint. Fix: take input borders to 3:1 or more, and give mint dials and bars a darker stroke or a deeper mint on light surfaces.
            </li>
            <li>
              <strong>Touch targets.</strong> Medium buttons are 40px and small buttons are 32px; the guideline is 44px. Small buttons and the 28px logo link need padding or a larger hit area on touch.
            </li>
            <li>
              <strong>Not independently audited.</strong> This is an engineering baseline built and checked in-house, with no third-party audit and no assistive-technology test pass recorded. A professional audit and a VPAT are still needed before launch.
            </li>
            <li>
              <strong>Tooltip content on touch.</strong> It only appears on hover and focus, so anything important in a tooltip is unreachable by tap. Keep essential content out of tooltips.
            </li>
            <li>
              <strong>Charts.</strong> Dials and strips have text equivalents, but there is no data-table alternative for any of them.
            </li>
            <li>
              <strong>Language and landmarks</strong> are set on the app layouts but have not been verified page by page on this library.
            </li>
          </ol>
        </Callout>
      </DocSection>
    </DocPage>
  );
}
