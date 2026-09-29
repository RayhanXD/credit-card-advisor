"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, WalletCards, Compass, MessageCircleQuestion, Menu, HeartPulse, Search, Plane, LifeBuoy, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const PRIMARY = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/strategy", label: "Strategy", icon: Compass },
  { href: "/cards", label: "Cards", icon: WalletCards },
  { href: "/advisor", label: "Advisor", icon: MessageCircleQuestion },
];

const MORE_LINKS = [
  { href: "/credit-health", label: "Credit Health", icon: HeartPulse },
  { href: "/card-finder", label: "Card Finder", icon: Search },
  { href: "/travel", label: "Travel Rewards", icon: Plane },
  { href: "/resources", label: "Resources", icon: LifeBuoy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MORE_LINKS.some((l) => pathname?.startsWith(l.href));

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden">
        {PRIMARY.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium",
                active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-faint)]"
              )}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium",
            moreActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-faint)]"
          )}
        >
          <Menu size={19} strokeWidth={moreActive ? 2.4 : 2} />
          More
        </button>
      </nav>

      <AnimatePresence>
        {moreOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[14px] font-semibold">More</span>
                <button onClick={() => setMoreOpen(false)} className="rounded-lg p-1.5 hover:bg-[var(--color-bg-subtle)]">
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {MORE_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] px-3.5 py-3 text-[13px] font-medium hover:bg-[var(--color-bg-subtle)]"
                    >
                      <Icon size={17} />
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
