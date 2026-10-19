import { DocPage, DocSection, DoDont, DataTable, Callout, Code } from "@/components/design/DocParts";
import { brandName } from "@/lib/site";

export default function VoicePage() {
  return (
    <DocPage
      title="Voice"
      lead={`Plain, specific, and honest about uncertainty, like a friend who knows credit and won’t oversell. ${brandName} gives guidance. It never gives a verdict, and it never makes a promise about what an issuer will do.`}
      source="Proposed standard · based on shipped product copy"
    >
      <DocSection kicker="Tone" title="Confident, never breathless">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { k: "Cadence", v: "Short sentences. One idea each. Numbers before adjectives." },
            { k: "Honesty", v: "Say “likely”, “worth”, “not yet”. Name what you don’t know." },
            { k: "CTAs", v: "Verb plus outcome. “Build my strategy”, not “Submit”." },
          ].map((c) => (
            <div key={c.k} className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)]">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{c.k}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink)]">{c.v}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="never" kicker="Hard rule" title="Words we never use about outcomes" description="Approval is the issuer’s decision. Copy must not imply otherwise, anywhere: product, marketing, notifications, or support.">
        <DataTable
          head={["Never say", "Say instead", "Why"]}
          rows={[
            ["You’ll be approved", "Your profile looks well-positioned for this card", "Positioning is ours to describe. Approval is not."],
            ["Guaranteed", "Likely to fit", "No guarantee exists. Even a negated “not guaranteed” should live in a disclaimer, not a headline."],
            ["Approval odds / chances", "Fit · Readiness", "Fit and readiness are internal measures, and the UI says so."],
            ["Best card", "Strongest fit for you", "“Best” is a claim about everyone. Fit is about one person."],
            ["Fix your credit · repair · boost your score", "Improve your profile · Here’s what typically helps", "Credit-repair language can trigger federal and state regulation. See the legal roadmap."],
            ["Free money · risk-free", "Estimated net value", "Rewards are estimates and fees are real."],
          ]}
        />
        <Callout title="Why this is a design rule and not just a legal one">
          The fastest way to lose trust in a financial product is one overconfident sentence. The product’s whole position is that it explains itself, which only works if it never claims more than it knows.
        </Callout>
      </DocSection>

      <DocSection id="vocabulary" kicker="Vocabulary" title="Words with a fixed meaning">
        <DataTable
          head={["Term", "Means", "Not"]}
          rows={[
            [<Code key="a">Fit</Code>, "How well a card matches your profile, 0 to 100, as the sum of seven weighted factors.", "A chance of approval."],
            [<Code key="b">Readiness</Code>, "How well-positioned you are for one specific target card, with a 72% “well-positioned” line.", "A prediction."],
            [<Code key="c">Strategy</Code>, "The ordered next steps toward your goals.", "A list of cards."],
            [<Code key="d">Journey</Code>, "The route to a target card, including the steps before it.", "A guarantee of reaching it."],
            [<Code key="e">Credit Health</Code>, "An educational composite of what you told us.", "Your FICO or VantageScore."],
            [<Code key="f">Est. value</Code>, "Rewards minus annual fee, at an assumed point value.", "What you will earn."],
          ]}
        />
      </DocSection>

      <DocSection id="microcopy" kicker="Microcopy" title="Prefer and avoid">
        <DoDont
          doTitle="Prefer"
          doItems={[
            <>“Not right now. Here’s what would change that.”</>,
            <>“This may trigger a hard inquiry. We never submit an application for you.”</>,
            <>“Why this recommendation?”</>,
            <>“Couldn’t save. Try again.” (what happened, then what to do)</>,
            <>“No cards yet. Add the ones you have so every recommendation accounts for them.”</>,
          ]}
          dontItems={[
            <>“You’re not eligible.” / “Denied.”</>,
            <>“Apply now!” with urgency or a countdown.</>,
            <>“Something went wrong.” with nothing after it.</>,
            <>“Oops!” or exclamation marks in errors.</>,
            <>“No data.” as an empty state.</>,
          ]}
        />
      </DocSection>

      <DocSection id="patterns" kicker="Patterns" title="Structures that repeat">
        <DataTable
          head={["Moment", "Shape", "Example"]}
          rows={[
            ["Recommendation", "Verdict, then reasons on both sides, then how to open the score.", "Strong fit · + Matches your spending · − Annual fee above your tolerance"],
            ["“Not yet”", "Say not yet, say why in one line, point to the next step.", "Not yet. Your account age is the main gap; SavorOne is the step that builds it."],
            ["Empty state", "What’s missing, why it helps, one action.", "No cards yet. Add your first card."],
            ["Error", "What happened, what to try. Never blame the reader.", "Couldn’t save. Try again."],
            ["Compliance note", "Plain, specific, near the thing it qualifies.", "Educational guidance, not a guarantee of approval."],
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
