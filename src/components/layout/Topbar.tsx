"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Moon, Sun, ChevronDown, LogOut, Check, Settings2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/useTheme";
import { DEMO_PERSONAS } from "@/data/personas";
import { buildNotifications } from "@/lib/engine/notifications";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { demoProfilesEnabled } from "@/lib/flags";
import { pageTitleFor } from "@/lib/nav";
import { Logo } from "@/components/brand/Logo";

const NOTIF_DOT: Record<string, string> = {
  info: "bg-[var(--color-teal-vivid)]",
  warning: "bg-[var(--color-gold-vivid)]",
  success: "bg-[var(--color-mint)]",
};

const iconBtn =
  "relative flex h-9 w-9 items-center justify-center rounded-[10px] text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]";

function initials(name: string | undefined) {
  if (!name) return "·";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Topbar() {
  const profile = useAppStore((s) => s.profile);
  const loadPersona = useAppStore((s) => s.loadPersona);
  const { theme, toggle } = useTheme();
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const accountRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAccountOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const notifications = profile ? buildNotifications(profile) : [];
  const showDemos = demoProfilesEnabled();
  const title = pageTitleFor(pathname);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    useAppStore.getState().clearSession();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-canvas)_82%,transparent)] px-4 backdrop-blur-xl lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/dashboard" className="lg:hidden" aria-label="Overview">
          <Logo size={28} />
        </Link>
        {title && (
          <p className="hidden truncate text-[13.5px] font-medium text-[var(--color-ink-soft)] lg:block">
            <span className="text-[var(--color-ink-faint)]">Workspace</span>
            <span className="mx-2 text-[var(--color-border-strong)]">/</span>
            <span className="text-[var(--color-ink)]">{title}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button onClick={toggle} className={iconBtn} aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}>
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className={iconBtn}
            aria-label={`Notifications${notifications.length ? ` (${notifications.length})` : ""}`}
            aria-expanded={notifOpen}
          >
            <Bell size={17} />
            {notifications.length > 0 && (
              <span className="figure absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-coral-vivid)] px-1 text-[9.5px] font-semibold text-white ring-2 ring-[var(--color-canvas)]">
                {notifications.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="animate-rise absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-popover)]">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                <p className="text-[13px] font-semibold">Notifications</p>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">In-app only</span>
              </div>
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-[13px] text-[var(--color-ink-faint)]">You&rsquo;re all caught up.</p>
              ) : (
                <ul className="max-h-80 divide-y divide-[var(--color-border)] overflow-y-auto">
                  {notifications.map((n) => (
                    <li key={n.id} className="flex gap-3 px-4 py-3">
                      <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", NOTIF_DOT[n.tone])} />
                      <div>
                        <p className="text-[13px] font-medium text-[var(--color-ink)]">{n.title}</p>
                        <p className="mt-0.5 text-[12.5px] leading-snug text-[var(--color-ink-soft)]">{n.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="relative ml-1" ref={accountRef}>
          <button
            onClick={() => setAccountOpen((v) => !v)}
            aria-expanded={accountOpen}
            aria-label="Account menu"
            className="flex items-center gap-2 rounded-[12px] py-1 pl-1 pr-2 transition-colors hover:bg-[var(--color-bg-subtle)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[linear-gradient(135deg,var(--color-mint),var(--color-teal-vivid))] text-[11px] font-bold text-[#03261a]">
              {initials(profile?.name)}
            </span>
            <span className="hidden max-w-[9rem] truncate text-[13px] font-medium text-[var(--color-ink)] sm:block">{profile?.name || "Account"}</span>
            <ChevronDown size={14} className="text-[var(--color-ink-faint)]" />
          </button>
          {accountOpen && (
            <div className="animate-rise absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-[var(--shadow-popover)]">
              {showDemos && (
                <>
                  <p className="px-2.5 pb-1.5 pt-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                    Demo profiles
                  </p>
                  {DEMO_PERSONAS.map((p) => {
                    const current = profile?.name === p.name;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          void loadPersona(p.id).then(() => {
                            setAccountOpen(false);
                            router.push("/dashboard");
                          });
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-[9px] px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-[var(--color-bg-subtle)]",
                          current ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]"
                        )}
                      >
                        {p.name}
                        {current && <Check size={14} className="text-[var(--color-accent)]" />}
                      </button>
                    );
                  })}
                  <div className="my-1.5 h-px bg-[var(--color-border)]" />
                </>
              )}
              <Link
                href="/settings"
                onClick={() => setAccountOpen(false)}
                className="flex w-full items-center gap-2 rounded-[9px] px-2.5 py-2 text-[13px] text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
              >
                <Settings2 size={14} />
                Settings
              </Link>
              <button
                onClick={() => {
                  setAccountOpen(false);
                  void signOut();
                }}
                className="flex w-full items-center gap-2 rounded-[9px] px-2.5 py-2 text-left text-[13px] text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
