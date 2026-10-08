"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MOBILE_MORE, MOBILE_PRIMARY, isActivePath } from "@/lib/nav";

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MOBILE_MORE.some((l) => isActivePath(pathname, l.href));

  const tabClass = (active: boolean) =>
    cn(
      "relative flex flex-1 flex-col items-center gap-1 pb-2 pt-2.5 text-[10.5px] font-medium transition-colors",
      active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-faint)]"
    );

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg-elevated)_92%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        {MOBILE_PRIMARY.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={tabClass(active)}>
              {active && <span className="absolute top-0 h-[3px] w-8 rounded-b-full bg-[var(--color-mint)]" />}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} className={active ? "text-[var(--color-accent)]" : undefined} />
              {item.label}
            </Link>
          );
        })}
        <button onClick={() => setMoreOpen(true)} className={tabClass(moreActive)} aria-haspopup="dialog">
          {moreActive && <span className="absolute top-0 h-[3px] w-8 rounded-b-full bg-[var(--color-mint)]" />}
          <Menu size={20} strokeWidth={moreActive ? 2.2 : 1.8} className={moreActive ? "text-[var(--color-accent)]" : undefined} />
          More
        </button>
      </nav>

      <AnimatePresence>
        {moreOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="More pages">
            <motion.div
              className="absolute inset-0 bg-[rgba(6,16,12,0.45)] backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="absolute inset-x-0 bottom-0 rounded-t-[24px] border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-2"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--color-border-strong)]" />
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="font-display text-[16px] font-semibold">More</span>
                <button onClick={() => setMoreOpen(false)} aria-label="Close menu" className="rounded-[10px] p-1.5 hover:bg-[var(--color-bg-subtle)]">
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {MOBILE_MORE.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-[14px] border px-3.5 py-3.5 text-[13px] font-medium transition-colors",
                        active
                          ? "border-[var(--color-mint)] bg-[var(--color-accent-soft)] text-[var(--color-ink)]"
                          : "border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
                      )}
                    >
                      <Icon size={17} className={active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-faint)]"} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
