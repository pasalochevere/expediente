import Link from "next/link";
import { PageHeader, Card, Empty, SubmitButton } from "@/components/ui";
import TrashButton from "@/components/trash-button";
import { getCofre } from "@/lib/cofre";
import { addPerson } from "../actions";

export default async function Page({ params }: { params: Promise<{ cofreId: string }> }) {
  const { cofreId } = await params;
  const { db } = await getCofre(cofreId);
  const { data } = await db.from("people").select("id,first_name,last_name,display_name,birth_date,relationship_label,bio").eq("cofre_id", cofreId).is("deleted_at", null).order("first_name");
  return <>
    <div className="people-page-head">
      <PageHeader eyebrow="QUIÉNES" title="Personas" text="La familia también se cuenta a través de quienes forman parte de ella."/>
      <Link className="occasion-primary people-import-cta" href={`/c/${cofreId}/people/import`}>Importar personas</Link>
    </div>

    <section className="people-intro-strip">
      <div><span>PEOPLE SYNC</span><b>No hace falta cargar a todos a mano.</b><p>Importá una agenda, revisá a quién querés sumar y Cofre combina duplicados sin pisar datos que ya completaste.</p></div>
      <Link href={`/c/${cofreId}/people/import`}>Google · vCard · CSV →</Link>
    </section>

    <Card><h2>Agregar una persona a mano</h2><p className="notice">Si cargás la fecha de nacimiento, Cofre crea su cumpleaños automáticamente y activa el calendario de avisos 30/14/7/3/1/0 días antes.</p><form action={addPerson} className="form-grid"><input type="hidden" name="cofreId" value={cofreId}/><label>Nombre<input name="firstName" required/></label><label>Apellido<input name="lastName"/></label><label>Cómo le dicen<input name="displayName"/></label><label>Vínculo<input name="relationship" placeholder="Abuela, hermano, amiga…"/></label><label>Nacimiento<input type="date" name="birthDate"/></label><label className="full">Sobre esta persona<textarea name="bio" rows={3}/></label><SubmitButton>Agregar persona</SubmitButton></form></Card>

    {data?.length ? <div className="person-grid">{data.map((p: any) => {
      const name = p.display_name || [p.first_name, p.last_name].filter(Boolean).join(" ");
      return <Card key={p.id} className="person-card person-card-r052">
        <Link className="person-card-main" href={`/c/${cofreId}/people/${p.id}`}>
          <div className="avatar">{name.slice(0, 1).toUpperCase()}</div>
          <div><h3>{name}</h3><small>{p.relationship_label || "Persona importante"}</small>{p.birth_date && <p className="person-birthday">🎂 {new Date(`${p.birth_date}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long" })} · avisos automáticos</p>}{p.bio && <p>{p.bio}</p>}<b className="person-open-profile">Abrir perfil vivo →</b></div>
        </Link>
        <TrashButton cofreId={cofreId} entityType="person" entityId={p.id}/>
      </Card>;
    })}</div> : <Empty title="Todavía no agregaron personas" text="Podés sumar una persona manualmente o importar tu agenda y elegir sólo las personas importantes para este Cofre."/>}
  </>;
}
