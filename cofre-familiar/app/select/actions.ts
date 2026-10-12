"use server";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function createFamilyCofre(formData: FormData) {
  const { supabase } = await requireUser();
  const name = String(formData.get("name") || "Mi familia").trim().slice(0, 80) || "Mi familia";
  const tagline = String(formData.get("tagline") || "").trim().slice(0, 160) || null;
  const { data, error } = await supabase.schema("cofre").rpc("create_cofre_secure", {
    p_type: "family", p_name: name, p_tagline: tagline, p_start_date: null,
    p_theme_key: "classic", p_timezone: "America/Argentina/Buenos_Aires",
  });
  if (error) throw new Error(error.message);
  redirect(`/c/${data}`);
}
