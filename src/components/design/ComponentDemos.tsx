"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Slider } from "@/components/ui/Slider";
import { TagInput } from "@/components/ui/TagInput";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import { CheckboxCardGroup } from "@/components/ui/CheckboxCardGroup";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Tooltip } from "@/components/ui/Tooltip";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

export function FormsDemo() {
  const [name, setName] = useState("");
  const [income, setIncome] = useState(82000);
  const [airlines, setAirlines] = useState<string[]>(["United"]);
  const [fee, setFee] = useState<"none" | "low" | "moderate" | "high">("low");
  const [loans, setLoans] = useState<string[]>(["auto"]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <TextField label="Name" placeholder="What should we call you?" value={name} onChange={(e) => setName(e.target.value)} hint="Used for your greeting only." />
        <TextField label="Monthly rent" prefixLabel="$" placeholder="1,500" inputMode="numeric" />
        <Slider label="Approximate annual income" min={0} max={300000} step={1000} value={income} onChange={setIncome} formatValue={(v) => formatCurrency(v)} />
        <TagInput label="Favorite airlines" values={airlines} onChange={setAirlines} placeholder="Type an airline and press Enter" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-[var(--color-ink)]">Annual fee tolerance</p>
          <RadioCardGroup
            value={fee}
            onChange={setFee}
            options={[
              { value: "none", label: "$0 only", description: "No annual fee" },
              { value: "low", label: "Under $100", description: "Modest fees are fine" },
              { value: "moderate", label: "Under $400", description: "If the value is there" },
              { value: "high", label: "$400+", description: "Premium cards welcome" },
            ]}
          />
        </div>
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-[var(--color-ink)]">Existing loans</p>
          <CheckboxCardGroup
            value={loans}
            onChange={setLoans}
            options={[
              { value: "auto", label: "Auto loan" },
              { value: "student", label: "Student loan" },
              { value: "mortgage", label: "Mortgage" },
              { value: "personal", label: "Personal loan" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function FeedbackDemo() {
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" onClick={() => show("Card added to your wallet", "success")}>
        Success toast
      </Button>
      <Button variant="secondary" onClick={() => show("Your review date is next month", "info")}>
        Info toast
      </Button>
      <Button variant="secondary" onClick={() => show("Couldn’t save. Try again.", "warning")}>
        Warning toast
      </Button>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Tooltip content="Fit is a signal of how well a card matches your profile. It is not an approval prediction.">
        <button className="flex items-center gap-1.5 rounded-[10px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[13px] font-medium text-[var(--color-ink)]">
          <Info size={14} /> What is fit?
        </button>
      </Tooltip>
      <Modal open={open} onClose={() => setOpen(false)} title="Remove this card?">
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">Removing a card only changes your wallet here. It doesn’t close the account with the issuer.</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep card
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
