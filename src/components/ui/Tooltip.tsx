"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tooltip({ content, children, className }: { content: ReactNode; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-64 -translate-x-1/2 rounded-[10px] bg-[var(--color-ink)] px-3 py-2 text-[12px] leading-snug text-[var(--color-bg-elevated)] shadow-[var(--shadow-popover)]"
        >
          {content}
        </span>
      )}
    </span>
  );
}
