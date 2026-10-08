// The product name is not final (see PRD §16). Every user-facing mention of it
// reads from here so a rename is a one-line change.
export const brandName = process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Strata";
export const operatorName = process.env.NEXT_PUBLIC_OPERATOR_NAME?.trim() || brandName;
export const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@strata.app";
export const jurisdiction = process.env.NEXT_PUBLIC_JURISDICTION?.trim() || "the United States";
export const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS?.trim() || "Address on file";
