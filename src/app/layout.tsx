import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { brandName } from "@/lib/site";

// Two families: Manrope for headlines, Inter for body copy and financial data.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${brandName} — Your Credit Card Strategy`,
  description: "A personalized credit-card strategist: where you are, where you're going, and the path to get there.",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("strata-theme");
    var theme = stored || "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-[var(--radius-control)] focus:bg-[var(--color-ink)] focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-[var(--color-bg)]"
        >
          Skip to content
        </a>
        <SessionProvider>
          {children}
          <CookieConsentBanner />
        </SessionProvider>
      </body>
    </html>
  );
}
