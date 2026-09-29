"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { ArrowRight } from "lucide-react";

export function PrimaryCTA({ label = "Build My Strategy", size = "lg" }: { label?: string; size?: "sm" | "md" | "lg" }) {
  const router = useRouter();
  return (
    <Button size={size} onClick={() => router.push("/onboarding")} iconRight={<ArrowRight size={17} />}>
      {label}
    </Button>
  );
}

export function ExploreCardsCTA() {
  const router = useRouter();
  const loadPersona = useAppStore((s) => s.loadPersona);
  return (
    <Button
      size="lg"
      variant="secondary"
      onClick={() => {
        loadPersona("persona_priya");
        router.push("/card-finder");
      }}
    >
      Explore Cards
    </Button>
  );
}
