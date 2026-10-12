import Link from "next/link";
import { notFound } from "next/navigation";
import { getCofre } from "@/lib/cofre";
import { createBirthdayGift, prepareBirthday } from "../../birthday-actions";

export default async function BirthdayDetail({ params }: { params: Promise<{ cofreId: string; dateId: string }> }) {
  const { cofreId, dateId } = await params;
  const { db, cofre } = await getCofre(cofreId);
  const { data: date } = await db
    .from("important_dates")
    .select("id,title,event_type,event_date,repeat_rule,reminder_days,person_id")
    .eq("id", dateId)
    .eq("cofre_id", cofreId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!date) notFound();

  const today = localYmd(new Date(), cofre.timezone || "America/Argentina/Buenos_Aires");
  const timing = nextOccurrence(date.event_date, date.repeat_rule, today);
  const turning = date.event_type === "birthday" ? Number(timing.next.slice(0, 4)) - Number(date.event_date.slice(0, 4)) : null;

  const personPromise = date.person_id
    ? db.from("people").select("id,first_name,last_name,display_name,birth_date,relationship_label,bio,avatar_media_id").eq("id", date.person_id).eq("cofre_id", cofreId).maybeSingle()
    : Promise.resolve({ data: null } as any);
  const memoryLinksPromise = date.person_id
    ? db.from("memory_people").select("memory_id").eq("cofre_id", cofreId).eq("person_id", date.person_id).limit(80)
    : Promise.resolve({ data: [] } as any);
  const [{ data: person }, { data: memoryLinks }] = await Promise.all([personPromise, memoryLinksPromise]);

  const memoryIds = Array.from(new Set((memoryLinks || []).map((row: any) => row.memory_id))).slice(0, 40);
  const { data: memories } = memoryIds.length
    ? await db.from("memories").select("id,title,story,memory_date,memory_type").eq("cofre_id", cofreId).in("id", memoryIds).is("deleted_at", null).order("memory_date", { ascending: false }).limit(6)
    : { data: [] as any[] };

  let campaign: any = null;
  let project: any = null;
  const { data: instance } = await db
    .from("occasion_instances")
    .select("id,milestone_value,status")
    .eq("cofre_id", cofreId)
    .eq("important_date_id", dateId)
    .eq("occurs_on", timing.next)
    .maybeSingle();
  if (instance) {
    const { data } = await db.from("occasion_campaigns").select("id,status,surprise_mode,starts_at,ends_at").eq("cofre_id", cofreId).eq("occasion_instance_id", instance.id).maybeSingle();
    campaign = data;
    if (campaign) {
      const { data: projects } = await db.from("projects").select("id,title,kind,status").eq("cofre_id", cofreId).eq("occasion_campaign_id", campaign.id).is("deleted_at", null).order("created_at", { ascending: false }).limit(4);
      project = projects?.[0] || null;
    }
  }

  const name = person?.display_name || [person?.first_name, person?.last_name].filter(Boolean).join(" ") || date.title.replace(/^Cumpleaños de\s+/i, "") || "Alguien especial";
  const isBirthday = date.event_type === "birthday";
  const reminderText = (date.reminder_days || []).map(labelReminder).join(" · ");

  return <div className="occasion-page">
    <Link className="occasion-back" href={`/c/${cofreId}`}>← Volver al Cofre</Link>
    <section className="occasion-hero">
      <div className="occasion-person-mark" aria-hidden="true">{name.slice(0, 1).toUpperCase()}</div>
      <div className="occasion-hero-copy">
        <span className="occasion-kicker">{isBirthday ? "CUMPLEAÑOS" : date.event_type.toUpperCase()}</span>
        <h1>{name}</h1>
        <p className="occasion-countdown">{countdown(timing.days)}</p>
        <p className="occasion-date">{formatDate(timing.next)}{turning && turning > 0 ? ` · cumple ${turning}` : ""}</p>
        {person?.relationship_label && <p className="occasion-relation">{person.relationship_label}</p>}
      </div>
      <div className="occasion-status">
        <span>Preparación</span>
        <b>{campaign ? campaignLabel(campaign.status) : "Todavía no empezada"}</b>
      </div>
    </section>

    {isBirthday && <section className="occasion-action-strip">
      <div><small>COFRE TE AYUDA A PREPARARLO</small><h2>Que la fecha no llegue de sorpresa.</h2><p>Activá la preparación para reunir recuerdos, ideas y proyectos alrededor de {name}.</p></div>
      <div className="occasion-actions">
        {!campaign && <form action={prepareBirthday}><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="dateId" value={dateId}/><button className="occasion-primary">Preparar cumpleaños</button></form>}
        <form action={createBirthdayGift}><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="dateId" value={dateId}/><button className="occasion-secondary">Generar ideas de regalo</button></form>
        {project && <Link className="occasion-link" href={`/c/${cofreId}/projects/${project.id}`}>Continuar proyecto →</Link>}
      </div>
    </section>}

    <div className="occasion-grid">
      <section className="occasion-panel">
        <div className="occasion-panel-head"><div><small>MEMORIA</small><h2>Recuerdos con {name}</h2></div><span>{memories?.length || 0} visibles</span></div>
        {memories?.length ? <div className="occasion-memory-list">{memories.map((memory: any) => <article key={memory.id}><time>{memory.memory_date ? formatDate(memory.memory_date) : "Sin fecha"}</time><h3>{memory.title}</h3>{memory.story && <p>{memory.story}</p>}</article>)}</div> : <div className="occasion-empty"><b>Todavía no hay recuerdos vinculados.</b><p>Cuando relaciones recuerdos con esta persona, aparecerán acá para preparar cumpleaños, álbumes y regalos más personales.</p><Link href={`/c/${cofreId}/memories`}>Ir a Recuerdos →</Link></div>}
      </section>

      <aside className="occasion-side">
        <section className="occasion-panel compact"><small>AVISOS</small><h2>Te vamos a avisar</h2><p>{reminderText || "El mismo día."}</p><p className="occasion-note">El escaneo automático del Cofre corre todos los días y respeta tus preferencias de notificación.</p><Link href={`/c/${cofreId}/notifications`}>Ver notificaciones</Link></section>
        <section className="occasion-panel compact"><small>IDEAS</small><h2>Preparar algo especial</h2><div className="occasion-idea-list"><span><b>Regalo</b><em>3 ideas iniciales usando gustos y deseos guardados.</em></span><span><b>Álbum</b><em>El motor automático de selección de fotos entra en R05.3.</em></span><span><b>Experiencia</b><em>Convertí una salida o plan en proyecto compartido.</em></span></div></section>
        {person?.bio && <section className="occasion-panel compact"><small>SOBRE {name.toUpperCase()}</small><p>{person.bio}</p></section>}
      </aside>
    </div>
  </div>;
}

