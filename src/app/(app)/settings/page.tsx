"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
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
import { Moon, Sun, Trash2, AlertTriangle } from "lucide-react";

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
  const [notifPrefs, setNotifPrefs] = useState({
    renewals: true,
    readiness: true,
    utilization: true,
    reviews: true,
  });

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">Manage your profile, preferences, and data.</p>
      </div>

      <SettingsSection title="Profile">
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

      <SettingsSection title="Appearance">
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[13.5px] font-medium",
              theme === "light" ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]" : "border-[var(--color-border)]"
            )}
          >
            <Sun size={15} /> Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[13.5px] font-medium",
              theme === "dark" ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]" : "border-[var(--color-border)]"
            )}
          >
            <Moon size={15} /> Dark
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications">
        {[
          { key: "renewals" as const, label: "Annual fee renewals", desc: "Reminders before a card's fee posts" },
          { key: "readiness" as const, label: "Readiness changes", desc: "When your target-card readiness shifts meaningfully" },
          { key: "utilization" as const, label: "Utilization alerts", desc: "When reported utilization looks elevated" },
          { key: "reviews" as const, label: "Strategy reviews", desc: "Reminders on your recommended review dates" },
        ].map((n) => (
          <label key={n.key} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] px-4 py-3">
            <span>
              <span className="block text-[13.5px] font-medium text-[var(--color-ink)]">{n.label}</span>
              <span className="block text-[12px] text-[var(--color-ink-faint)]">{n.desc}</span>
            </span>
            <input
              type="checkbox"
              checked={notifPrefs[n.key]}
              onChange={() => setNotifPrefs((p) => ({ ...p, [n.key]: !p[n.key] }))}
              className="h-5 w-5 accent-[var(--color-ink)]"
            />
          </label>
        ))}
      </SettingsSection>

      <SettingsSection title="Demo Profiles">
        <div className="flex flex-wrap gap-2">
          {DEMO_PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                loadPersona(p.id);
                show(`Switched to ${p.name}`, "success");
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium",
                profile.id === p.id ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]" : "border-[var(--color-border)] text-[var(--color-ink-soft)]"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Data & Privacy">
        <p className="text-[13px] text-[var(--color-ink-soft)]">
          Your data is stored only in this browser for this prototype — nothing is sent to a server. You can clear it at any
          time.
        </p>
        <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setResetOpen(true)}>
          Reset my data
        </Button>
        <p className="text-[12px] text-[var(--color-ink-faint)]">
          Want your account and data fully deleted instead of just cleared from this browser? Email{" "}
          <span className="font-mono">[YOUR EMAIL]</span> and we&rsquo;ll process the request within 30 days.
        </p>
      </SettingsSection>

      <SettingsSection title="Legal">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
          <Link href="/privacy" target="_blank" className="text-[var(--color-accent)] hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" target="_blank" className="text-[var(--color-accent)] hover:underline">
            Terms of Service
          </Link>
          <Link href="/cookies" target="_blank" className="text-[var(--color-accent)] hover:underline">
            Cookie Policy
          </Link>
          <Link href="/refund-policy" target="_blank" className="text-[var(--color-accent)] hover:underline">
            Refund Policy
          </Link>
        </div>
      </SettingsSection>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset all data?">
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-xl bg-[var(--color-danger-soft)] p-3.5 text-[13px] text-[var(--color-danger)]">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            This clears your profile, cards, and goals from this browser. This can&rsquo;t be undone.
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                resetProfile();
                router.push("/onboarding");
              }}
            >
              Reset everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
      <h2 className="text-[14px] font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
