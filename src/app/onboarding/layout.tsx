import type { ReactNode } from "react";
import { OnboardingGate } from "@/components/layout/OnboardingGate";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <OnboardingGate>{children}</OnboardingGate>;
}
