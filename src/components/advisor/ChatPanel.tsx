"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, MessagesSquare, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { answerAdvisorQuestion } from "@/lib/engine/assistant";
import { getCard } from "@/data/cards";
import { CardFace } from "@/components/cards/CreditCardTile";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  cardId?: string;
}

const SUGGESTIONS = [
  "What card should I get next?",
  "Am I ready for Venture X?",
  "Which cards transfer to United?",
  "How many cards should I have?",
];

export function ChatPanel({ compact = false, initialQuery }: { compact?: boolean; initialQuery?: string }) {
  const profile = useAppStore((s) => s.profile);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hi${profile?.name ? ` ${profile.name.split(" ")[0]}` : ""} — I'm Card Advisor. Ask me about your cards, your strategy, or what to consider next. I answer from your actual profile and our card database, not guesses.`,
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sentInitialRef = useRef(false);
  useEffect(() => {
    if (initialQuery && !sentInitialRef.current && profile) {
      sentInitialRef.current = true;
      send(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, profile]);

  if (!profile) return null;

  function send(text: string) {
    if (!text.trim() || !profile) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    const answer = answerAdvisorQuestion(text, profile);
    const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", text: answer.text, cardId: answer.cardId };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="-mx-1 flex-1 space-y-5 overflow-y-auto px-1 pb-2" aria-live="polite">
        {messages.map((m) => {
          const card = m.cardId ? getCard(m.cardId) : undefined;
          return (
            <div key={m.id} className={cn("animate-rise flex gap-2.5", m.role === "user" && "justify-end")}>
              {m.role === "assistant" && (
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-[var(--color-ink)] text-[var(--color-mint)]">
                  <MessagesSquare size={13} />
                </span>
              )}
              <div className={cn("space-y-2", m.role === "user" ? "max-w-[80%]" : "max-w-[88%]")}>
                <div
                  className={cn(
                    "px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                    m.role === "assistant"
                      ? "rounded-[4px_16px_16px_16px] bg-[var(--color-bg-subtle)] text-[var(--color-ink)]"
                      : "rounded-[16px_4px_16px_16px] bg-[var(--color-ink)] text-[var(--color-bg-elevated)]"
                  )}
                >
                  {m.text}
                </div>
                {card && (
                  <Link
                    href={`/card-finder/${card.id}`}
                    className="group flex items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1.5 pr-3 transition-colors hover:border-[var(--color-border-strong)]"
                  >
                    <CardFace card={card} size="sm" className="w-12 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-[var(--color-ink)]">{card.name}</span>
                    <ArrowRight size={13} className="shrink-0 text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {messages.length <= 1 && (
        <div className={cn("mb-1 mt-3 grid gap-1.5", compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="group flex items-center justify-between gap-2 rounded-[12px] border border-[var(--color-border)] px-3 py-2 text-left text-[12.5px] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-mint)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-ink)]"
            >
              {s}
              <ArrowRight size={12} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg)] p-1.5 pl-3.5 transition-[border-color,box-shadow] focus-within:border-[var(--color-mint)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mint)_20%,transparent)]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your cards or strategy…"
          aria-label="Ask Card Advisor"
          className="h-9 min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[var(--color-primary)] text-[var(--color-primary-ink)] transition-opacity disabled:opacity-30"
          disabled={!input.trim()}
          aria-label="Send"
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </form>
      <p className="mt-2 text-center text-[10.5px] text-[var(--color-ink-faint)]">
        Educational, personalized guidance — not financial advice or an approval prediction.
      </p>
    </div>
  );
}
