"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useTheme } from "@/lib/useTheme";
import { DESIGN_VERSION, DOC_GROUPS, DOC_ITEMS } from "@/components/design/docs-nav";
import { SearchPalette } from "@/components/design/SearchPalette";
import { cn } from "@/lib/utils";

function DocNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Design library" className="space-y-6">
      {DOC_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block rounded-[10px] px-3 py-2 text-[13.5px] font-medium transition-colors",
                      active
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[var(--color-mint)]" />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/design";
  const { theme, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const isHome = pathname === "/design";

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const index = DOC_ITEMS.findIndex((i) => i.href === pathname);
  const prev = index > 0 ? DOC_ITEMS[index - 1] : null;
  const next = index >= 0 && index < DOC_ITEMS.length - 1 ? DOC_ITEMS[index + 1] : null;

  return (
    <div className="min-h-dvh bg-[var(--color-canvas)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-canvas)_85%,transparent)] backdrop-blur-xl">
        <div className="flex h-[57px] items-center gap-3 px-4 lg:px-6">
          {!isHome && (
            <button
              onClick={() => setNavOpen((v) => !v)}
              aria-label={navOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={navOpen}
              className="rounded-[10px] p-2 text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)] lg:hidden"
            >
              {navOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
          <Link href="/design" aria-label="Design library home" className="flex shrink-0 items-center gap-3">
            <Logo size={26} />
            <span className="hidden border-l border-[var(--color-border-strong)] pl-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] sm:block">
              Design library
            </span>
          </Link>
          <button
            onClick={() => setSearchOpen(true)}
            className="mx-auto hidden h-9 w-full max-w-md items-center gap-2.5 rounded-[11px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 text-[13px] text-[var(--color-ink-faint)] shadow-[var(--shadow-inset)] transition-colors hover:border-[var(--color-border-strong)] md:flex"
          >
            <Search size={14} />
            <span className="flex-1 text-left">Search documentation…</span>
            <kbd className="rounded-[5px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-1.5 py-0.5 font-mono text-[10.5px]">⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search documentation"
              className="rounded-[10px] p-2 text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)] md:hidden"
            >
              <Search size={17} />
            </button>
            <Link
              href="/"
              className="hidden rounded-[10px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink-faint)] sm:block"
            >
              App home
            </Link>
            <button
              onClick={toggle}
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              className="rounded-[10px] p-2 text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]"
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <span className="rounded-[7px] border border-[var(--color-border)] px-2 py-1 font-mono text-[10.5px] text-[var(--color-ink-faint)]">v{DESIGN_VERSION}</span>
          </div>
        </div>
        {navOpen && !isHome && (
          <div className="max-h-[70dvh] overflow-y-auto border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 lg:hidden">
            <DocNav pathname={pathname} onNavigate={() => setNavOpen(false)} />
          </div>
        )}
      </header>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

      {isHome ? (
        <main id="main-content">{children}</main>
      ) : (
        <div className="mx-auto flex max-w-[1280px]">
          <aside className="sticky top-[57px] hidden h-[calc(100dvh-57px)] w-[248px] shrink-0 overflow-y-auto border-r border-[var(--color-border)] px-3 py-8 lg:block">
            <DocNav pathname={pathname} />
          </aside>
          <main id="main-content" className="min-w-0 flex-1 px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-4xl space-y-16">
              {children}
              <footer className="grid gap-3 border-t border-[var(--color-border)] pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link href={prev.href} className="group rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 transition-colors hover:border-[var(--color-border-strong)]">
                    <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                      <ArrowLeft size={12} /> Previous
                    </span>
                    <span className="mt-1 block text-[14px] font-semibold text-[var(--color-ink)]">{prev.label}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link href={next.href} className="group rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-right transition-colors hover:border-[var(--color-border-strong)]">
                    <span className="flex items-center justify-end gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                      Next <ArrowRight size={12} />
                    </span>
                    <span className="mt-1 block text-[14px] font-semibold text-[var(--color-ink)]">{next.label}</span>
                  </Link>
                )}
              </footer>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
