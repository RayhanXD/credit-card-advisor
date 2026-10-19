"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { DOC_ITEMS } from "@/components/design/docs-nav";
import { cn } from "@/lib/utils";

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DOC_ITEMS;
    return DOC_ITEMS.filter((i) => `${i.label} ${i.blurb} ${i.keywords ?? ""} ${i.group}`.toLowerCase().includes(q));
  }, [query]);

  const active = Math.min(cursor, Math.max(results.length - 1, 0));

  function go(href: string) {
    onClose();
    setQuery("");
    setCursor(0);
    router.push(href);
  }

  return (
    <Modal open={open} onClose={onClose} title="Search documentation">
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                go(results[active].href);
              }
            }}
            placeholder="Search tokens, components, voice…"
            aria-label="Search documentation"
            className="h-11 w-full rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] pl-10 pr-3 text-[14px] text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-mint)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mint)_20%,transparent)]"
          />
        </div>
        <ul role="listbox" aria-label="Results" className="max-h-80 space-y-1 overflow-y-auto">
          {results.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-[var(--color-ink-faint)]">No pages match &ldquo;{query}&rdquo;.</li>}
          {results.map((r, i) => (
            <li key={r.href} role="option" aria-selected={i === active}>
              <button
                onClick={() => go(r.href)}
                onMouseEnter={() => setCursor(i)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors",
                  i === active ? "bg-[var(--color-accent-soft)]" : "hover:bg-[var(--color-bg-subtle)]"
                )}
              >
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-semibold text-[var(--color-ink)]">{r.label}</span>
                  <span className="block truncate text-[12px] text-[var(--color-ink-faint)]">{r.blurb}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">{r.group}</span>
                  {i === active && <CornerDownLeft size={13} className="text-[var(--color-accent)]" />}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
