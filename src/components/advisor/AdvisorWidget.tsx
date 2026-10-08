"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessagesSquare, X } from "lucide-react";
import { ChatPanel } from "@/components/advisor/ChatPanel";

export function AdvisorWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The dedicated page already shows the full chat.
  if (pathname?.startsWith("/advisor")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
            role="dialog"
            aria-label="Card Advisor"
            className="absolute bottom-16 right-0 flex h-[560px] w-[400px] flex-col overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-popover)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--color-ink)] text-[var(--color-mint)]">
                  <MessagesSquare size={15} />
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold leading-tight">Card Advisor</p>
                  <p className="text-[11px] text-[var(--color-ink-faint)]">Answers from your profile and our card data</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Card Advisor"
                className="rounded-[9px] p-1.5 text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="min-h-0 flex-1 p-4">
              <ChatPanel compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex h-[52px] items-center gap-2 rounded-full bg-[var(--color-ink)] pl-4 pr-5 text-[13.5px] font-semibold text-[var(--color-bg-elevated)] shadow-[var(--shadow-popover)] transition-transform duration-200 hover:-translate-y-0.5"
        aria-label={open ? "Close Card Advisor" : "Open Card Advisor"}
        aria-expanded={open}
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          {!open && <span className="absolute inset-0 rounded-full bg-[var(--color-mint)] opacity-30 transition-transform group-hover:scale-110" />}
          {open ? <X size={18} /> : <MessagesSquare size={16} className="relative text-[var(--color-mint)]" />}
        </span>
        {open ? "Close" : "Ask Advisor"}
      </button>
    </div>
  );
}
