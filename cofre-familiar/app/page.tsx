import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function IndexPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getClaims();
  redirect(data?.claims?.sub ? "/select" : "/login");
}
