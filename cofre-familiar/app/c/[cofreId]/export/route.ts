import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ cofreId: string }> }) {
  const { cofreId } = await params;
  const { supabase } = await requireUser();
  const db = supabase.schema("cofre");

  const { data: cofre, error } = await db
    .from("cofres")
    .select("id,name,type,tagline,start_date,theme_key,timezone,status,created_at,updated_at")
    .eq("id", cofreId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !cofre) return new Response("Cofre no disponible", { status: 404 });

  const q = (table: string, select: string) =>
    db.from(table).select(select).eq("cofre_id", cofreId).is("deleted_at", null);

  const [memories, people, dates, dreams, letters, capsules, projects, media, members] = await Promise.all([
    q("memories", "id,title,story,memory_date,memory_date_precision,location_text,memory_type,visibility,status,created_at,updated_at"),
    q("people", "id,first_name,last_name,display_name,birth_date,relationship_label,bio,created_at,updated_at"),
    q("important_dates", "id,title,event_type,event_date,repeat_rule,reminder_days,visibility,created_at,updated_at"),
    q("dreams", "id,title,description,target_date,status,created_at,updated_at"),
    q("letters", "id,title,recipient_person_id,recipient_user_id,open_mode,open_at,status,opened_at,created_at,updated_at"),
    q("capsules", "id,title,description,open_at,status,visibility,opened_at,created_at,updated_at"),
    q("projects", "id,kind,title,description,status,stage_key,surprise_mode,visibility_mode,target_person_id,target_date,revealed_at,created_at,updated_at"),
    q("media_assets", "id,kind,original_filename,mime_type,size_bytes,width,height,duration_seconds,status,created_at"),
    db.from("cofre_members").select("user_id,role,status,joined_at,created_at").eq("cofre_id", cofreId),
  ]);

  for (const result of [memories, people, dates, dreams, letters, capsules, projects, media, members]) {
    if (result.error) throw new Error(result.error.message);
  }

  const letterIds = (letters.data || []).map((x: any) => x.id);
  const capsuleIds = (capsules.data || []).map((x: any) => x.id);
  const projectIds = (projects.data || []).map((x: any) => x.id);

  const [letterContents, capsuleItems, capsuleRecipients, gifts, experiences, creations, rooms] = await Promise.all([
    letterIds.length
      ? db.from("letter_contents").select("letter_id,body").in("letter_id", letterIds)
      : Promise.resolve({ data: [], error: null }),
    capsuleIds.length
      ? db.from("capsule_items").select("capsule_id,item_type,media_id,letter_id,text_content,position,created_at").in("capsule_id", capsuleIds)
      : Promise.resolve({ data: [], error: null }),
    capsuleIds.length
      ? db.from("capsule_recipients").select("capsule_id,person_id,user_id,created_at").in("capsule_id", capsuleIds)
      : Promise.resolve({ data: [], error: null }),
    projectIds.length
      ? db.from("gift_projects").select("project_id,budget_level,time_horizon").in("project_id", projectIds)
      : Promise.resolve({ data: [], error: null }),
    projectIds.length
      ? db.from("experience_projects").select("project_id,experience_type,budget_level,starts_at,ends_at,location_text,location_type,selected_option_id").in("project_id", projectIds)
      : Promise.resolve({ data: [], error: null }),
    projectIds.length
      ? db.from("creation_projects").select("project_id,creation_type,theme_key,format_key,approved_revision_id").in("project_id", projectIds)
      : Promise.resolve({ data: [], error: null }),
    projectIds.length
      ? db.from("collaboration_rooms").select("project_id,room_type,visibility_mode,contribution_deadline,review_deadline,event_at").in("project_id", projectIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  for (const result of [letterContents, capsuleItems, capsuleRecipients, gifts, experiences, creations, rooms]) {
    if (result.error) throw new Error(result.error.message);
  }

  const { data: exportId, error: exportError } = await db.rpc("record_manifest_export_secure", {
    p_cofre_id: cofreId,
  });
  if (exportError) throw new Error(exportError.message);

  const manifest = {
    format: "cofre-familiar-json-manifest-v1",
    export_id: exportId,
    exported_at: new Date().toISOString(),
    media_binaries_included: false,
    cofre,
    content: {
      memories: memories.data || [],
      people: people.data || [],
      important_dates: dates.data || [],
      dreams: dreams.data || [],
      letters: letters.data || [],
      letter_contents: letterContents.data || [],
      capsules: capsules.data || [],
      capsule_items: capsuleItems.data || [],
      capsule_recipients: capsuleRecipients.data || [],
      projects: projects.data || [],
      gift_projects: gifts.data || [],
      experience_projects: experiences.data || [],
      creation_projects: creations.data || [],
      collaboration_rooms: rooms.data || [],
      media_assets: media.data || [],
      members: members.data || [],
    },
  };

  const safe = String(cofre.name || "cofre")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "cofre";

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safe}-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
