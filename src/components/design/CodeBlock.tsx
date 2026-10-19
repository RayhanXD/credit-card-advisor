"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({ code, label, className }: { code: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  return (
    <div className={cn("overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-sunken)]", className)}>
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3.5 py-1.5">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{label ?? "code"}</span>
        <button
          onClick={copy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-[11.5px] font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
        >
          {copied ? <Check size={12} className="text-[var(--color-accent)]" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-code text-[12.5px] leading-relaxed text-[var(--color-ink)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
