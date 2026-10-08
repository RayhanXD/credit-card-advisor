"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  show: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const ICONS: Record<ToastTone, ReactNode> = {
  success: <CircleCheck size={17} className="text-[var(--color-mint)]" />,
  info: <Info size={17} className="text-[var(--color-teal-vivid)]" />,
  warning: <TriangleAlert size={17} className="text-[var(--color-gold-vivid)]" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-4 right-4 z-[200] flex flex-col items-center gap-2 lg:bottom-6 lg:left-auto lg:right-24 lg:items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-[14px] bg-[var(--color-ink)] py-3 pl-4 pr-3 text-[var(--color-bg-elevated)] shadow-[var(--shadow-popover)]"
              )}
            >
              {ICONS[t.tone]}
              <span className="text-[13px] font-medium">{t.message}</span>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="ml-1 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
