import {
  LayoutGrid,
  WalletCards,
  Compass,
  HeartPulse,
  Search,
  Plane,
  MessageCircleQuestion,
  LifeBuoy,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/cards", label: "My Cards", icon: WalletCards },
  { href: "/strategy", label: "My Strategy", icon: Compass },
  { href: "/credit-health", label: "Credit Health", icon: HeartPulse },
  { href: "/card-finder", label: "Card Finder", icon: Search },
  { href: "/travel", label: "Travel Rewards", icon: Plane },
  { href: "/advisor", label: "Card Advisor", icon: MessageCircleQuestion },
  { href: "/resources", label: "Resources", icon: LifeBuoy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const MOBILE_NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/strategy", label: "Strategy", icon: Compass },
  { href: "/cards", label: "Cards", icon: WalletCards },
  { href: "/advisor", label: "Advisor", icon: MessageCircleQuestion },
  { href: "/settings", label: "More", icon: Settings },
];
