import { DocPage, DocSection, DataTable, Code, DoDont, Callout } from "@/components/design/DocParts";
import { CodeBlock } from "@/components/design/CodeBlock";
import { MotionDemos } from "@/components/design/MotionDemos";

export default function MotionPage() {
  return (
    <DocPage
      title="Motion"
      lead="One easing curve for everything, short durations for UI, and longer ones where a number is being revealed. Motion explains change; it never decorates."
      source="src/app/globals.css · framer-motion in components"
    >
      <DocSection kicker="Live" title="Replay the recipes" description="Each card re-mounts its component, so you see exactly what a user sees on first render.">
        <MotionDemos />
      </DocSection>

      <DocSection id="tokens" kicker="Values" title="Easing and duration">
        <DataTable
          head={["Name", "Value", "Used for"]}
          rows={[
            ["Ease (the only curve)", <Code key="e">cubic-bezier(0.22, 1, 0.36, 1)</Code>, "Every transition and entrance. A fast start that settles gently."],
            ["Micro", <Code key="m">120–200ms</Code>, "Button press, hover color, slider thumb, modal in/out (180ms)"],
            ["Standard", <Code key="s">280–520ms</Code>, "Disclosure open (280ms), page rise (520ms), onboarding progress (400ms)"],
            ["Reveal", <Code key="r">700–1000ms</Code>, "Factor strip (700ms), score dial (1000ms). Slower because the user is reading a result."],
            ["Stagger", <Code key="t">18–50ms per item</Code>, "Meter segments (18ms), factor strip slots (50ms)"],
            ["Ambient", <Code key="a">2200ms loop</Code>, "Pulse ring on the current journey step only"],
          ]}
        />
      </DocSection>

      <DocSection id="recipes" kicker="Recipes" title="Copy these">
        <CodeBlock
          label="framer-motion"
          code={`// Disclosure (RecommendationCard)
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
/>

// Dialog (Modal)
initial={{ opacity: 0, y: 12, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}`}
        />
        <CodeBlock
          label="css"
          code={`.animate-rise { animation: rise 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }
/* from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } */`}
        />
      </DocSection>

      <DocSection id="reduced" kicker="Reduced motion" title="Honoring the preference" description="A single media query at the document level collapses every animation and transition to effectively zero, so no component has to opt in.">
        <CodeBlock
          label="css"
          code={`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  html { scroll-behavior: auto; }
}`}
        />
        <Callout title="What this means for you">
          Because reduced motion removes the duration but not the end state, every animation must still land on a meaningful final frame. Never rely on an animation to carry information on its own.
        </Callout>
      </DocSection>

      <DocSection id="rules" kicker="Rules" title="When to move">
        <DoDont
          doItems={[
            <>Animate <Code>transform</Code> and <Code>opacity</Code> where you can.</>,
            "Stagger a set of related items so the eye can follow the fill.",
            "Reveal results slowly (700ms and up), and respond to input fast (under 200ms).",
          ]}
          dontItems={[
            "Loop an animation on anything but the current step.",
            "Add a second easing curve. If the standard one feels wrong, change the duration.",
            "Animate layout properties on large lists.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
