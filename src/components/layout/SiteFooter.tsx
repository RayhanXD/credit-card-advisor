import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] px-5 py-10 text-[12px] text-[var(--color-ink-faint)]">
      <div className="mx-auto max-w-6xl space-y-4">
        <p className="max-w-2xl">
          Strata is an educational prototype. Recommendations are personalized guidance, not financial advice or a
          guarantee of approval. Credit decisions are made solely by issuers.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privacy" className="hover:text-[var(--color-ink)]">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[var(--color-ink)]">
            Terms of Service
          </Link>
          <Link href="/cookies" className="hover:text-[var(--color-ink)]">
            Cookie Policy
          </Link>
          <Link href="/refund-policy" className="hover:text-[var(--color-ink)]">
            Refund Policy
          </Link>
          <Link href="/resources" className="hover:text-[var(--color-ink)]">
            Need Help?
          </Link>
        </div>
        <div className="space-y-1 border-t border-[var(--color-border)] pt-4">
          <p>[YOUR COMPANY NAME] &middot; [YOUR BUSINESS ADDRESS] &middot; [YOUR EMAIL]</p>
          <p>Icons by Lucide (ISC License). Typeface: Geist by Vercel (SIL Open Font License). No stock photography used.</p>
        </div>
      </div>
    </footer>
  );
}
