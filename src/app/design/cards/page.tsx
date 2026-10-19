import { WalletCards, Plus } from "lucide-react";
import { DocPage, DocSection, Specimen, DataTable, Code, DoDont } from "@/components/design/DocParts";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/Panel";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { CardFace } from "@/components/cards/CreditCardTile";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { CircularScore } from "@/components/ui/CircularScore";
import { getCard } from "@/data/cards";
import { getPersona } from "@/data/personas";
import { scoreCard } from "@/lib/engine/scoring";

export default function CardsPage() {
  const jordan = getPersona("persona_jordan");
  const savor = getCard("capital_one_savorone");
  const venture = getCard("capital_one_venture_x");
  const recSavor = jordan && savor ? scoreCard(savor, jordan) : null;
  const recVenture = jordan && venture ? scoreCard(venture, jordan) : null;

  return (
    <DocPage title="Cards" lead="Four kinds of surface: the plain panel, the stat card, the recommendation card, and the card face. Surfaces are white on a tinted canvas with a hairline border and a soft shadow." source="src/components/ui/Panel.tsx · src/components/cards/*">
      <DocSection kicker="Surface" title="Panel" description="The base surface. Everything else is a panel with opinions.">
        <Specimen code={`<Panel>\n  <PanelHeader>…</PanelHeader>\n  <PanelBody>…</PanelBody>\n</Panel>`} codeLabel="tsx">
          <Panel className="max-w-md">
            <PanelHeader>
              <div>
                <p className="font-display text-[17px] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">Your wallet</p>
                <p className="text-[12.5px] text-[var(--color-ink-faint)]">3 cards, $420 in annual fees</p>
              </div>
            </PanelHeader>
            <PanelBody className="pt-4 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">Panels use a 20px radius, a hairline border, and the card shadow. Padding is 20px, 24px from the small breakpoint up.</PanelBody>
          </Panel>
        </Specimen>
      </DocSection>

      <DocSection id="stat" kicker="Summary" title="Stat card" description="A mono label, one display-set value, and a supporting line. An optional accent bar on top ties it to a data hue.">
        <Specimen code={`<StatCard label="Next step" value="Capital One SavorOne" sub="No annual fee" accent="var(--color-mint)" />`} codeLabel="tsx">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Next step" value="Capital One SavorOne" sub="No annual fee" accent="var(--color-mint)" />
            <StatCard label="Wallet value" value="$338/yr" sub="Estimated rewards" accent="var(--color-gold-vivid)" />
            <StatCard label="Credit health">
              <CircularScore value={56} size={88} tone="warning" />
            </StatCard>
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="recommendation" kicker="Core" title="Recommendation card" description="The product’s signature surface. It always shows the fit label, the factor strip, a two-sided reason ledger, and a way to open the full score. This one is rendered from real engine output for the student demo profile.">
        <div className="grid gap-4 lg:grid-cols-2">
          {recSavor && <RecommendationCard recommendation={recSavor} highlight layout="compact" />}
          {recVenture && <RecommendationCard recommendation={recVenture} layout="compact" />}
        </div>
        <DataTable
          head={["Prop", "Values", "Effect"]}
          rows={[
            [<Code key="a">layout</Code>, <Code key="a2">full · compact</Code>, "Full adds a card face beside the title. Compact is for grids."],
            [<Code key="b">highlight</Code>, <Code key="b2">boolean</Code>, "Mint-tinted border and a gradient bar on top. Use for the single best recommendation."],
            [<Code key="c">recommendation</Code>, <Code key="c2">CardRecommendation</Code>, "Always engine output. Never hand-written copy."],
          ]}
        />
      </DocSection>

      <DocSection id="face" kicker="Card" title="Card face" description="Scales with its container using container query units, so one component serves a 48px thumbnail and a hero.">
        <Specimen>
          <div className="flex flex-wrap items-end gap-6">
            {venture && <CardFace card={venture} className="w-72" />}
            {savor && <CardFace card={savor} className="w-44" />}
            {venture && <CardFace card={venture} size="sm" className="w-16" />}
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="empty" kicker="Empty" title="Empty state" description="Say what is missing, why it matters, and the one thing to do. The grid canvas keeps it from looking broken.">
        <Specimen>
          <EmptyState
            icon={<WalletCards size={22} />}
            title="No cards yet"
            description="Add the cards you already have so every recommendation accounts for them."
            action={<Button icon={<Plus size={16} />}>Add your first card</Button>}
          />
        </Specimen>
      </DocSection>

      <DocSection id="rules" kicker="Rules" title="Using surfaces">
        <DoDont
          doItems={["One highlighted recommendation per screen.", "Keep numbers in a stat card to one display-set value.", "Always route a recommendation card’s numbers through the engine."]}
          dontItems={["Nest a panel inside a panel with the same border.", "Put two accent bars on one card.", "Show a fit score without the way to open its breakdown."]}
        />
      </DocSection>
    </DocPage>
  );
}
