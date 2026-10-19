"use client";

import { contrastRatio, resolveColor, wcagGrade } from "@/lib/design/color";
import { useIsClient, useThemeAttr } from "@/components/design/theme-hooks";
import { cn } from "@/lib/utils";

export interface ContrastPair {
  fg: string;
  bg: string;
  use: string;
  // Minimum the pairing must meet for its intended use.
  need: 4.5 | 3;
}

const GRADE_STYLE: Record<string, string> = {
  AAA: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  AA: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  "Large only": "bg-[var(--color-gold-soft)] text-[var(--color-gold)]",
  Fail: "bg-[var(--color-coral-soft)] text-[var(--color-coral)]",
};

// Ratios are measured in the browser from the live computed token values, so
// the table is correct for whichever theme is active.
export function ContrastTable({ pairs }: { pairs: ContrastPair[] }) {
  const theme = useThemeAttr();
  const client = useIsClient();

  return (
    <div data-theme-key={theme} className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
      <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            {["Sample", "Pairing", "Used for", "Ratio", "Needs", "Result"].map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {pairs.map((p) => {
            const fg = client ? resolveColor(p.fg) : null;
            const bg = client ? resolveColor(p.bg) : null;
            const ratio = fg && bg ? contrastRatio(fg, bg) : null;
            const grade = ratio ? wcagGrade(ratio) : null;
            const passes = ratio ? ratio >= p.need : false;
            return (
              <tr key={`${p.fg}-${p.bg}`}>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex h-9 w-14 items-center justify-center rounded-[8px] text-[14px] font-semibold ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-ink)_10%,transparent)]"
                    style={{ color: p.fg.startsWith("#") ? p.fg : `var(${p.fg})`, background: p.bg.startsWith("#") ? p.bg : `var(${p.bg})` }}
                  >
                    Aa
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[11.5px] leading-snug text-[var(--color-ink-soft)]">
                  {p.fg.replace("--color-", "")}
                  <br />
                  <span className="text-[var(--color-ink-faint)]">on {p.bg.replace("--color-", "")}</span>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-soft)]">{p.use}</td>
                <td className="figure px-4 py-3 font-medium text-[var(--color-ink)]">{ratio ? `${ratio.toFixed(2)}:1` : "—"}</td>
                <td className="figure px-4 py-3 text-[var(--color-ink-faint)]">{p.need}:1</td>
                <td className="px-4 py-3">
                  {grade && (
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className={cn("rounded-[5px] px-1.5 py-0.5 text-[11px] font-semibold", GRADE_STYLE[grade])}>{grade}</span>
                      <span className={cn("text-[11.5px] font-medium", passes ? "text-[var(--color-accent)]" : "text-[var(--color-coral)]")}>
                        {passes ? "meets need" : "below need"}
                      </span>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
