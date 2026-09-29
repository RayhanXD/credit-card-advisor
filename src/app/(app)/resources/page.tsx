import { ISSUERS } from "@/data/issuers";
import { CREDIT_BUREAUS, OTHER_RESOURCES } from "@/data/contacts";
import { ExternalLink, Phone, ShieldAlert } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Need Help?</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">Official contact information for bureaus and issuers.</p>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-[12.5px] text-[var(--color-ink-soft)]">
        <div className="flex items-start gap-2">
          <ShieldAlert size={15} className="mt-0.5 shrink-0 text-[var(--color-ink-faint)]" />
          Phone numbers and links below reflect commonly published general-support contacts. Always confirm on the official
          site before sharing sensitive information.
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[16px] font-semibold">Credit Bureaus</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CREDIT_BUREAUS.map((b) => (
            <div key={b.name} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
              <p className="text-[14.5px] font-semibold">{b.name}</p>
              {b.customerService && (
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[var(--color-ink-soft)]">
                  <Phone size={13} /> {b.customerService}
                </p>
              )}
              <a
                href={b.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-accent)]"
              >
                Official site <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[16px] font-semibold">Card Issuers</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ISSUERS.map((issuer) => (
            <div key={issuer.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
              <p className="text-[14.5px] font-semibold">{issuer.name}</p>
              <div className="mt-2 space-y-1 text-[13px] text-[var(--color-ink-soft)]">
                <p className="flex items-center gap-1.5">
                  <Phone size={13} /> Customer service: {issuer.contact.customerService}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone size={13} /> Lost/stolen: {issuer.contact.lostStolen}
                </p>
              </div>
              <a
                href={issuer.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-accent)]"
              >
                Official site <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[16px] font-semibold">Other Resources</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OTHER_RESOURCES.map((r) => (
            <a
              key={r.name}
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 hover:bg-[var(--color-bg-subtle)]"
            >
              <span className="text-[13.5px] font-medium text-[var(--color-ink)]">{r.name}</span>
              <ExternalLink size={14} className="text-[var(--color-ink-faint)]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
