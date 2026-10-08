"use client";

import { useId, useState } from "react";
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
  const id = useId();

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setDraft("");
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-[var(--color-ink)]">
        {label}
      </label>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 py-1.5 shadow-[var(--shadow-inset)] transition-[border-color,box-shadow] focus-within:border-[var(--color-mint)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mint)_20%,transparent)]">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 rounded-[7px] bg-[var(--color-teal-soft)] py-1 pl-2.5 pr-1.5 text-[12.5px] font-medium text-[var(--color-teal)]"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              aria-label={`Remove ${v}`}
              className="rounded p-0.5 opacity-70 hover:opacity-100"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          id={id}
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
          className="min-w-24 flex-1 bg-transparent px-1.5 py-1 text-[14px] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
      </div>
    </div>
  );
}
