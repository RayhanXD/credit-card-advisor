"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { brandName } from "@/lib/site";
import { PageHeader } from "@/components/ui/Panel";
import { useTheme } from "@/lib/useTheme";
import { DEMO_PERSONAS } from "@/data/personas";
import { TextField } from "@/components/ui/TextField";
import { Slider } from "@/components/ui/Slider";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, cn } from "@/lib/utils";
import type { AnnualFeeTolerance } from "@/lib/types";
import { DEFAULT_NOTIFICATION_PREFS } from "@/lib/types";
import { demoProfilesEnabled } from "@/lib/flags";
import { Moon, Sun, Trash2, TriangleAlert, UserX, Check } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { deleteAccountAction } from "@/lib/auth/actions";

const FEE_OPTIONS: { value: AnnualFeeTolerance; label: string; description: string }[] = [
  { value: "none", label: "$0 only", description: "No annual fee cards" },
  { value: "low", label: "Under $100", description: "Modest fees are fine" },
  { value: "moderate", label: "Under $400", description: "If the value is there" },
  { value: "high", label: "$400+", description: "Premium cards welcome" },
];

export default function SettingsPage() {
  const profile = useAppStore((s) => s.profile);
  const loadPersona = useAppStore((s) => s.loadPersona);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const resetProfile = useAppStore((s) => s.resetProfile);
  const { theme, setTheme } = useTheme();
  const { show } = useToast();
  const router = useRouter();
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (!profile) return null;

  const notifPrefs = profile.notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader kicker="Account" kickerTone="ink" title="Settings" description="Manage your profile, preferences, and data." actions={<SignOutButton />} />

      <SettingsSection title="Profile" description="Changes here re-score every recommendation instantly.">
        <TextField label="Name" value={profile.name} onChange={(e) => updateProfile((p) => ({ ...p, name: e.target.value }))} />
        <Slider
          label="Approximate annual income"
          min={0}
          max={300000}
          step={1000}
          value={profile.financial.annualIncome}
          onChange={(v) => updateProfile((p) => ({ ...p, financial: { ...p.financial, annualIncome: v } }))}
          formatValue={(v) => formatCurrency(v)}
        />
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-[var(--color-ink)]">Annual fee tolerance</p>
          <RadioCardGroup
            columns={2}
            options={FEE_OPTIONS}
            value={profile.financial.annualFeeTolerance}
            onChange={(v) => updateProfile((p) => ({ ...p, financial: { ...p.financial, annualFeeTolerance: v } }))}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Appearance" description="Saved on this device.">
        <div className="grid grid-cols-2 gap-3">
          {(["light", "dark"] as const).map((mode) => {
            const active = theme === mode;
            const Icon = mode === "light" ? Sun : Moon;
            return (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                aria-pressed={active}
                className={cn(
                  "group overflow-hidden rounded-[14px] border text-left transition-[border-color,box-shadow]",
                  active
                    ? "border-[var(--color-mint)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mint)_18%,transparent)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                )}
              >
                <span className={cn("block h-20 p-2.5", mode === "light" ? "bg-[#f4f6f5]" : "bg-[#06100c]")}>
                  <span className={cn("flex h-full gap-1.5 rounded-[8px] p-1.5", mode === "light" ? "bg-white" : "bg-[#0c1813]")}>
                    <span className={cn("w-6 rounded-[4px]", mode === "light" ? "bg-[#edf1ef]" : "bg-[#12211a]")} />
                    <span className="flex flex-1 flex-col gap-1">
                      <span className={cn("h-2 w-2/3 rounded-full", mode === "light" ? "bg-[#0b1a14]" : "bg-[#eef5f1]")} />
                      <span className="h-1.5 w-1/2 rounded-full bg-[#12c27e]" />
                      <span className={cn("mt-auto h-3 rounded-[3px]", mode === "light" ? "bg-[#edf1ef]" : "bg-[#12211a]")} />
                    </span>
                  </span>
                </span>
                <span className="flex items-center justify-between px-3 py-2.5">
                  <span className="flex items-center gap-2 text-[13px] font-medium capitalize text-[var(--color-ink)]">
                    <Icon size={14} /> {mode}
                  </span>
                  {active && <Check size={14} className="text-[var(--color-accent)]" />}
                </span>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection divided title="Notifications" description="Shown in the app. Email and push delivery are coming later.">
        {[
          { key: "renewals" as const, label: "Annual fee renewals", desc: "Reminders before a card's fee posts" },
          { key: "readiness" as const, label: "Readiness changes", desc: "When your target-card readiness shifts meaningfully" },
          { key: "utilization" as const, label: "Utilization alerts", desc: "When reported utilization looks elevated" },
          { key: "reviews" as const, label: "Strategy reviews", desc: "Reminders on your recommended review dates" },
        ].map((n) => (
          <div key={n.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <span>
              <span className="block text-[13.5px] font-medium text-[var(--color-ink)]">{n.label}</span>
              <span className="block text-[12px] text-[var(--color-ink-faint)]">{n.desc}</span>
            </span>
            <Switch
              label={n.label}
              checked={notifPrefs[n.key]}
              onChange={() =>
                updateProfile((p) => {
                  const current = p.notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS;
                  return { ...p, notificationPrefs: { ...current, [n.key]: !current[n.key] } };
                })
              }
            />
          </div>
        ))}
      </SettingsSection>

      {demoProfilesEnabled() && (
      <SettingsSection title="Demo profiles" description="Switch to a sample persona to explore the product.">
        <div className="flex flex-wrap gap-2">
          {DEMO_PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                loadPersona(p.id);
                show(`Switched to ${p.name}`, "success");
              }}
              className={cn(
                "rounded-[9px] border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                profile.name === p.name
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg-elevated)]"
                  : "border-[var(--color-border)] text-[var(--color-ink-soft)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </SettingsSection>
      )}

      <SettingsSection title="Data & privacy" tone="danger">
        <p className="text-[13px] text-[var(--color-ink-soft)]">
          Your strategy profile is stored in your {brandName} account. Appearance stays on this device. You can reset the profile
          or delete the account at any time.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={<Trash2 size={15} />} onClick={() => setResetOpen(true)}>
            Reset my data
          </Button>
          <Button
            variant="danger"
            icon={<UserX size={15} />}
            onClick={() => {
              setDeleteError(null);
              setDeleteOpen(true);
            }}
          >
            Delete account
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Legal">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium">
          <Link href="/privacy" target="_blank" className="text-[var(--color-ink-soft)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
            Privacy Policy
          </Link>
          <Link href="/terms" target="_blank" className="text-[var(--color-ink-soft)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
            Terms of Service
          </Link>
          <Link href="/cookies" target="_blank" className="text-[var(--color-ink-soft)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
            Cookie Policy
          </Link>
          <Link href="/refund-policy" target="_blank" className="text-[var(--color-ink-soft)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
            Refund Policy
          </Link>
        </div>
      </SettingsSection>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset all data?">
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-[12px] bg-[var(--color-danger-soft)] p-3.5 text-[13px] leading-relaxed text-[var(--color-danger)]">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            This clears your saved profile, cards, and goals. Your account stays signed in and you&rsquo;ll go through onboarding again. This can&rsquo;t be undone.
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={async () => {
                await resetProfile();
                router.push("/onboarding");
              }}
            >
              Reset everything
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete your account?">
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-[12px] bg-[var(--color-danger-soft)] p-3.5 text-[13px] leading-relaxed text-[var(--color-danger)]">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            This permanently deletes your {brandName} account and saved profile. This can&rsquo;t be undone.
          </div>
          {deleteError && (
            <p role="alert" className="text-[13px] text-[var(--color-danger)]">
              {deleteError}
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                setDeleteError(null);
                const result = await deleteAccountAction();
                if (result?.error) {
                  setDeleteError(result.error);
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Deleting…" : "Delete account"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  tone,
  divided,
  children,
}: {
  title: string;
  description?: string;
  tone?: "danger";
  divided?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "grid gap-5 rounded-[var(--radius-card)] border bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)] sm:grid-cols-[200px_1fr] sm:p-6",
        tone === "danger" ? "border-[color-mix(in_srgb,var(--color-coral-vivid)_35%,var(--color-border))]" : "border-[var(--color-border)]"
      )}
    >
      <div className="space-y-1">
        <h2 className={cn("text-[14px] font-semibold", tone === "danger" ? "text-[var(--color-danger)]" : "text-[var(--color-ink)]")}>{title}</h2>
        {description && <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-faint)]">{description}</p>}
      </div>
      <div className={cn("min-w-0 space-y-4", divided && "space-y-0 divide-y divide-[var(--color-border)]")}>{children}</div>
    </section>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-[var(--color-mint)]" : "bg-[var(--color-border-strong)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
