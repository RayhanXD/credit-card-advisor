"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CircularScore({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  tone = "accent",
  className,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  tone?: "accent" | "success" | "warning" | "danger";
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplay(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, display / max));
  const offset = circumference * (1 - fraction);

  const toneVar = {
    accent: "var(--color-accent)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
  }[tone];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--color-bg-subtle)" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={toneVar}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-semibold tabular-nums text-[var(--color-ink)]">{label ?? Math.round(value)}</span>
        {sublabel && <span className="text-[11px] text-[var(--color-ink-faint)]">{sublabel}</span>}
      </div>
    </div>
  );
}
