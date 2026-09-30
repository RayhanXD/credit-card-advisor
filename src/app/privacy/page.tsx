import { LegalLayout, LegalSection, Placeholder } from "@/components/legal/LegalLayout";
import Link from "next/link";

export const metadata = { title: "Privacy Policy — Strata" };

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 2026">
      <p>
        This Privacy Policy describes how <Placeholder>[YOUR COMPANY NAME]</Placeholder> (&ldquo;Strata,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us&rdquo;) collects, uses, and protects your information when you use the Strata credit card strategy platform
        (the &ldquo;Service&rdquo;). This policy describes the Service as designed, including account creation and server-side
        data storage; some of these capabilities are part of our ongoing rollout.
      </p>

      <LegalSection heading="1. Information We Collect">
        <p>We collect the following categories of information:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Account information:</strong> name, email address, and authentication credentials when you create an
            account.
          </li>
          <li>
            <strong>Financial profile information you provide:</strong> age range, employment status, approximate income,
            housing status, approximate spending by category, existing credit cards, issuer relationships, and stated goals.
            We never ask for a full Social Security number, full bank account numbers, full credit card numbers, or
            passwords to other services.
          </li>
          <li>
            <strong>Credit report data:</strong> where you connect a supported credit bureau or data provider, we may
            receive credit score, utilization, account age, and inquiry history through a soft, non-impacting check. This is
            always clearly distinguished from a hard inquiry, which only occurs if you choose to continue to an issuer&rsquo;s
            own application.
          </li>
          <li>
            <strong>Usage data:</strong> pages viewed, features used, and interactions with the Card Advisor, collected to
            improve the Service.
          </li>
          <li>
            <strong>Device and local storage data:</strong> see our{" "}
            <Link href="/cookies" className="font-medium text-[var(--color-accent)]">
              Cookie Policy
            </Link>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. How We Use Your Information">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To generate personalized card recommendations, a Card Journey, and readiness assessments through our
            structured recommendation engine.</li>
          <li>To power the Card Advisor&rsquo;s explanations of your own recommendations.</li>
          <li>To maintain, secure, and improve the Service.</li>
          <li>To send you account, security, and (if you opt in) strategy-review notifications.</li>
        </ul>
        <p>
          We do not use your financial profile to train third-party advertising models, and we do not sell your personal
          information.
        </p>
      </LegalSection>

      <LegalSection heading="3. How We Share Information">
        <p>We share information only in these circumstances:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>With a card issuer, but only when you affirmatively click through to that issuer&rsquo;s own application.</li>
          <li>With service providers who help us operate the Service (hosting, credit bureau connectivity, customer
            support), under confidentiality obligations.</li>
          <li>When required by law, or to protect the rights, safety, or property of Strata or our users.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Data Security">
        <p>
          We use industry-standard safeguards, including encryption in transit and at rest, least-privilege access
          controls, and audit logging for sensitive actions. No method of transmission or storage is 100% secure, and we
          cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="5. Your Rights and Choices">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>You can access, correct, or export your profile information from Settings at any time.</li>
          <li>
            You can request deletion of your account and associated data by using the in-app data reset option, or by
            emailing <Placeholder>[YOUR EMAIL]</Placeholder>. We will process deletion requests within 30 days.
          </li>
          <li>You can opt out of non-essential notifications from Settings.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. Children's Privacy">
        <p>
          The Service is not directed to children under 13 (or the relevant age of digital consent in your jurisdiction),
          and we do not knowingly collect personal information from children. If we learn we have collected such
          information, we will delete it promptly.
        </p>
      </LegalSection>

      <LegalSection heading="7. International Users">
        <p>
          The Service is operated from <Placeholder>[YOUR JURISDICTION]</Placeholder>. If you access the Service from
          outside that jurisdiction, your information may be transferred to, stored, and processed there.
        </p>
      </LegalSection>

      <LegalSection heading="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes by posting a notice
          in the Service or by email.
        </p>
      </LegalSection>

      <LegalSection heading="9. Contact Us">
        <p>
          Questions about this policy or your data can be sent to <Placeholder>[YOUR EMAIL]</Placeholder>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
