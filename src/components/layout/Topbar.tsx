"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Moon, Sun, ChevronDown, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/useTheme";
import { DEMO_PERSONAS } from "@/data/personas";
import { buildNotifications } from "@/lib/engine/notifications";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function Topbar() {
  const profile = useAppStore((s) => s.profile);
  const loadPersona = useAppStore((s) => s.loadPersona);
  const { theme, toggle } = useTheme();
  const [personaOpen, setPersonaOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();
  const personaRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) setPersonaOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const notifications = profile ? buildNotifications(profile) : [];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)]">
          <Sparkles size={14} />
        </div>
        <span className="text-[14px] font-semibold">Strata</span>
      </div>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <div className="relative" ref={personaRef}>
          <button
            onClick={() => setPersonaOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
          >
            {profile?.name || "Demo profile"}
            <ChevronDown size={14} />
          </button>
          {personaOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-[var(--shadow-popover)]">
              <p className="px-2.5 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">
                Switch demo profile
              </p>
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    loadPersona(p.id);
                    setPersonaOpen(false);
                    router.push("/dashboard");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] hover:bg-[var(--color-bg-subtle)]",
                    profile?.id === p.id && "bg-[var(--color-bg-subtle)] font-medium"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 shadow-[var(--shadow-popover)]">
              <p className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">
                Notifications
              </p>
              {notifications.length === 0 ? (
                <p className="px-2.5 py-4 text-center text-[13px] text-[var(--color-ink-faint)]">You&rsquo;re all caught up.</p>
              ) : (
                <div className="max-h-80 space-y-1 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="rounded-lg px-2.5 py-2 hover:bg-[var(--color-bg-subtle)]">
                      <p className="text-[13px] font-medium text-[var(--color-ink)]">{n.title}</p>
                      <p className="mt-0.5 text-[12px] text-[var(--color-ink-soft)]">{n.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </div>
    </header>
  );
}
