import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export async function requireUser() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) redirect("/login");
  return { supabase, userId };
}
