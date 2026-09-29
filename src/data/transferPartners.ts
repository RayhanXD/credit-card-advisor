import type { TransferPartner } from "@/lib/types";

// Representative set of transfer partners for demo purposes. Ratios reflect
// commonly published 1:1 or stated transfer ratios as of the last-verified date
// on each card's dataFreshness record — always confirm current ratios with the issuer.
export const TRANSFER_PARTNERS: TransferPartner[] = [
  {
    id: "united",
    name: "United MileagePlus",
    type: "airline",
    transfersFrom: [
      { rewardsCurrency: "chase_ur", ratio: "1:1" },
    ],
  },
  {
    id: "southwest",
    name: "Southwest Rapid Rewards",
    type: "airline",
    transfersFrom: [{ rewardsCurrency: "chase_ur", ratio: "1:1" }],
  },
  {
    id: "air_canada",
    name: "Air Canada Aeroplan",
    type: "airline",
    transfersFrom: [
      { rewardsCurrency: "chase_ur", ratio: "1:1" },
      { rewardsCurrency: "amex_mr", ratio: "1:1" },
    ],
  },
  {
    id: "air_france_klm",
    name: "Air France-KLM Flying Blue",
    type: "airline",
    transfersFrom: [
      { rewardsCurrency: "amex_mr", ratio: "1:1" },
      { rewardsCurrency: "citi_thankyou", ratio: "1:1" },
      { rewardsCurrency: "capital_one_miles", ratio: "1:1" },
    ],
  },
  {
    id: "british_airways",
    name: "British Airways Executive Club",
    type: "airline",
    transfersFrom: [
      { rewardsCurrency: "chase_ur", ratio: "1:1" },
      { rewardsCurrency: "amex_mr", ratio: "1:1" },
      { rewardsCurrency: "capital_one_miles", ratio: "1:1" },
    ],
  },
  {
    id: "emirates",
    name: "Emirates Skywards",
    type: "airline",
    transfersFrom: [
      { rewardsCurrency: "amex_mr", ratio: "1:1" },
      { rewardsCurrency: "capital_one_miles", ratio: "1:1" },
    ],
  },
  {
    id: "virgin_atlantic",
    name: "Virgin Atlantic Flying Club",
    type: "airline",
    transfersFrom: [
      { rewardsCurrency: "chase_ur", ratio: "1:1" },
      { rewardsCurrency: "amex_mr", ratio: "1:1" },
      { rewardsCurrency: "capital_one_miles", ratio: "1:1" },
    ],
  },
  {
    id: "delta",
    name: "Delta SkyMiles",
    type: "airline",
    transfersFrom: [{ rewardsCurrency: "amex_mr", ratio: "1:1" }],
  },
  {
    id: "jetblue",
    name: "JetBlue TrueBlue",
    type: "airline",
    transfersFrom: [{ rewardsCurrency: "citi_thankyou", ratio: "1:1" }],
  },
  {
    id: "marriott",
    name: "Marriott Bonvoy",
    type: "hotel",
    transfersFrom: [
      { rewardsCurrency: "amex_mr", ratio: "1:1" },
      { rewardsCurrency: "chase_ur", ratio: "1:1" },
    ],
  },
  {
    id: "hyatt",
    name: "World of Hyatt",
    type: "hotel",
    transfersFrom: [{ rewardsCurrency: "chase_ur", ratio: "1:1" }],
  },
  {
    id: "hilton",
    name: "Hilton Honors",
    type: "hotel",
    transfersFrom: [{ rewardsCurrency: "amex_mr", ratio: "1:2" }],
  },
  {
    id: "choice",
    name: "Choice Privileges",
    type: "hotel",
    transfersFrom: [{ rewardsCurrency: "capital_one_miles", ratio: "1:1" }],
  },
  {
    id: "wyndham",
    name: "Wyndham Rewards",
    type: "hotel",
    transfersFrom: [{ rewardsCurrency: "capital_one_miles", ratio: "1:1" }],
  },
];

export function getTransferPartner(id: string): TransferPartner | undefined {
  return TRANSFER_PARTNERS.find((p) => p.id === id);
}

export function partnersForCurrency(currency: string): TransferPartner[] {
  return TRANSFER_PARTNERS.filter((p) => p.transfersFrom.some((f) => f.rewardsCurrency === currency));
}
