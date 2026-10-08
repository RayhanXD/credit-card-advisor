import Link from "next/link";
import { brandName, businessAddress, operatorName, supportEmail } from "@/lib/site";
import { Logo } from "@/components/brand/Logo";

const LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/resources", label: "Need help?" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-12 text-[12.5px] text-[var(--color-ink-faint)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm space-y-3">
            <Logo size={26} />
            <p className="leading-relaxed">
              {brandName} is an educational prototype. Recommendations are personalized guidance, not financial advice or a guarantee of
              approval. Credit decisions are made solely by issuers.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 md:max-w-sm md:justify-end">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-[var(--color-ink)]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-[var(--color-border)] pt-5 text-[11.5px] sm:flex-row">
          <p>
            {operatorName} · {businessAddress} · {supportEmail}
          </p>
          <p>Icons by Lucide (ISC). Typefaces: Geist, Bricolage Grotesque (SIL OFL).</p>
        </div>
      </div>
    </footer>
  );
}
