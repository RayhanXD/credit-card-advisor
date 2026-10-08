"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Database, MessageCircleOff } from "lucide-react";
import { ChatPanel } from "@/components/advisor/ChatPanel";
import { PageHeader } from "@/components/ui/Panel";

const PRINCIPLES = [
  { icon: Database, title: "Grounded in your data", body: "Every answer comes from the same engine that scores your cards — your profile, your wallet, our card database." },
  { icon: ShieldCheck, title: "No approval odds", body: "Card Advisor talks about positioning and fit. It never estimates your chances of approval." },
  { icon: MessageCircleOff, title: "Won't guess", body: "If a question falls outside what it knows, it says so and suggests a better way to ask." },
];

function AdvisorContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? undefined;

  return (
    <div className="space-y-6">
      <PageHeader kicker="Card Advisor" kickerTone="teal" title="Ask anything about your cards." description="Questions about your wallet, your strategy, transfer partners, or what to do next." />
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex h-[calc(100dvh-300px)] min-h-[440px] flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-card)] sm:p-5 lg:h-[calc(100dvh-260px)]">
          <ChatPanel initialQuery={q} />
        </div>
        <aside className="hidden space-y-3 lg:block">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
              <Icon size={16} className="text-[var(--color-teal-vivid)]" />
              <p className="mt-2 text-[13px] font-semibold text-[var(--color-ink)]">{title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">{body}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

export default function AdvisorPage() {
  return (
    <Suspense fallback={null}>
      <AdvisorContent />
    </Suspense>
  );
}
