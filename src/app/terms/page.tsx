import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { brandName, jurisdiction, operatorName, supportEmail } from "@/lib/site";
import Link from "next/link";

export const metadata = { title: `Terms of Service — ${brandName}` };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="September 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of {brandName}, provided by{" "}
        {operatorName}. By creating an account or otherwise using {brandName}, you agree to
        these Terms.
      </p>

      <LegalSection heading={`1. What ${brandName} Is (and Isn't)`}>
        <p>
          {brandName} provides educational, personalized guidance about credit cards based on information you provide and,
          where connected, credit bureau data. {brandName} is not a bank, lender, or credit bureau. {brandName} does not make credit
          decisions, does not guarantee approval for any card, and does not provide licensed financial, legal, or tax
          advice. Recommendations reflect an internal scoring model, not an approval prediction.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility">
        <p>
          You must be at least 18 years old, or the age of majority in your jurisdiction, to create an account. By using
          {brandName}, you represent that you meet this requirement.
        </p>
      </LegalSection>

      <LegalSection heading="3. Your Account">
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activity under
          your account. Notify us promptly at {supportEmail} if you suspect unauthorized access.
        </p>
      </LegalSection>

      <LegalSection heading="4. Acceptable Use">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Don&rsquo;t use {brandName} to submit false information to a card issuer.</li>
          <li>Don&rsquo;t attempt to scrape, reverse engineer, or resell {brandName}&rsquo;s recommendation data.</li>
          <li>Don&rsquo;t use {brandName} in a way that violates applicable law.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Third-Party Links and Issuer Applications">
        <p>
          {brandName} links to third-party card issuer websites. We are not responsible for the content, terms, or privacy
          practices of those sites. Continuing to an issuer&rsquo;s application may result in a hard credit inquiry; {brandName}
          never submits an application on your behalf. Where {brandName} has an affiliate or partnership relationship with an
          issuer, this is disclosed and does not change how cards are scored or ranked for you.
        </p>
      </LegalSection>

      <LegalSection heading="6. Subscriptions and Payment">
        <p>
          Certain features may require a paid subscription. Fees, billing frequency, and available plans are disclosed
          before you subscribe. See our{" "}
          <Link href="/refund-policy" className="font-medium text-[var(--color-accent)]">
            Refund Policy
          </Link>{" "}
          for cancellation and refund terms.
        </p>
      </LegalSection>

      <LegalSection heading="7. Disclaimers">
        <p>
          {brandName} is provided &ldquo;as is&rdquo; without warranties of any kind. Credit scores vary by bureau and scoring
          model, card terms can change without notice, and a recommendation from {brandName} is not a guarantee of approval,
          savings, or any particular financial outcome. You should verify current card terms with the issuer before
          applying.
        </p>
      </LegalSection>

      <LegalSection heading="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, {operatorName} will not be liable for any
          indirect, incidental, or consequential damages arising from your use of {brandName}, including denied credit
          applications, credit score impacts, or financial losses from decisions made using {brandName}&rsquo;s guidance.
        </p>
      </LegalSection>

      <LegalSection heading="9. Termination">
        <p>
          You may stop using {brandName} and delete your account at any time. We may suspend or terminate accounts that violate
          these Terms.
        </p>
      </LegalSection>

      <LegalSection heading="10. Governing Law">
        <p>These Terms are governed by the laws of {jurisdiction}, without regard to conflict of law principles.</p>
      </LegalSection>

      <LegalSection heading="11. Changes to These Terms">
        <p>We may update these Terms from time to time. Continued use of {brandName} after a change constitutes acceptance of the updated Terms.</p>
      </LegalSection>

      <LegalSection heading="12. Contact Us">
        <p>Questions about these Terms can be sent to {supportEmail}.</p>
      </LegalSection>
    </LegalLayout>
  );
}
