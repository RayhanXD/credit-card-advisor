"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { answerAdvisorQuestion } from "@/lib/engine/assistant";
import { getCard } from "@/data/cards";
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
      <div ref={scrollRef} className={cn("flex-1 space-y-4 overflow-y-auto px-1", compact ? "max-h-96" : "")}>
        {messages.map((m) => (
          <div key={m.id} className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                m.role === "assistant" ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
              )}
            >
              {m.role === "assistant" ? <Sparkles size={13} /> : <User size={13} />}
            </div>
            <div className={cn("max-w-[85%] space-y-2")}>
              <div
                className={cn(
                  "rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                  m.role === "assistant"
                    ? "rounded-tl-sm bg-[var(--color-bg-subtle)] text-[var(--color-ink)]"
                    : "rounded-tr-sm bg-[var(--color-ink)] text-[var(--color-bg)]"
                )}
              >
                {m.text}
              </div>
              {m.cardId && (
                <Link
                  href={`/card-finder/${m.cardId}`}
                  className="inline-block rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)]"
                >
                  View {getCard(m.cardId)?.name} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {messages.length <= 1 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-[12px] text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2 border-t border-[var(--color-border)] pt-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Card Advisor…"
          className="h-10 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 text-[13.5px] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-ink)] text-[var(--color-bg)] disabled:opacity-40"
          disabled={!input.trim()}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>
      <p className="mt-2 text-center text-[10.5px] text-[var(--color-ink-faint)]">
        Educational, personalized guidance — not financial advice or an approval prediction.
      </p>
    </div>
  );
}
