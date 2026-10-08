import { CARDS } from "@/data/cards";
import { ISSUERS } from "@/data/issuers";
import { TRANSFER_PARTNERS } from "@/data/transferPartners";
import { createClient } from "@/lib/supabase/client";
import type { CreditCardProduct, Issuer, TransferPartner } from "@/lib/types";

let catalogReady = false;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

export function isCatalogReady() {
  return catalogReady;
}

export function subscribeCatalog(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function markReady() {
  catalogReady = true;
  for (const listener of listeners) listener();
}

/** Load issuers, partners, and cards into the in-memory arrays the engine already imports. */
export function ensureCatalog(): Promise<void> {
  if (catalogReady) return Promise.resolve();
  if (!inflight) {
    inflight = hydrate().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

async function hydrate() {
  try {
    const supabase = createClient();
    const [cardsRes, issuersRes, partnersRes] = await Promise.all([
      supabase.from("cards").select("product"),
      supabase.from("issuers").select("id, name, accent_color, application_rules, contact"),
      supabase.from("transfer_partners").select("id, name, type, transfers_from"),
    ]);
    if (cardsRes.error) throw cardsRes.error;
    if (issuersRes.error) throw issuersRes.error;
    if (partnersRes.error) throw partnersRes.error;

    const products = (cardsRes.data ?? [])
      .map((row) => row.product as unknown as CreditCardProduct)
      .filter((card) => card && typeof card.id === "string");
    if (products.length > 0) {
      CARDS.splice(0, CARDS.length, ...products);
    }

    const issuers = (issuersRes.data ?? []).map(
      (row): Issuer => ({
        id: row.id,
        name: row.name,
        accentColor: row.accent_color,
        applicationRules: Array.isArray(row.application_rules) ? (row.application_rules as string[]) : [],
        contact: row.contact as Issuer["contact"],
      })
    );
    if (issuers.length > 0) {
      ISSUERS.splice(0, ISSUERS.length, ...issuers);
    }

    const partners = (partnersRes.data ?? []).map(
      (row): TransferPartner => ({
        id: row.id,
        name: row.name,
        type: row.type === "hotel" ? "hotel" : "airline",
        transfersFrom: Array.isArray(row.transfers_from) ? (row.transfers_from as TransferPartner["transfersFrom"]) : [],
      })
    );
    if (partners.length > 0) {
      TRANSFER_PARTNERS.splice(0, TRANSFER_PARTNERS.length, ...partners);
    }
  } catch {
    // Keep the TypeScript seed so a failed fetch does not blank the app.
  } finally {
    markReady();
  }
}
