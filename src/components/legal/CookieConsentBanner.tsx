"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "strata-cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private browsing, etc.) - skip the banner rather than error.
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "acknowledged");
    } catch {}
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          role="region"
          aria-label="Cookie notice"
          className="fixed inset-x-0 bottom-0 z-[150] border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4 shadow-[var(--shadow-popover)]"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-[12.5px] text-[var(--color-ink-soft)]">
              Strata uses local storage and essential cookies to keep you signed in and remember your preferences. See our{" "}
              <Link href="/cookies" className="font-medium text-[var(--color-accent)]">
                Cookie Policy
              </Link>
              .
            </p>
            <button
              onClick={dismiss}
              className="shrink-0 rounded-lg bg-[var(--color-ink)] px-4 py-2 text-[12.5px] font-medium text-[var(--color-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
