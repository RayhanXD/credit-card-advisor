import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { brandName, operatorName, supportEmail } from "@/lib/site";

export const metadata = { title: `Cookie Policy — ${brandName}` };

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="September 2026">
      <p>
        This Cookie Policy explains how {operatorName} uses cookies and similar
        technologies, including browser local storage, on {brandName}.
      </p>

      <LegalSection heading="1. What We Use">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Essential:</strong> keep you signed in and remember your session. These can&rsquo;t be turned off
            without breaking core functionality.
          </li>
          <li>
            <strong>Preference:</strong> remember settings like your light/dark theme choice and dismissed banners. Stored
            in your browser&rsquo;s local storage today; may move to a cookie-based preference store as we add features.
          </li>
          <li>
            <strong>Functional:</strong> keep a working copy of your credit-card profile so the app functions even if a
            request to our servers is delayed.
          </li>
          <li>
            <strong>Analytics:</strong> help us understand which features are used, in aggregate. We don&rsquo;t currently
            use third-party analytics cookies; if that changes, this policy will be updated first.
          </li>
        </ul>
        <p>We do not use advertising or cross-site tracking cookies.</p>
      </LegalSection>

      <LegalSection heading="2. Your Choices">
        <p>
          Most browsers let you block or delete cookies and local storage through their settings. You can also clear
          {brandName}&rsquo;s locally stored data at any time from Settings &rarr; Data &amp; Privacy &rarr; Reset my data.
          Blocking essential cookies may prevent parts of the Service from working.
        </p>
      </LegalSection>

      <LegalSection heading="3. Changes to This Policy">
        <p>We&rsquo;ll update this page if the cookies and technologies we use change.</p>
      </LegalSection>

      <LegalSection heading="4. Contact Us">
        <p>Questions can be sent to {supportEmail}.</p>
      </LegalSection>
    </LegalLayout>
  );
}
