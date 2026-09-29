"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatPanel } from "@/components/advisor/ChatPanel";

function AdvisorContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? undefined;

  return (
    <div className="mx-auto flex h-[calc(100vh-160px)] max-w-2xl flex-col lg:h-[calc(100vh-140px)]">
      <div className="mb-4">
        <h1 className="text-[24px] font-semibold tracking-tight">Card Advisor</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">Ask about your cards, your strategy, or what to do next.</p>
      </div>
      <div className="flex-1 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
        <ChatPanel initialQuery={q} />
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
