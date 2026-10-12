import Link from "next/link";
import { Card, PageHeader, Stat } from "@/components/ui";
import { getCofre } from "@/lib/cofre";

async function count(db: any, table: string, cofreId: string) {
  const { count } = await db.from(table).select("*", { count: "exact", head: true }).eq("cofre_id", cofreId);
  return count ?? 0;
}
export default async function CofreHome({ params }: { params: Promise<{cofreId:string}> }) {
  const { cofreId } = await params; const { db, cofre } = await getCofre(cofreId);
  const [memories, people, dates, dreams] = await Promise.all([count(db,"memories",cofreId),count(db,"people",cofreId),count(db,"important_dates",cofreId),count(db,"dreams",cofreId)]);
  const { data: recent } = await db.from("memories").select("id,title,story,memory_date,memory_type").eq("cofre_id",cofreId).is("deleted_at",null).order("created_at",{ascending:false}).limit(5);
  return <><PageHeader eyebrow="TU ESPACIO" title={cofre.name} text={cofre.tagline || "Todo lo importante, sin ruido."} />
    <div className="stats-grid"><Stat value={memories} label="Recuerdos" href={`/c/${cofreId}/memories`}/><Stat value={people} label="Personas" href={`/c/${cofreId}/people`}/><Stat value={dates} label="Fechas" href={`/c/${cofreId}/dates`}/><Stat value={dreams} label="Sueños" href={`/c/${cofreId}/dreams`}/></div>
    <div className="two-col"><Card><div className="section-title"><h2>Últimos recuerdos</h2><Link href={`/c/${cofreId}/memories`}>Ver todos</Link></div>{recent?.length ? <div className="simple-list">{recent.map((m:any)=><article key={m.id}><small>{m.memory_date || "Sin fecha"} · {m.memory_type}</small><b>{m.title}</b><p>{m.story || ""}</p></article>)}</div> : <p className="muted">Todavía no guardaste recuerdos.</p>}</Card>
    <Card><h2>Guardar algo hoy</h2><p className="muted">Sumá un recuerdo, una persona importante o algo que quieras preparar para el futuro.</p><div className="quick-links"><Link href={`/c/${cofreId}/memories`}>+ Recuerdo</Link><Link href={`/c/${cofreId}/people`}>+ Persona</Link><Link href={`/c/${cofreId}/letters`}>+ Carta</Link><Link href={`/c/${cofreId}/capsules`}>+ Cápsula</Link></div></Card></div>
  </>;
}
