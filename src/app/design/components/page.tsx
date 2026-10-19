import { DocPage, DocSection, Specimen, DataTable, Code } from "@/components/design/DocParts";
import { FormsDemo, FeedbackDemo } from "@/components/design/ComponentDemos";
import { Badge } from "@/components/ui/Badge";
import { FitBadge } from "@/components/cards/FitBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Disclaimer, HardInquiryWarning } from "@/components/ui/Disclaimer";
import { CircularScore } from "@/components/ui/CircularScore";
import { MeterBar } from "@/components/ui/MeterBar";
import { FactorStrip, ScoreBreakdownPanel } from "@/components/cards/ScoreBreakdownPanel";
import { ReasonList } from "@/components/cards/ReasonList";
import type { FitLabel } from "@/lib/types";

const TONES = ["neutral", "accent", "success", "warning", "danger", "teal", "indigo", "ink"] as const;
const FITS: FitLabel[] = ["strong_fit", "consider", "wait", "not_recommended_now"];
const SAMPLE = { goalAlignment: 23, creditProfileFit: 14, spendingMatch: 15, issuerRelationship: 5, portfolioCompatibility: 10, timing: 6, annualFeeFit: 5, total: 78 };

export default function ComponentsPage() {
  return (
    <DocPage title="Components" lead="Forms, feedback, and the components that show a score. Every example is the production component, wired to real state where it has any." source="src/components/ui/* · src/components/cards/*">
      <DocSection kicker="Forms" title="Inputs and selection" description="Inputs are 44px tall with an inset shadow, and focus draws a mint border and a soft ring. Selection tiles are buttons with radio and checkbox roles.">
        <Specimen>
          <FormsDemo />
        </Specimen>
        <DataTable
          head={["Component", "Notes"]}
          rows={[
            [<Code key="a">TextField</Code>, "Label, hint, and an optional prefix. Always labelled; the label is linked by id."],
            [<Code key="b">Slider</Code>, "Shows the current value in a mono chip. Use for approximate quantities where precision would be false."],
            [<Code key="c">TagInput</Code>, "Enter or comma to add, the × on a tag removes it, and blur commits."],
            [<Code key="d">RadioCardGroup</Code>, <>One choice, <Code>role=&quot;radiogroup&quot;</Code>. 1 to 3 columns.</>],
            [<Code key="e">CheckboxCardGroup</Code>, "Several choices. Selected state is a mint border, a tint, and a check."],
          ]}
        />
      </DocSection>

      <DocSection id="badges" kicker="Status" title="Badges and fit labels" description="Badges are square-cornered tags, not pills, so status reads as data. The fit badge adds a four-bar signal.">
        <Specimen>
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <Badge key={t} tone={t}>
                  {t}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {FITS.map((f) => (
                <FitBadge key={f} fitLabel={f} />
              ))}
            </div>
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="feedback" kicker="Feedback" title="Toast, modal, tooltip" description="Toasts confirm and never block. Modals trap focus, close on Escape, and return focus to the trigger. Tooltips explain a term, never carry essential content.">
        <Specimen>
          <FeedbackDemo />
        </Specimen>
      </DocSection>

      <DocSection id="notices" kicker="Compliance" title="Disclaimer and hard-inquiry warning" description="These two are required surfaces, not optional decoration. The disclaimer sits on every screen that recommends a card; the warning sits before every outbound issuer link.">
        <Specimen>
          <div className="space-y-4">
            <Disclaimer />
            <HardInquiryWarning />
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="scores" kicker="Data" title="Score components" description="Four ways to show a number, from one value to a full breakdown.">
        <Specimen title="Dial · meter · factor strip">
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <CircularScore value={72} size={128} sublabel="Readiness" threshold={72} />
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[12.5px] font-medium text-[var(--color-ink-soft)]">Utilization · segmented meter</p>
                <MeterBar value={82} tone="teal" ariaLabel="Utilization example" />
              </div>
              <div className="space-y-2">
                <p className="text-[12.5px] font-medium text-[var(--color-ink-soft)]">Fit score · factor strip</p>
                <FactorStrip score={SAMPLE} height={12} />
              </div>
            </div>
          </div>
        </Specimen>
        <Specimen title="Full breakdown and reason ledger">
          <div className="grid gap-8 md:grid-cols-2">
            <ScoreBreakdownPanel score={SAMPLE} />
            <div className="space-y-3">
              <p className="text-[12.5px] font-medium text-[var(--color-ink-soft)]">Reason ledger</p>
              <ReasonList
                reasons={["Fits your current credit profile", "Matches your actual spending habits", "Aligns with your stated goals"]}
                cautions={["Recent credit activity may affect approval odds right now"]}
              />
            </div>
          </div>
        </Specimen>
      </DocSection>

      <DocSection id="loading" kicker="Loading" title="Skeleton" description="A pulsing block in the shape of the content to come. The app’s full-screen loading state uses the logo mark with a sliding bar.">
        <Specimen>
          <div className="max-w-sm space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Specimen>
      </DocSection>
    </DocPage>
  );
}
