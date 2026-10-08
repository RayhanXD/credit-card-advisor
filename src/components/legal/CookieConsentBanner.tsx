"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { brandName } from "@/lib/site";

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
          className="fixed bottom-4 left-4 right-4 z-[150] mx-auto max-w-xl rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-popover)] sm:left-6 sm:right-auto sm:mx-0"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-gold-soft)] text-[var(--color-gold)]">
              <Cookie size={15} />
            </span>
            <p className="flex-1 text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">
              {brandName} uses local storage and essential cookies to keep you signed in and remember your preferences. See our{" "}
              <Link href="/cookies" className="font-medium text-[var(--color-accent)]">
                Cookie Policy
              </Link>
              .
            </p>
            <button
              onClick={dismiss}
              className="shrink-0 rounded-[10px] bg-[var(--color-primary)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--color-primary-ink)] transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
