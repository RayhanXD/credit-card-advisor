"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "accent" | "success" | "warning" | "danger" | "teal" | "indigo";

const TONE_VAR: Record<Tone, string> = {
  accent: "var(--color-mint)",
  success: "var(--color-mint)",
  warning: "var(--color-gold-vivid)",
  danger: "var(--color-coral-vivid)",
  teal: "var(--color-teal-vivid)",
  indigo: "var(--color-indigo-vivid)",
};

// A 270° dial with tick marks. Optional `threshold` draws a notch on the
// track (e.g. the 72% "well-positioned" line for readiness).
export function CircularScore({
  value,
  max = 100,
  size = 120,
  strokeWidth,
  label,
  sublabel,
  tone = "accent",
  threshold,
  className,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  tone?: Tone;
  threshold?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplay(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const sw = strokeWidth ?? Math.max(5, Math.round(size / 13));
  const r = (size - sw) / 2 - (size >= 80 ? 6 : 1);
  const cx = size / 2;
  const sweep = 270;
  const arcLen = (2 * Math.PI * r * sweep) / 360;
  const circumference = 2 * Math.PI * r;
  const fraction = Math.max(0, Math.min(1, display / max));
  const showTicks = size >= 80;

  const angleFor = (frac: number) => ((135 + frac * sweep) * Math.PI) / 180;
  // Rounded so server- and client-rendered SVG coordinates match exactly.
  const pt = (a: number, radius: number, axis: "x" | "y") =>
    Math.round((cx + (axis === "x" ? Math.cos(a) : Math.sin(a)) * radius) * 100) / 100;
  const ticks = showTicks ? Array.from({ length: 28 }, (_, i) => i / 27) : [];

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={sublabel ?? "Score"}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {ticks.map((t) => {
          const a = angleFor(t);
          const r1 = r + sw / 2 + 3;
          const r2 = r1 + (Math.round(t * 27) % 9 === 0 ? 4 : 2);
          return (
            <line
              key={t}
              x1={pt(a, r1, "x")}
              y1={pt(a, r1, "y")}
              x2={pt(a, r2, "x")}
              y2={pt(a, r2, "y")}
              stroke="var(--color-border-strong)"
              strokeWidth={1}
              strokeLinecap="round"
            />
          );
        })}
        <g transform={`rotate(135 ${cx} ${cx})`}>
          <circle
            cx={cx}
            cy={cx}
            r={r}
            stroke="var(--color-bg-subtle)"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circumference}`}
          />
          <circle
            cx={cx}
            cy={cx}
            r={r}
            stroke={TONE_VAR[tone]}
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${arcLen * fraction} ${circumference}`}
            style={{ transition: "stroke-dasharray 1000ms cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </g>
        {threshold !== undefined && (
          (() => {
            const a = angleFor(threshold / max);
            const r1 = r - sw / 2 - 2;
            const r2 = r + sw / 2 + 2;
            return (
              <line
                x1={pt(a, r1, "x")}
                y1={pt(a, r1, "y")}
                x2={pt(a, r2, "x")}
                y2={pt(a, r2, "y")}
                stroke="var(--color-ink)"
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })()
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="figure font-semibold leading-none text-[var(--color-ink)]"
          style={{ fontSize: Math.max(13, Math.round(size * 0.26)) }}
        >
          {label ?? Math.round(value)}
        </span>
        {sublabel && size >= 80 && (
          <span className="mt-1 max-w-[70%] text-[10.5px] leading-tight text-[var(--color-ink-faint)]">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
