"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { rankEcosystems } from "@/lib/engine/ecosystem";
import { TRANSFER_PARTNERS } from "@/data/transferPartners";
import { ISSUERS } from "@/data/issuers";
import { EmptyState } from "@/components/ui/EmptyState";
import { Kicker, PageHeader, SectionHeading } from "@/components/ui/Panel";
import { Plane, Hotel, ArrowRight, Star, PlaneTakeoff, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransferPartner } from "@/lib/types";

const CURRENCY: Record<string, { label: string; color: string }> = {
  chase_ur: { label: "Chase UR", color: "var(--series-4)" },
  amex_mr: { label: "Amex MR", color: "var(--series-2)" },
  capital_one_miles: { label: "Capital One", color: "var(--series-5)" },
  citi_thankyou: { label: "Citi TY", color: "var(--series-6)" },
};

const QUICK_QUESTIONS = [
  "Which cards transfer to United?",
  "Which cards transfer to Air Canada?",
  "What's the best way to use my points for a trip to Japan?",
];

export default function TravelRewardsPage() {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return null;

  const ecosystems = rankEcosystems(profile).filter((e) => e.score > 0);
  const top = ecosystems[0];
  const maxScore = Math.max(1, ...ecosystems.map((e) => e.score));
  const airlines = TRANSFER_PARTNERS.filter((p) => p.type === "airline");
  const hotels = TRANSFER_PARTNERS.filter((p) => p.type === "hotel");
  const favorites = [...profile.travel.favoriteAirlines, ...profile.travel.favoriteHotels].map((f) => f.toLowerCase());
  const isFavorite = (p: TransferPartner) => favorites.some((f) => p.name.toLowerCase().includes(f) || f.includes(p.name.toLowerCase()));

  return (
    <div className="space-y-10">
      <PageHeader kicker="Points & partners" kickerTone="teal" title="Travel Rewards" description="Your strongest ecosystem, every transfer partner, and how to use them." />

      {/* Boarding-pass style travel profile */}
      <section className="relative grid overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)] md:grid-cols-[1fr_auto_260px]">
        <div className="p-5 sm:p-6">
          <Kicker tone="teal">Your travel profile</Kicker>
          <div className="mt-4 flex items-center gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Home</p>
              <p className="figure text-[34px] font-semibold leading-none tracking-[0.02em] text-[var(--color-ink)]">
                {profile.travel.homeAirport?.toUpperCase() || "———"}
              </p>
            </div>
            <div className="flex flex-1 items-center gap-2 text-[var(--color-ink-faint)]">
              <span className="h-px flex-1 bg-[repeating-linear-gradient(90deg,var(--color-border-strong)_0_4px,transparent_4px_8px)]" />
              <PlaneTakeoff size={18} className="text-[var(--color-teal-vivid)]" />
              <span className="h-px flex-1 bg-[repeating-linear-gradient(90deg,var(--color-border-strong)_0_4px,transparent_4px_8px)]" />
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Scope</p>
              <p className="text-[15px] font-semibold capitalize text-[var(--color-ink)]">{profile.travel.scope.replace(/_/g, " ")}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <Field label="Frequency" value={profile.travel.travelFrequency.replace(/_/g, " ")} />
            <Field label="Cabin" value={profile.travel.cabinPreference.replace(/_/g, " ")} />
          </div>
        </div>
        {/* perforation */}
        <div className="relative hidden w-0 md:block">
          <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-canvas)]" />
          <span className="absolute inset-y-4 left-0 border-l-2 border-dashed border-[var(--color-border)]" />
          <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-canvas)]" />
        </div>
        <div className="border-t border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-6 md:border-t-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Favorites</p>
          {favorites.length === 0 ? (
            <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-ink-faint)]">
              None yet. Add favorite airlines and hotels in onboarding to match partners.
            </p>
          ) : (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {profile.travel.favoriteAirlines.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-[7px] bg-[var(--color-teal-soft)] px-2 py-1 text-[12px] font-medium text-[var(--color-teal)]">
                  <Plane size={11} /> {f}
                </span>
              ))}
              {profile.travel.favoriteHotels.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-[7px] bg-[var(--color-indigo-soft)] px-2 py-1 text-[12px] font-medium text-[var(--color-indigo)]">
                  <Hotel size={11} /> {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ecosystem ranking */}
      <section className="space-y-4">
        <SectionHeading kicker="Ranked" title="Your ecosystems" />
        {top ? (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_srgb,var(--color-mint)_55%,var(--color-border))] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-card)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-mint)_24%,transparent),transparent_70%)]" />
              <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--color-accent-soft)] px-2 py-0.5 text-[11.5px] font-semibold text-[var(--color-accent)]">
                <Star size={11} fill="currentColor" /> Strongest ecosystem
              </span>
              <p className="mt-3 font-display text-[28px] font-semibold tracking-[-0.025em] text-[var(--color-ink)]">{top.issuerName}</p>
              <ul className="mt-3 space-y-2">
                {top.reasons.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[13.5px] leading-snug text-[var(--color-ink-soft)]">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-mint)]" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)]">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Relative strength</p>
              <ol className="space-y-3">
                {ecosystems.slice(0, 5).map((e, i) => (
                  <li key={e.issuerId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className={cn("font-medium", i === 0 ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]")}>
                        <span className="figure mr-2 text-[var(--color-ink-faint)]">{i + 1}</span>
                        {e.issuerName}
                      </span>
                    </div>
                    <span className="block h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${(e.score / maxScore) * 100}%`,
                          background: ISSUERS.find((iss) => iss.id === e.issuerId)?.accentColor ?? "var(--color-mint)",
                        }}
                      />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<Compass size={22} />}
            title="No ecosystem yet"
            description="Add favorite airlines or hotels, or a travel card, to see which points ecosystem fits you best."
          />
        )}
      </section>

      <PartnerGrid title="Airline partners" icon={<Plane size={15} />} partners={airlines} isFavorite={isFavorite} />
      <PartnerGrid title="Hotel partners" icon={<Hotel size={15} />} partners={hotels} isFavorite={isFavorite} />

      <section className="space-y-4">
        <SectionHeading kicker="Card Advisor" title="Ask about your points" />
        <div className="grid gap-2 md:grid-cols-3">
          {QUICK_QUESTIONS.map((q) => (
            <Link
              key={q}
              href={`/advisor?q=${encodeURIComponent(q)}`}
              className="group flex items-center justify-between gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3.5 text-[13px] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-mint)] hover:text-[var(--color-ink)]"
            >
              {q}
              <ArrowRight size={14} className="shrink-0 text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function PartnerGrid({
  title,
  icon,
  partners,
  isFavorite,
}: {
  title: string;
  icon: React.ReactNode;
  partners: TransferPartner[];
  isFavorite: (p: TransferPartner) => boolean;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="flex items-center gap-2 font-display text-[19px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          <span className="text-[var(--color-ink-faint)]">{icon}</span>
          {title}
        </h2>
        <span className="hidden items-center gap-3 sm:flex">
          {Object.values(CURRENCY).map((c) => (
            <span key={c.label} className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-faint)]">
              <span className="h-2 w-2 rounded-[2px]" style={{ background: c.color }} />
              {c.label}
            </span>
          ))}
        </span>
      </div>
      <div className="grid overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-border)] [gap:1px] sm:grid-cols-2">
        {partners.map((p) => {
          const fav = isFavorite(p);
          return (
            <div key={p.id} className={cn("flex items-center justify-between gap-3 px-4 py-3", fav ? "bg-[var(--color-accent-soft)]" : "bg-[var(--color-bg-elevated)]")}>
              <span className="flex items-center gap-2 text-[13.5px] font-medium text-[var(--color-ink)]">
                {fav && <Star size={12} className="text-[var(--color-accent)]" fill="currentColor" />}
                {p.name}
              </span>
              <span className="flex gap-1">
                {p.transfersFrom.map((f) => {
                  const c = CURRENCY[f.rewardsCurrency];
                  return (
                    <span
                      key={f.rewardsCurrency}
                      className="inline-flex items-center gap-1 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--color-ink-soft)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-[2px]" style={{ background: c?.color ?? "var(--color-ink-faint)" }} />
                      {c?.label ?? f.rewardsCurrency}
                    </span>
                  );
                })}
              </span>
            </div>
          );
        })}
        {partners.length % 2 === 1 && <div className="hidden bg-[var(--color-bg-elevated)] sm:block" />}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{label}</p>
      <p className="mt-0.5 text-[14px] font-semibold capitalize text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
