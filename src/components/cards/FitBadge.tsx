import type { FitLabel } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

const FIT_CONFIG: Record<FitLabel, { label: string; tone: "success" | "accent" | "warning" | "neutral" }> = {
  strong_fit: { label: "Strong Fit", tone: "success" },
  consider: { label: "Consider", tone: "accent" },
  wait: { label: "Wait", tone: "warning" },
  not_recommended_now: { label: "Not Recommended Right Now", tone: "neutral" },
};

export function FitBadge({ fitLabel, className }: { fitLabel: FitLabel; className?: string }) {
  const config = FIT_CONFIG[fitLabel];
  return (
    <Badge tone={config.tone} className={className}>
      {config.label}
    </Badge>
  );
}
