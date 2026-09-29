import type { Issuer } from "@/lib/types";

// Contact information below is the publicly published general-support numbers
// for each issuer as commonly listed on their own sites. Always verify current
// numbers on the issuer's official site — see Resources > Need Help.
export const ISSUERS: Issuer[] = [
  {
    id: "chase",
    name: "Chase",
    accentColor: "#0A3E6E",
    applicationRules: [
      "Chase's unwritten \"5/24\" rule: applicants who have opened 5+ personal credit cards (any issuer) in the past 24 months are typically declined for most Chase cards.",
      "Chase generally limits applicants to one Sapphire-family card at a time, and restricts new-cardmember bonuses if you've earned one on the same card in the last 48 months.",
    ],
    contact: {
      customerService: "1-800-935-9935",
      fraud: "1-800-955-9060",
      lostStolen: "1-800-935-9935",
      website: "https://www.chase.com",
    },
  },
  {
    id: "capital_one",
    name: "Capital One",
    accentColor: "#8B1D2C",
    applicationRules: [
      "Capital One generally limits most individuals to two personal credit cards at a time, and there are informal limits on new-account velocity (often described as one new card roughly every 6 months).",
      "Capital One typically will not approve a new card if you already carry a card with substantially overlapping benefits.",
    ],
    contact: {
      customerService: "1-800-227-4825",
      fraud: "1-800-227-4825",
      lostStolen: "1-800-227-4825",
      website: "https://www.capitalone.com",
    },
  },
  {
    id: "amex",
    name: "American Express",
    accentColor: "#016FD0",
    applicationRules: [
      "Amex's \"once per lifetime\" rule generally prevents earning a welcome offer on the same card again if you've ever held it.",
      "Amex evaluates total available credit across all your Amex cards, which can affect approval odds and credit limits on new applications.",
    ],
    contact: {
      customerService: "1-800-528-4800",
      fraud: "1-800-528-2122",
      lostStolen: "1-800-528-4800",
      website: "https://www.americanexpress.com",
    },
  },
  {
    id: "citi",
    name: "Citi",
    accentColor: "#003B7A",
    applicationRules: [
      "Citi generally limits applicants to one new personal credit card roughly every 8 days across all Citi applications, and restricts welcome bonuses if you currently hold or recently closed the same card.",
    ],
    contact: {
      customerService: "1-800-950-5114",
      fraud: "1-800-950-5114",
      lostStolen: "1-800-950-5114",
      website: "https://www.citi.com",
    },
  },
  {
    id: "bank_of_america",
    name: "Bank of America",
    accentColor: "#012169",
    applicationRules: [
      "Bank of America uses an informal \"2/3/4\" rule: generally no more than 2 new cards in 2 months, 3 in 12 months, or 4 in 24 months across all issuers.",
      "Preferred Rewards banking clients can earn a 25–75% rewards bonus on eligible Bank of America credit cards.",
    ],
    contact: {
      customerService: "1-800-732-9194",
      fraud: "1-800-732-9194",
      lostStolen: "1-800-732-9194",
      website: "https://www.bankofamerica.com",
    },
  },
  {
    id: "wells_fargo",
    name: "Wells Fargo",
    accentColor: "#D71E28",
    applicationRules: [
      "Wells Fargo generally allows only one new personal credit card application every 6 months.",
    ],
    contact: {
      customerService: "1-800-869-3557",
      fraud: "1-800-869-3557",
      lostStolen: "1-800-869-3557",
      website: "https://www.wellsfargo.com",
    },
  },
  {
    id: "us_bank",
    name: "U.S. Bank",
    accentColor: "#0C2074",
    applicationRules: ["U.S. Bank evaluates recent inquiries and existing relationship depth on every application."],
    contact: {
      customerService: "1-800-285-8585",
      fraud: "1-800-347-7378",
      lostStolen: "1-800-285-8585",
      website: "https://www.usbank.com",
    },
  },
  {
    id: "discover",
    name: "Discover",
    accentColor: "#F76B1C",
    applicationRules: ["Discover generally allows only one Discover card per person at a time."],
    contact: {
      customerService: "1-800-347-2683",
      fraud: "1-800-347-2683",
      lostStolen: "1-800-347-2683",
      website: "https://www.discover.com",
    },
  },
];

export function getIssuer(id: string): Issuer | undefined {
  return ISSUERS.find((i) => i.id === id);
}
