import { brandName } from "@/lib/site";
import { cn } from "@/lib/utils";

// The mark is three ascending steps with a waypoint above the last one: the
// product's idea of "a path to the next card", independent of the final name.
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" fill="var(--logo-tile)" />
      <rect x="7" y="18" width="4.5" height="7" rx="1.6" fill="var(--color-mint)" opacity="0.45" />
      <rect x="13.75" y="14" width="4.5" height="11" rx="1.6" fill="var(--color-mint)" opacity="0.75" />
      <rect x="20.5" y="10" width="4.5" height="15" rx="1.6" fill="var(--color-mint)" />
      <circle cx="22.75" cy="6.25" r="1.75" fill="var(--color-gold-vivid)" />
    </svg>
  );
}

export function Logo({ size = 30, className, showName = true }: { size?: number; className?: string; showName?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showName && <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{brandName}</span>}
    </span>
  );
}