function localYmd(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const get = (x: string) => parts.find((p) => p.type === x)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
function nextOccurrence(eventDate: string, repeatRule: string, today: string) {
  if (!eventDate) return { next: today, days: 0 };
  let candidate = eventDate;
  if (repeatRule === "yearly") {
    let year = Number(today.slice(0, 4));
    const month = Number(eventDate.slice(5, 7));
    const day = Number(eventDate.slice(8, 10));
    candidate = safeDate(year, month, day);
    if (daysBetween(today, candidate) < 0) candidate = safeDate(++year, month, day);
  }
  return { next: candidate, days: daysBetween(today, candidate) };
}
function safeDate(year: number, month: number, day: number) { const last = new Date(Date.UTC(year, month, 0)).getUTCDate(); return `${year}-${String(month).padStart(2,"0")}-${String(Math.min(day,last)).padStart(2,"0")}`; }
function daysBetween(a: string, b: string) { const A=Date.UTC(Number(a.slice(0,4)),Number(a.slice(5,7))-1,Number(a.slice(8,10))),B=Date.UTC(Number(b.slice(0,4)),Number(b.slice(5,7))-1,Number(b.slice(8,10)));return Math.round((B-A)/86400000); }
function formatDate(v: string) { return new Date(`${v}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }); }
function countdown(days: number) { if (days === 0) return "Es hoy"; if (days === 1) return "Es mañana"; return `Faltan ${days} días`; }
function labelReminder(value: number) { if(value===0)return "el mismo día"; if(value===1)return "1 día antes"; return `${value} días antes`; }
function campaignLabel(status: string) { const map: Record<string,string>={suggested:"Lista para empezar",active:"En preparación",planning:"Planificando",collecting:"Juntando aportes",creating:"Creando",reviewing:"Revisando",ready:"Lista",snoozed:"Pausada",completed:"Completada"}; return map[status] || status; }
