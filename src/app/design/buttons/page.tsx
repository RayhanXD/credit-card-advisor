import { ArrowRight, Plus, Trash2, Search } from "lucide-react";
import { DocPage, DocSection, Specimen, DoDont, DataTable, Callout, Code } from "@/components/design/DocParts";
import { Button } from "@/components/ui/Button";

const VARIANTS: { v: "primary" | "mint" | "secondary" | "ghost" | "danger"; use: string }[] = [
  { v: "primary", use: "The one main action on a screen. Ink in light mode, mint in dark mode." },
  { v: "secondary", use: "Supporting actions. Bordered, sits beside a primary." },
  { v: "ghost", use: "Low-emphasis actions, toolbars, and “Back”." },
  { v: "danger", use: "Destructive actions, always behind a confirmation." },
  { v: "mint", use: "Available but unused in the product today. Reserve for a brand moment, never as a second primary." },
];

export default function ButtonsPage() {
  return (
    <DocPage title="Buttons" lead="Five variants, three sizes, and one rule: a screen has one primary action. Buttons are verbs that name an outcome." source="src/components/ui/Button.tsx">
      <DocSection kicker="Variants" title="Variants">
        <Specimen code={`<Button>Build my strategy</Button>\n<Button variant="secondary">See my wallet</Button>\n<Button variant="ghost">Back</Button>\n<Button variant="danger">Remove card</Button>`} codeLabel="tsx">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Build my strategy</Button>
            <Button variant="secondary">See my wallet</Button>
            <Button variant="ghost">Back</Button>
            <Button variant="danger">Remove card</Button>
            <Button variant="mint">Mint</Button>
          </div>
        </Specimen>
        <DataTable head={["Variant", "Use"]} rows={VARIANTS.map((x) => [<Code key={x.v}>{x.v}</Code>, x.use])} />
      </DocSection>

      <DocSection id="sizes" kicker="Sizes" title="Sizes" description="Heights are 32, 40, and 48px. Use large for the primary action on forms and heroes, small inside dense rows.">
        <Specimen code={`<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>`} codeLabel="tsx">
          <div className="flex flex-wrap items-end gap-3">
            <Button size="sm">Small · 32px</Button>
            <Button size="md">Medium · 40px</Button>
            <Button size="lg">Large · 48px</Button>
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="icons" kicker="Icons" title="Icons" description="Leading icons describe the action. A trailing arrow means “continue” and nudges right on hover.">
        <Specimen code={`<Button icon={<Plus size={16} />}>Add a card</Button>\n<Button iconRight={<ArrowRight size={16} />}>Continue</Button>`} codeLabel="tsx">
          <div className="flex flex-wrap items-center gap-3">
            <Button icon={<Plus size={16} />}>Add a card</Button>
            <Button variant="secondary" icon={<Search size={15} />}>Find a card</Button>
            <Button iconRight={<ArrowRight size={16} />} size="lg">Continue</Button>
            <Button variant="danger" icon={<Trash2 size={15} />}>Reset my data</Button>
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="states" kicker="States" title="States">
        <Specimen code={`<Button disabled>Continue</Button>`} codeLabel="tsx">
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>Disabled</Button>
            <Button className="w-full max-w-xs" size="lg">Full width</Button>
          </div>
        </Specimen>
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
          Hover, press, and keyboard focus are built in: hover shifts the fill, press moves the button down 1px, and focus shows the global 2px mint ring.
        </p>
        <Callout tone="gap" title="Gap: no loading state">
          There is no <Code>loading</Code> prop. Async buttons are disabled for the duration. Add a spinner and <Code>aria-busy</Code> before the first feature that submits to a slow endpoint.
        </Callout>
      </DocSection>

      <DocSection id="rules" kicker="Rules" title="Writing and placing buttons">
        <DoDont
          doItems={[
            "Verb plus outcome: “Build my strategy”, “Add a card”.",
            "Primary on the right of a pair, or full width on mobile.",
            "Confirm destructive actions in a modal that says what will and won’t happen.",
          ]}
          dontItems={[
            "“Submit”, “OK”, “Click here”.",
            "Two primary buttons in one view.",
            "Danger buttons that act on first click.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
