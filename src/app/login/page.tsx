"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Panel, PanelBody } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth/errors";
import { brandName } from "@/lib/site";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "auth") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- surface callback error from the URL after mount
      setError("Sign-in link expired or was invalid. Try again.");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(authErrorMessage(signInError.message));
      setPending(false);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell title="Sign in" subtitle="Continue your credit-card strategy. Educational guidance — never a guarantee of approval.">
      <Panel>
        <PanelBody className="pt-5">
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
            <TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p role="alert" className="text-[13px] text-[var(--color-danger)]">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 flex flex-col gap-2 text-[13px] text-[var(--color-ink-soft)]">
            <Link href="/forgot-password" className="text-[var(--color-accent)] hover:underline">
              Forgot password?
            </Link>
            <p>
              New to {brandName}?{" "}
              <Link href="/signup" className="font-medium text-[var(--color-accent)] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </PanelBody>
      </Panel>
    </AuthShell>
  );
}
