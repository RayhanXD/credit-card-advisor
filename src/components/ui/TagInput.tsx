"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setDraft("");
  }

  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-[var(--color-ink)]">{label}</label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2.5 py-2 focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20">
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 rounded-full bg-[var(--color-bg-subtle)] px-2.5 py-1 text-[12.5px] font-medium text-[var(--color-ink)]">
            {v}
            <button onClick={() => onChange(values.filter((x) => x !== v))} aria-label={`Remove ${v}`} className="text-[var(--color-ink-faint)] hover:text-[var(--color-danger)]">
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          placeholder={values.length === 0 ? placeholder : ""}
          className="min-w-24 flex-1 bg-transparent py-1 text-[13.5px] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
      </div>
    </div>
  );
}
