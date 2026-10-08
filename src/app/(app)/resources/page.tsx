import Link from "next/link";
import { ISSUERS } from "@/data/issuers";
import { CREDIT_BUREAUS, OTHER_RESOURCES } from "@/data/contacts";
import { ArrowUpRight, Phone, Info } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/Panel";

const BUREAU_COLORS = ["var(--color-mint)", "var(--color-teal-vivid)", "var(--color-indigo-vivid)"];

export default function ResourcesPage() {
  return (
    <div className="space-y-10">
      <PageHeader kicker="Need help?" kickerTone="indigo" title="Resources" description="Official contact information for credit bureaus and card issuers." />

      <div className="flex items-start gap-3 rounded-[14px] border border-dashed border-[var(--color-border-strong)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">
        <Info size={15} className="mt-0.5 shrink-0 text-[var(--color-ink-faint)]" />
        Phone numbers and links reflect commonly published general-support contacts. Always confirm on the official site before
        sharing sensitive information.
      </div>

      <section className="space-y-4">
        <SectionHeading kicker="3 bureaus" title="Credit bureaus" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CREDIT_BUREAUS.map((b, i) => (
            <a
              key={b.name}
              href={b.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="absolute inset-x-0 top-0 h-1" style={{ background: BUREAU_COLORS[i % BUREAU_COLORS.length] }} />
              <div className="flex items-start justify-between">
                <p className="font-display text-[18px] font-semibold tracking-[-0.02em]">{b.name}</p>
                <ArrowUpRight size={16} className="text-[var(--color-ink-faint)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              {b.customerService && (
                <p className="figure mt-3 flex items-center gap-1.5 text-[13px] text-[var(--color-ink-soft)]">
                  <Phone size={13} /> {b.customerService}
                </p>
              )}
              <p className="mt-1 text-[12px] text-[var(--color-ink-faint)]">Official site</p>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading kicker={`${ISSUERS.length} issuers`} title="Card issuers" />
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
          <div className="hidden grid-cols-[1.3fr_1fr_1fr_auto] gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-2.5 sm:grid">
            {["Issuer", "Customer service", "Lost / stolen", ""].map((h) => (
              <span key={h} className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                {h}
              </span>
            ))}
          </div>
          <ul className="divide-y divide-[var(--color-border)]">
            {ISSUERS.map((issuer) => (
              <li key={issuer.id} className="grid grid-cols-1 gap-1.5 px-5 py-3.5 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-center sm:gap-4">
                <span className="flex items-center gap-2.5 text-[14px] font-semibold">
                  <span className="h-3 w-3 rounded-[4px]" style={{ background: issuer.accentColor }} />
                  {issuer.name}
                </span>
                <span className="figure text-[13px] text-[var(--color-ink-soft)]">
                  <span className="text-[var(--color-ink-faint)] sm:hidden">Service: </span>
                  {issuer.contact.customerService}
                </span>
                <span className="figure text-[13px] text-[var(--color-ink-soft)]">
                  <span className="text-[var(--color-ink-faint)] sm:hidden">Lost/stolen: </span>
                  {issuer.contact.lostStolen}
                </span>
                <a
                  href={issuer.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--color-accent)] hover:text-[var(--color-ink)]"
                >
                  Site <ArrowUpRight size={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading title="Other resources" />
          <div className="space-y-2">
            {OTHER_RESOURCES.map((r) => (
              <a
                key={r.name}
                href={r.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3.5 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <span className="text-[13.5px] font-medium text-[var(--color-ink)]">{r.name}</span>
                <ArrowUpRight size={14} className="text-[var(--color-ink-faint)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <SectionHeading title="Legal" />
          <div className="grid grid-cols-2 gap-2">
            {[
              ["/privacy", "Privacy Policy"],
              ["/terms", "Terms of Service"],
              ["/cookies", "Cookie Policy"],
              ["/refund-policy", "Refund Policy"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3.5 text-[13px] font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
