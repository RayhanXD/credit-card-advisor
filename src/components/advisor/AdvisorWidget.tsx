"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestion, X } from "lucide-react";
import { ChatPanel } from "@/components/advisor/ChatPanel";

export function AdvisorWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 flex h-[520px] w-96 flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-popover)]"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[14px] font-semibold">Card Advisor</span>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-[var(--color-ink-faint)] hover:bg-[var(--color-bg-subtle)]">
                <X size={16} />
              </button>
            </div>
            <ChatPanel compact />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] shadow-[var(--shadow-popover)] transition-transform hover:scale-105"
        style={{ height: 52, width: 52 }}
        aria-label="Open Card Advisor"
      >
        {open ? <X size={20} /> : <MessageCircleQuestion size={20} />}
      </button>
    </div>
  );
}
