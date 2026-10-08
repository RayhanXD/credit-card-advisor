"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSignOut() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    useAppStore.getState().clearSession();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button type="button" variant="ghost" size="sm" className={className} onClick={onSignOut} disabled={pending} icon={<LogOut size={14} />}>
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
