export interface ContactEntry {
  name: string;
  customerService?: string;
  fraud?: string;
  lostStolen?: string;
  dispute?: string;
  website: string;
}

// Credit bureau contact information — publicly published general-support
// numbers. Verify current numbers on each bureau's official site.
export const CREDIT_BUREAUS: ContactEntry[] = [
  {
    name: "Equifax",
    customerService: "1-888-378-4329",
    dispute: "1-888-378-4329",
    website: "https://www.equifax.com",
  },
  {
    name: "Experian",
    customerService: "1-888-397-3742",
    dispute: "1-888-397-3742",
    website: "https://www.experian.com",
  },
  {
    name: "TransUnion",
    customerService: "1-800-916-8800",
    dispute: "1-800-916-8800",
    website: "https://www.transunion.com",
  },
];

export const OTHER_RESOURCES: ContactEntry[] = [
  {
    name: "AnnualCreditReport.com (free federally-mandated credit reports)",
    website: "https://www.annualcreditreport.com",
  },
  {
    name: "Consumer Financial Protection Bureau (file a complaint)",
    website: "https://www.consumerfinance.gov/complaint/",
  },
];
