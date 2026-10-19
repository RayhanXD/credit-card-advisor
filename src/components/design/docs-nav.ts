export interface DocItem {
  href: string;
  label: string;
  blurb: string;
  keywords?: string;
}

export interface DocGroup {
  label: string;
  items: DocItem[];
}

export const DESIGN_VERSION = "1.0";

export const DOC_GROUPS: DocGroup[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/design/foundations",
        label: "Foundations",
        blurb: "Principles, source map, theming, and known gaps.",
        keywords: "principles theme dark light tokens source gaps",
      },
    ],
  },
  {
    label: "Tokens",
    items: [
      { href: "/design/colors", label: "Colors", blurb: "Surfaces, ink, brand mint, data hues, semantic and series colors.", keywords: "mint gold teal coral indigo palette hex" },
      { href: "/design/typography", label: "Typography", blurb: "Manrope, Inter, and the type scale.", keywords: "font display mono figure scale heading" },
      { href: "/design/motion", label: "Motion", blurb: "Easing, durations, and replayable entrance and data animations.", keywords: "animation easing duration reduced motion" },
      { href: "/design/space", label: "Space & elevation", blurb: "Spacing, radius ladder, shadows, and z-index layers.", keywords: "spacing radius shadow elevation z-index" },
      { href: "/design/motifs", label: "Motifs", blurb: "Logo mark, kicker, ledger grid, hatch, dial, route line.", keywords: "logo grid hatch kicker dial signal route" },
    ],
  },
  {
    label: "UI",
    items: [
      { href: "/design/buttons", label: "Buttons", blurb: "Variants, sizes, icons, and disabled state.", keywords: "cta primary secondary ghost danger mint" },
      { href: "/design/cards", label: "Cards", blurb: "Panels, stat cards, recommendation cards, card faces, selection tiles.", keywords: "panel stat recommendation card face tile empty" },
      { href: "/design/components", label: "Components", blurb: "Forms, feedback, and score and data components.", keywords: "input slider tag badge toast modal tooltip skeleton meter dial" },
    ],
  },
  {
    label: "Patterns",
    items: [
      { href: "/design/patterns", label: "Screen patterns", blurb: "Marketing, auth, onboarding, app shell, strategy, and card finder.", keywords: "layout screen shell onboarding dashboard journey" },
    ],
  },
  {
    label: "Guidance",
    items: [
      { href: "/design/voice", label: "Voice", blurb: "Tone, vocabulary, microcopy, and what we never say.", keywords: "copy tone words guarantee approval" },
      { href: "/design/accessibility", label: "Accessibility", blurb: "Live contrast checks, focus, keyboard, motion, and open gaps.", keywords: "wcag contrast focus keyboard aria touch target" },
    ],
  },
];

export const DOC_ITEMS = DOC_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })));
