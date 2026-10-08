"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRoleKey } from "@/lib/supabase/admin";

export async function deleteAccountAction(): Promise<{ error: string } | void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub as string | undefined;

  if (error || !userId) {
    return { error: "You need to be signed in to delete your account." };
  }

  if (hasServiceRoleKey()) {
    const admin = createAdminClient();
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) return { error: deleteError.message };
  } else {
    const { error: rpcError } = await supabase.rpc("delete_own_account");
    if (rpcError) return { error: rpcError.message };
  }

  await supabase.auth.signOut();
  redirect("/login");
}
