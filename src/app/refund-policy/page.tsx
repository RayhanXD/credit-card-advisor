import { LegalLayout, LegalSection, Placeholder } from "@/components/legal/LegalLayout";

export const metadata = { title: "Refund Policy — Strata" };

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund Policy" updated="September 2026">
      <p>
        This Refund Policy applies to any paid Strata subscription (for example, Strata Premium). The free tier of Strata
        does not involve any payment and this policy does not apply to it.
      </p>

      <LegalSection heading="1. Free Trial">
        <p>
          If a paid plan includes a free trial, you won&rsquo;t be charged until the trial ends. Cancel any time before the
          trial ends to avoid being charged.
        </p>
      </LegalSection>

      <LegalSection heading="2. Refund Window">
        <p>
          You can request a full refund within 14 days of your initial subscription charge, no questions asked. After 14
          days, subscription charges are non-refundable, but you can cancel at any time to stop future billing.
        </p>
      </LegalSection>

      <LegalSection heading="3. How to Request a Refund">
        <p>
          Email <Placeholder>[YOUR EMAIL]</Placeholder> with the email address on your account. We aim to process eligible
          refunds within 5 business days to your original payment method.
        </p>
      </LegalSection>

      <LegalSection heading="4. Cancellations">
        <p>
          You can cancel your subscription at any time from Settings. Cancelling stops future billing; it does not
          retroactively refund the current billing period unless you&rsquo;re within the refund window above.
        </p>
      </LegalSection>

      <LegalSection heading="5. Contact Us">
        <p>Questions about billing or refunds can be sent to <Placeholder>[YOUR EMAIL]</Placeholder>.</p>
      </LegalSection>
    </LegalLayout>
  );
}
