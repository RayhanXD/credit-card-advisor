"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const profile = useAppStore((s) => s.profile);

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)]">
          <Sparkles size={16} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight">Strata</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                active
                  ? "bg-[var(--color-ink)] text-[var(--color-bg)]"
                  : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
              )}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {profile && (
        <div className="mx-3 mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-3">
          <p className="text-[12px] font-medium text-[var(--color-ink)]">{profile.name || "Your profile"}</p>
          <p className="mt-0.5 text-[11px] text-[var(--color-ink-faint)]">
            Next review: {new Date(profile.nextReviewDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
        </div>
      )}
    </aside>
  );
}
