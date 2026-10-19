import { DocPage, DocSection, DataTable, Code, Specimen } from "@/components/design/DocParts";

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
const RADII: [string, string, string][] = [
  ["6px", "Badge, tags, small chips", "rounded-[6px]"],
  ["8px", "Fit badge, compact controls", "rounded-[8px]"],
  ["10px", "Small button, icon button", "rounded-[10px]"],
  ["12px", "Inputs, selection tiles, medium button (--radius-control)", "rounded-[var(--radius-control)]"],
  ["14px", "Callouts, large button", "rounded-[14px]"],
  ["18px", "Card face", "rounded-[18px]"],
  ["20px", "Cards and panels (--radius-card)", "rounded-[var(--radius-card)]"],
  ["22px", "Modal", "rounded-[22px]"],
];

const SHADOWS: [string, string, string][] = [
  ["--shadow-card", "Resting card or panel", "shadow-[var(--shadow-card)]"],
  ["--shadow-card-hover", "Hovered or highlighted card", "shadow-[var(--shadow-card-hover)]"],
  ["--shadow-popover", "Modal, dropdown, toast", "shadow-[var(--shadow-popover)]"],
  ["--shadow-inset", "Inputs, search field", "shadow-[var(--shadow-inset)]"],
];

export default function SpacePage() {
  return (
    <DocPage
      title="Space & elevation"
      lead="A 4px grid, a short radius ladder, four shadows, and a fixed set of layers. Nothing here is decorative; each step has a job."
      source="src/app/globals.css"
    >
      <DocSection kicker="Spacing" title="4px grid" description="Layout uses Tailwind’s 4px scale. These are the steps that carry most of the product.">
        <Specimen>
          <div className="space-y-2.5">
            {SPACING.map((px) => (
              <div key={px} className="flex items-center gap-4">
                <span className="figure w-16 text-[12px] text-[var(--color-ink-soft)]">
                  {px}px
                </span>
                <span className="h-4 rounded-[3px] bg-[var(--color-mint)]" style={{ width: px }} />
                <span className="font-mono text-[11px] text-[var(--color-ink-faint)]">{px / 4}</span>
              </div>
            ))}
          </div>
        </Specimen>
        <DataTable
          head={["Context", "Spacing"]}
          rows={[
            ["Card and panel padding", <Code key="a">p-5 · sm:p-6 (20 / 24px)</Code>],
            ["Gap between cards", <Code key="b">gap-4 (16px)</Code>],
            ["Gap between page sections", <Code key="c">space-y-10 (40px)</Code>],
            ["Control height", <Code key="d">h-8 / h-10 / h-12 · inputs h-11</Code>],
          ]}
        />
      </DocSection>

      <DocSection id="radius" kicker="Radius" title="The radius ladder" description="Two radii are named tokens. The rest are literal values on specific components. Bigger surfaces get bigger radii.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {RADII.map(([r, use, cls]) => (
            <div key={r} className="space-y-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
              <div className={`h-16 w-full border-[1.5px] border-[var(--color-ink)] bg-[var(--color-bg-subtle)] ${cls}`} />
              <div>
                <p className="figure text-[14px] font-semibold text-[var(--color-ink)]">{r}</p>
                <p className="text-[12px] leading-snug text-[var(--color-ink-faint)]">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="elevation" kicker="Elevation" title="Shadows" description="Light mode uses soft, green-tinted shadows. Dark mode swaps them for deeper blacks with a faint top highlight.">
        <div className="grid gap-4 sm:grid-cols-2">
          {SHADOWS.map(([token, use, cls]) => (
            <div key={token} className="rounded-[var(--radius-card)] bg-[var(--color-canvas)] p-6">
              <div className={`flex h-24 items-center justify-center rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] ${cls}`}>
                <span className="text-[13px] font-medium text-[var(--color-ink-soft)]">{use}</span>
              </div>
              <p className="mt-3 font-code text-[11.5px] text-[var(--color-ink)]">{token}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="layers" kicker="Layers" title="z-index" description="A fixed ladder, so overlays never fight. Reach for an existing layer before inventing a new one.">
        <DataTable
          head={["Layer", "z-index", "Component"]}
          rows={[
            ["Sticky headers", <Code key="a">z-20 · z-30</Code>, "Onboarding header, app top bar, landing header, design library header"],
            ["Persistent chrome", <Code key="b">z-40</Code>, "Mobile bottom tab bar, floating advisor button"],
            ["Local overlays", <Code key="g">z-50</Code>, "Tooltip, mobile “More” sheet"],
            ["Modal", <Code key="c">z-[100]</Code>, "Modal and its backdrop"],
            ["Cookie notice", <Code key="d">z-[150]</Code>, "Consent banner"],
            ["Toast", <Code key="e">z-[200]</Code>, "Notifications stay above modals"],
            ["Skip link", <Code key="f">z-[300]</Code>, "Always on top when focused"],
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
