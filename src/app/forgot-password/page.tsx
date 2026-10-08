"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Panel, PanelBody } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth/errors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setPending(false);
    if (resetError) {
      setError(authErrorMessage(resetError.message));
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell title="Reset your password" subtitle="We’ll email a link if an account exists for that address.">
      <Panel>
        <PanelBody className="pt-5">
          {sent ? (
            <div className="space-y-4">
              <p className="text-[14px] text-[var(--color-ink-soft)]">
                If an account exists for {email}, a reset link is on its way. You can close this page.
              </p>
              <Link href="/login" className="text-[13px] font-medium text-[var(--color-accent)] hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <TextField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && (
                <p role="alert" className="text-[13px] text-[var(--color-danger)]">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Sending…" : "Send reset link"}
              </Button>
              <Link href="/login" className="block text-[13px] text-[var(--color-accent)] hover:underline">
                Back to sign in
              </Link>
            </form>
          )}
        </PanelBody>
      </Panel>
    </AuthShell>
  );
}
