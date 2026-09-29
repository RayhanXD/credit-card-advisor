"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { rankEcosystems } from "@/lib/engine/ecosystem";
import { TRANSFER_PARTNERS } from "@/data/transferPartners";
import { Badge } from "@/components/ui/Badge";
import { Plane, Hotel, MessageCircleQuestion } from "lucide-react";

const CURRENCY_LABEL: Record<string, string> = {
  chase_ur: "Chase UR",
  amex_mr: "Amex MR",
  capital_one_miles: "Capital One Miles",
  citi_thankyou: "Citi TY",
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
  const airlines = TRANSFER_PARTNERS.filter((p) => p.type === "airline");
  const hotels = TRANSFER_PARTNERS.filter((p) => p.type === "hotel");
  const favorites = [...profile.travel.favoriteAirlines, ...profile.travel.favoriteHotels].map((f) => f.toLowerCase());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Travel Rewards</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">Your ecosystem, transfer partners, and how to use them.</p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">Your travel profile</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Home airport" value={profile.travel.homeAirport || "—"} />
          <Field label="Frequency" value={profile.travel.travelFrequency.replace(/_/g, " ")} />
          <Field label="Scope" value={profile.travel.scope.replace(/_/g, " ")} />
          <Field label="Cabin" value={profile.travel.cabinPreference.replace(/_/g, " ")} />
        </div>
        {(profile.travel.favoriteAirlines.length > 0 || profile.travel.favoriteHotels.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[...profile.travel.favoriteAirlines, ...profile.travel.favoriteHotels].map((f) => (
              <Badge key={f} tone="accent">
                {f}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {top ? (
        <div className="rounded-2xl border border-[var(--color-ink)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-card-hover)]">
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-accent)]">Your strongest ecosystem</p>
          <p className="mt-1 text-[22px] font-semibold">{top.issuerName}</p>
          <ul className="mt-3 space-y-1.5">
            {top.reasons.map((r) => (
              <li key={r} className="text-[13.5px] text-[var(--color-ink-soft)]">
                · {r}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] p-6 text-center">
          <p className="text-[13.5px] text-[var(--color-ink-soft)]">
            Add favorite airlines/hotels or a travel card to see your strongest ecosystem.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Plane size={16} className="text-[var(--color-ink-faint)]" />
          <h2 className="text-[16px] font-semibold">Airline Partners</h2>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {airlines.map((p) => {
            const isFavorite = favorites.some((f) => p.name.toLowerCase().includes(f) || f.includes(p.name.toLowerCase()));
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between rounded-xl border p-3.5 ${isFavorite ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]" : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"}`}
              >
                <span className="text-[13.5px] font-medium">{p.name}</span>
                <div className="flex gap-1">
                  {p.transfersFrom.map((f) => (
                    <span key={f.rewardsCurrency} className="rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--color-ink-soft)]">
                      {CURRENCY_LABEL[f.rewardsCurrency] ?? f.rewardsCurrency}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Hotel size={16} className="text-[var(--color-ink-faint)]" />
          <h2 className="text-[16px] font-semibold">Hotel Partners</h2>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {hotels.map((p) => {
            const isFavorite = favorites.some((f) => p.name.toLowerCase().includes(f) || f.includes(p.name.toLowerCase()));
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between rounded-xl border p-3.5 ${isFavorite ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]" : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"}`}
              >
                <span className="text-[13.5px] font-medium">{p.name}</span>
                <div className="flex gap-1">
                  {p.transfersFrom.map((f) => (
                    <span key={f.rewardsCurrency} className="rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--color-ink-soft)]">
                      {CURRENCY_LABEL[f.rewardsCurrency] ?? f.rewardsCurrency}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion size={16} className="text-[var(--color-ink-faint)]" />
          <h2 className="text-[16px] font-semibold">Ask Card Advisor</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <Link
              key={q}
              href={`/advisor?q=${encodeURIComponent(q)}`}
              className="rounded-full border border-[var(--color-border)] px-3.5 py-2 text-[13px] text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
            >
              {q}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">{label}</p>
      <p className="text-[13.5px] font-medium capitalize text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
