"use server";

import { revalidatePath } from "next/cache";
import { getCofre } from "@/lib/cofre";

function text(fd: FormData, key: string, max = 5000) { return String(fd.get(key) || "").trim().slice(0, max); }
function nullable(value: string) { return value || null; }
function refresh(cofreId: string, personId: string) { revalidatePath(`/c/${cofreId}/people/${personId}`); revalidatePath(`/c/${cofreId}/people`); revalidatePath(`/c/${cofreId}`); }

export async function updatePersonProfile(fd: FormData) {
  const cofreId = text(fd, "cofreId", 64); const personId = text(fd, "personId", 64); const { db } = await getCofre(cofreId);
  const { error } = await db.from("people").update({
    display_name: nullable(text(fd, "displayName", 120)),
    relationship_label: nullable(text(fd, "relationship", 80)),
    birth_date: nullable(text(fd, "birthDate", 10)),
    bio: nullable(text(fd, "bio", 3000)),
  }).eq("id", personId).eq("cofre_id", cofreId);
  if (error) throw new Error(error.message); refresh(cofreId, personId);
}

export async function addPersonPreference(fd: FormData) {
  const cofreId = text(fd, "cofreId", 64); const personId = text(fd, "personId", 64); const { db, userId } = await getCofre(cofreId);
  const label = text(fd, "label", 180); if (!label) return;
  const categoryRaw = text(fd, "category", 40); const sentimentRaw = text(fd, "sentiment", 20);
  const category = ["interest","hobby","food","place","size","style","other"].includes(categoryRaw) ? categoryRaw : "other";
  const sentiment = sentimentRaw === "negative" ? "negative" : "like";
  const { error } = await db.from("person_preferences").insert({ cofre_id: cofreId, person_id: personId, category, label, sentiment, source_type: "manual", confirmed: true, visibility: "members", created_by: userId });
  if (error) throw new Error(error.message); refresh(cofreId, personId);
}

export async function addPersonWish(fd: FormData) {
  const cofreId = text(fd, "cofreId", 64); const personId = text(fd, "personId", 64); const { db, userId } = await getCofre(cofreId);
  const wish = text(fd, "wish", 500); if (!wish) return;
  const category = nullable(text(fd, "category", 50));
  const { error } = await db.from("person_wishes").insert({ cofre_id: cofreId, person_id: personId, text: wish, category, status: "wish", source_type: "manual", visibility: "members", created_by: userId });
  if (error) throw new Error(error.message); refresh(cofreId, personId);
}

export async function removePersonIntel(fd: FormData) {
  const cofreId = text(fd, "cofreId", 64); const personId = text(fd, "personId", 64); const itemId = text(fd, "itemId", 64); const kind = text(fd, "kind", 20); const { db } = await getCofre(cofreId);
  if (kind === "preference") {
    const { error } = await db.from("person_preferences").update({ deleted_at: new Date().toISOString() }).eq("id", itemId).eq("person_id", personId).eq("cofre_id", cofreId); if (error) throw new Error(error.message);
  } else if (kind === "wish") {
    const { error } = await db.from("person_wishes").update({ deleted_at: new Date().toISOString() }).eq("id", itemId).eq("person_id", personId).eq("cofre_id", cofreId); if (error) throw new Error(error.message);
  }
  refresh(cofreId, personId);
}
