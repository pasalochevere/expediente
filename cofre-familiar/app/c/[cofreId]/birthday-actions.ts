"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCofre } from "@/lib/cofre";

function text(fd: FormData, key: string, max = 200) {
  return String(fd.get(key) || "").trim().slice(0, max);
}

function ymdInZone(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function daysBetween(a: string, b: string) {
  const A = Date.UTC(Number(a.slice(0, 4)), Number(a.slice(5, 7)) - 1, Number(a.slice(8, 10)));
  const B = Date.UTC(Number(b.slice(0, 4)), Number(b.slice(5, 7)) - 1, Number(b.slice(8, 10)));
  return Math.round((B - A) / 86400000);
}

function safeAnnualDate(year: number, month: number, day: number) {
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
}

function birthdayOccurrence(eventDate: string, today: string) {
  const month = Number(eventDate.slice(5, 7));
  const day = Number(eventDate.slice(8, 10));
  let year = Number(today.slice(0, 4));
  let occursOn = safeAnnualDate(year, month, day);
  if (daysBetween(today, occursOn) < 0) {
    year += 1;
    occursOn = safeAnnualDate(year, month, day);
  }
  return { occursOn, milestone: year - Number(eventDate.slice(0, 4)), days: daysBetween(today, occursOn) };
}

async function ensureCampaign(cofreId: string, dateId: string) {
  const { db, cofre } = await getCofre(cofreId);
  const { data: date, error } = await db
    .from("important_dates")
    .select("id,person_id,title,event_type,event_date")
    .eq("id", dateId)
    .eq("cofre_id", cofreId)
    .is("deleted_at", null)
    .single();
  if (error || !date || date.event_type !== "birthday") throw new Error("Cumpleaños no encontrado.");

  const today = ymdInZone(cofre.timezone || "America/Argentina/Buenos_Aires");
  const timing = birthdayOccurrence(date.event_date, today);
  const { data: campaignId, error: campaignError } = await db.rpc("ensure_occasion_campaign_secure", {
    p_important_date_id: date.id,
    p_occurs_on: timing.occursOn,
    p_milestone_value: timing.milestone,
    p_surprise_mode: false,
  });
  if (campaignError) throw new Error(campaignError.message);
  return { db, date, campaignId: String(campaignId), ...timing };
}

export async function prepareBirthday(fd: FormData) {
  const cofreId = text(fd, "cofreId", 64);
  const dateId = text(fd, "dateId", 64);
  await ensureCampaign(cofreId, dateId);
  revalidatePath(`/c/${cofreId}`);
  revalidatePath(`/c/${cofreId}/dates/${dateId}`);
  revalidatePath(`/c/${cofreId}/notifications`);
}

export async function createBirthdayGift(fd: FormData) {
  const cofreId = text(fd, "cofreId", 64);
  const dateId = text(fd, "dateId", 64);
  const prepared = await ensureCampaign(cofreId, dateId);
  if (!prepared.date.person_id) redirect(`/c/${cofreId}/people`);
  const { db, userId } = await getCofre(cofreId);

  const { data: person } = await db
    .from("people")
    .select("id,first_name,last_name,display_name")
    .eq("id", prepared.date.person_id)
    .eq("cofre_id", cofreId)
    .single();
  if (!person) redirect(`/c/${cofreId}/people`);
  const name = person.display_name || [person.first_name, person.last_name].filter(Boolean).join(" ") || "alguien especial";
  const horizon = prepared.days <= 7 ? "week" : prepared.days <= 31 ? "month" : "no_rush";

  const { data: existing } = await db
    .from("projects")
    .select("id")
    .eq("cofre_id", cofreId)
    .eq("kind", "gift")
    .eq("occasion_campaign_id", prepared.campaignId)
    .is("deleted_at", null)
    .not("status", "in", "(completed,archived,cancelled)")
    .limit(1)
    .maybeSingle();

  let projectId = existing?.id as string | undefined;
  if (!projectId) {
    const { data, error } = await db.rpc("create_gift_project_secure", {
      p_cofre_id: cofreId,
      p_title: `Regalo de cumpleaños para ${name}`,
      p_target_person_id: person.id,
      p_occasion_campaign_id: prepared.campaignId,
      p_budget_level: "unspecified",
      p_time_horizon: horizon,
      p_surprise_mode: true,
      p_target_date: `${prepared.occursOn}T15:00:00Z`,
    });
    if (error) throw new Error(error.message);
    projectId = String(data);
  }

  const { count } = await db.from("gift_ideas").select("id", { count: "exact", head: true }).eq("gift_project_id", projectId);
  if (!count) {
    const [{ data: prefs }, { data: wishes }] = await Promise.all([
      db.from("person_preferences").select("label,category,sentiment").eq("person_id", person.id).eq("cofre_id", cofreId).is("deleted_at", null).limit(5),
      db.from("person_wishes").select("text,category").eq("person_id", person.id).eq("cofre_id", cofreId).is("deleted_at", null).limit(5),
    ]);
    const preference = prefs?.find((p: any) => p.sentiment === "love" || p.sentiment === "like")?.label;
    const wish = wishes?.[0]?.text;
    const ideas = [
      {
        title: preference ? `Algo inspirado en ${preference}` : `Un detalle pensado para ${name}`,
        description: preference ? `Usar “${preference}” como pista principal y elegir algo que conecte con sus gustos reales.` : "Elegir un objeto pequeño pero personal, acompañado por una dedicatoria que explique por qué fue elegido.",
        idea_type: "gift",
        cost_level: "medium",
        difficulty: "easy",
      },
      {
        title: wish ? `Hacer realidad: ${wish.slice(0, 80)}` : "Una experiencia para compartir",
        description: wish ? `Tomar este deseo guardado en el Cofre como punto de partida: “${wish}”.` : "Preparar una salida o experiencia compartida y guardar después las fotos y la historia dentro del Cofre.",
        idea_type: "experience",
        cost_level: "special",
        difficulty: "medium",
      },
      {
        title: "Álbum + carta personal",
        description: "Reunir recuerdos y fotos vinculados a esta persona y acompañarlos con una carta. El álbum automático se completa en el siguiente bloque del motor.",
        idea_type: "memory",
        cost_level: "free",
        difficulty: "easy",
      },
    ];
    const { error: ideaError } = await db.from("gift_ideas").insert(ideas.map((idea) => ({
      ...idea,
      cofre_id: cofreId,
      gift_project_id: projectId,
      estimated_days: Math.max(1, Math.min(prepared.days || 1, 14)),
      generated_by: "system",
      created_by: userId,
      status: "proposed",
      metadata: { source: "birthday_engine_r05_1", person_id: person.id, birthday_date_id: dateId },
    })));
    if (ideaError) throw new Error(ideaError.message);
  }

  revalidatePath(`/c/${cofreId}`);
  revalidatePath(`/c/${cofreId}/projects`);
  redirect(`/c/${cofreId}/projects/${projectId}`);
}
