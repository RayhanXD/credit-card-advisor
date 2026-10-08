"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { NAV_GROUPS, isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Logo } from "@/components/brand/Logo";
import { buildCreditHealthSnapshot } from "@/lib/engine/creditHealth";
import { CircularScore } from "@/components/ui/CircularScore";

export function Sidebar() {
  const pathname = usePathname();
  const profile = useAppStore((s) => s.profile);
  const health = profile ? buildCreditHealthSnapshot(profile) : null;

  return (
    <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] lg:flex">
      <div className="px-5 pb-6 pt-6">
        <Link href="/dashboard" aria-label="Overview">
          <Logo />
        </Link>
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-6 overflow-y-auto px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-[10px] px-3 py-2 text-[13.5px] font-medium transition-colors",
                        active
                          ? "bg-[var(--color-bg-subtle)] text-[var(--color-ink)]"
                          : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--color-mint)] transition-opacity",
                          active ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Icon
                        size={17}
                        strokeWidth={active ? 2.2 : 1.8}
                        className={cn(active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-faint)] group-hover:text-[var(--color-ink-soft)]")}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {profile && health && (
        <Link
          href="/credit-health"
          className="group mx-3 mb-4 flex items-center gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg)] p-3 transition-colors hover:border-[var(--color-border-strong)]"
        >
          <CircularScore value={health.overallScore} size={44} tone={health.overallScore >= 70 ? "success" : "warning"} />
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-[var(--color-ink)]">{profile.name || "Your profile"}</span>
            <span className="flex items-center gap-1 text-[11.5px] text-[var(--color-ink-faint)]">
              <CalendarClock size={11} />
              Next review {new Date(profile.nextReviewDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          </span>
        </Link>
      )}
    </aside>
  );
}
