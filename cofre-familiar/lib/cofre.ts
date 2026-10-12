import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";

export type CofreSummary = {
  id: string;
  name: string;
  type: "family" | "couple" | string;
  tagline: string | null;
  theme_key: string;
  status: string;
  timezone: string;
};

export async function getCofre(cofreId: string) {
  const { supabase, userId } = await requireUser();
  const db = supabase.schema("cofre");
  const { data, error } = await db
    .from("cofres")
    .select("id,name,type,tagline,theme_key,status,timezone")
    .eq("id", cofreId)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) notFound();
  return { supabase, db, userId, cofre: data as CofreSummary };
}

export async function listMyCofres() {
  const { supabase } = await requireUser();
  const db = supabase.schema("cofre");
  const { data: memberships, error } = await db
    .from("cofre_members")
    .select("cofre_id,role,status")
    .eq("status", "active");
  if (error) throw new Error(error.message);
  const ids = (memberships ?? []).map((x: any) => x.cofre_id);
  if (!ids.length) return [];
  const { data: cofres, error: cofreError } = await db
    .from("cofres")
    .select("id,name,type,tagline,theme_key,status,timezone")
    .in("id", ids)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  if (cofreError) throw new Error(cofreError.message);
  return cofres ?? [];
}

