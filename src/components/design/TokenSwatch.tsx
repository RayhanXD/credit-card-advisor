"use client";

import { useToast } from "@/components/ui/Toast";
import { resolveColor, toHex } from "@/lib/design/color";
import { useIsClient, useThemeAttr } from "@/components/design/theme-hooks";

export function TokenSwatch({ token, role }: { token: string; role: string }) {
  const theme = useThemeAttr();
  const client = useIsClient();
  const { show } = useToast();
  const rgb = client ? resolveColor(token) : null;
  const hex = rgb ? toHex(rgb) : "";

  async function copy() {
    const value = `var(${token})`;
    try {
      await navigator.clipboard.writeText(value);
      show(`Copied ${value}`, "success");
    } catch {
      show("Copy failed", "warning");
    }
  }

  return (
    <button
      onClick={copy}
      data-theme-key={theme}
      className="group flex w-full items-stretch gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-left shadow-[var(--shadow-card)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[var(--color-border-strong)]"
    >
      <span
        className="h-14 w-14 shrink-0 rounded-[10px] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-ink)_12%,transparent)]"
        style={{ background: `var(${token})` }}
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-col justify-center gap-0.5">
        <span className="truncate font-code text-[12px] font-medium text-[var(--color-ink)]">{token}</span>
        <span className="figure text-[11.5px] uppercase text-[var(--color-ink-soft)]">{hex || "—"}</span>
        <span className="truncate text-[11.5px] text-[var(--color-ink-faint)]">{role}</span>
      </span>
    </button>
  );
}
