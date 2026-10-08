"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function PrimaryCTA({ label = "Build My Strategy", size = "lg" }: { label?: string; size?: "sm" | "md" | "lg" }) {
  const router = useRouter();
  return (
    <Button size={size} onClick={() => router.push("/signup")} iconRight={<ArrowRight size={17} />}>
      {label}
    </Button>
  );
}

export function ExploreCardsCTA() {
  const router = useRouter();
  return (
    <Button size="lg" variant="secondary" onClick={() => router.push("/signup")}>
      Explore Cards
    </Button>
  );
}
