import {
  LayoutGrid,
  WalletCards,
  Route,
  Activity,
  ScanSearch,
  Plane,
  MessagesSquare,
  LifeBuoy,
  Settings2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Plan",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutGrid },
      { href: "/strategy", label: "My Strategy", icon: Route },
      { href: "/credit-health", label: "Credit Health", icon: Activity },
    ],
  },
  {
    label: "Wallet",
    items: [
      { href: "/cards", label: "My Cards", icon: WalletCards },
      { href: "/card-finder", label: "Card Finder", icon: ScanSearch },
      { href: "/travel", label: "Travel Rewards", icon: Plane },
    ],
  },
  {
    label: "Help",
    items: [
      { href: "/advisor", label: "Card Advisor", icon: MessagesSquare },
      { href: "/resources", label: "Resources", icon: LifeBuoy },
      { href: "/settings", label: "Settings", icon: Settings2 },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export const MOBILE_PRIMARY: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/strategy", label: "Strategy", icon: Route },
  { href: "/cards", label: "Cards", icon: WalletCards },
  { href: "/advisor", label: "Advisor", icon: MessagesSquare },
];

export const MOBILE_MORE: NavItem[] = [
  { href: "/credit-health", label: "Credit Health", icon: Activity },
  { href: "/card-finder", label: "Card Finder", icon: ScanSearch },
  { href: "/travel", label: "Travel Rewards", icon: Plane },
  { href: "/resources", label: "Resources", icon: LifeBuoy },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function isActivePath(pathname: string | null, href: string) {
  return pathname === href || !!pathname?.startsWith(href + "/");
}

export function pageTitleFor(pathname: string | null): string | undefined {
  if (pathname?.startsWith("/cards/optimize")) return "Optimize My Wallet";
  if (pathname?.startsWith("/card-finder/")) return "Card Finder";
  return NAV_ITEMS.find((i) => isActivePath(pathname, i.href))?.label;
}
