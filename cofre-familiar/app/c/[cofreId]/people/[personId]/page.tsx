import Link from "next/link";
import { notFound } from "next/navigation";
import { getCofre } from "@/lib/cofre";
import { addPersonPreference, addPersonWish, removePersonIntel, updatePersonProfile } from "../profile-actions";

const categoryNames: Record<string,string> = { interest:"Interés", hobby:"Hobby", food:"Comida", place:"Lugar", size:"Talle / medida", style:"Estilo", other:"Otro" };

export default async function PersonProfilePage({ params }: { params: Promise<{ cofreId: string; personId: string }> }) {
  const { cofreId, personId } = await params;
  const { db } = await getCofre(cofreId);
  const { data: person } = await db.from("people").select("id,first_name,last_name,display_name,birth_date,relationship_label,bio,created_by").eq("id", personId).eq("cofre_id", cofreId).is("deleted_at", null).maybeSingle();
  if (!person) notFound();
  const [{ data: contacts }, { data: sources }, { data: prefs }, { data: wishes }] = await Promise.all([
    db.from("person_contact_methods").select("id,kind,label,value,source_type,is_primary").eq("person_id", personId).eq("cofre_id", cofreId).order("kind"),
    db.from("person_external_profiles").select("id,provider,source_label,profile_url,source_updated_at").eq("person_id", personId).eq("cofre_id", cofreId).order("provider"),
    db.from("person_preferences").select("id,category,label,sentiment,source_type").eq("person_id", personId).eq("cofre_id", cofreId).is("deleted_at", null).order("created_at", { ascending: false }),
    db.from("person_wishes").select("id,text,category,status,source_type").eq("person_id", personId).eq("cofre_id", cofreId).is("deleted_at", null).order("created_at", { ascending: false }),
  ]);
  const name = person.display_name || [person.first_name, person.last_name].filter(Boolean).join(" ");
  const likes = (prefs || []).filter((p:any) => p.sentiment !== "negative");
  const dislikes = (prefs || []).filter((p:any) => p.sentiment === "negative");
  return <div className="person-profile-page">
    <Link className="occasion-back" href={`/c/${cofreId}/people`}>← Volver a Personas</Link>
    <section className="person-profile-hero">
      <div className="person-profile-avatar">{name.slice(0,1).toUpperCase()}</div>
      <div><span>PERFIL VIVO</span><h1>{name}</h1><p>{person.relationship_label || "Persona importante"}{person.birth_date ? ` · 🎂 ${new Date(`${person.birth_date}T12:00:00`).toLocaleDateString("es-AR",{day:"numeric",month:"long",year:"numeric"})}` : ""}</p></div>
      <Link className="occasion-secondary" href={`/c/${cofreId}/projects`}>Ver proyectos</Link>
    </section>

    <section className="person-intel-grid">
      <article className="person-intel-card wide">
        <span>IDENTIDAD</span><h2>Lo básico</h2>
        <form action={updatePersonProfile} className="form-grid"><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="personId" value={personId}/>
          <label>Cómo le dicen<input name="displayName" defaultValue={person.display_name || ""}/></label>
          <label>Vínculo<input name="relationship" defaultValue={person.relationship_label || ""} placeholder="Pareja, amigo, hermana…"/></label>
          <label>Nacimiento<input type="date" name="birthDate" defaultValue={person.birth_date || ""}/></label>
          <label className="full">Sobre esta persona<textarea name="bio" rows={3} defaultValue={person.bio || ""}/></label>
          <button className="occasion-primary" type="submit">Guardar perfil</button>
        </form>
      </article>

      <article className="person-intel-card">
        <span>CONTACTO PRIVADO</span><h2>Agenda</h2>
        {contacts?.length ? <div className="intel-list">{contacts.map((c:any)=><div key={c.id}><b>{c.kind === "email" ? "Email" : "Teléfono"}</b><p>{c.value}</p><small>{c.label || c.source_type}</small></div>)}</div> : <p className="home-muted">Todavía no hay email o teléfono importado para vos.</p>}
        <Link href={`/c/${cofreId}/people/import`}>Importar desde agenda →</Link>
      </article>

      <article className="person-intel-card">
        <span>FUENTES</span><h2>De dónde salió</h2>
        {sources?.length ? <div className="intel-source-list">{sources.map((s:any)=><div key={s.id}><b>{s.provider.toUpperCase()}</b><small>{s.source_label || "Contacto importado"}</small></div>)}</div> : <p className="home-muted">Perfil creado manualmente.</p>}
      </article>

      <article className="person-intel-card wide">
        <span>INTELIGENCIA PARA REGALOS</span><h2>Gustos y datos útiles</h2>
        <form action={addPersonPreference} className="intel-inline-form"><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="personId" value={personId}/>
          <select name="category" defaultValue="interest"><option value="interest">Interés</option><option value="hobby">Hobby</option><option value="food">Comida</option><option value="place">Lugar</option><option value="size">Talle / medida</option><option value="style">Estilo</option><option value="other">Otro</option></select>
          <select name="sentiment" defaultValue="like"><option value="like">Le gusta</option><option value="negative">Evitar / no le gusta</option></select>
          <input name="label" required placeholder="Ej: café de especialidad, running, talle M…"/>
          <button className="occasion-primary" type="submit">Agregar</button>
        </form>
        <div className="profile-chip-groups">
          <div><h3>Le gusta</h3><div className="profile-chips">{likes.length ? likes.map((p:any)=><span key={p.id}><b>{p.label}</b><small>{categoryNames[p.category] || p.category}</small><form action={removePersonIntel}><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="personId" value={personId}/><input type="hidden" name="kind" value="preference"/><input type="hidden" name="itemId" value={p.id}/><button title="Quitar">×</button></form></span>) : <em>Sin datos todavía</em>}</div></div>
          <div><h3>Evitar</h3><div className="profile-chips negative">{dislikes.length ? dislikes.map((p:any)=><span key={p.id}><b>{p.label}</b><small>{categoryNames[p.category] || p.category}</small><form action={removePersonIntel}><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="personId" value={personId}/><input type="hidden" name="kind" value="preference"/><input type="hidden" name="itemId" value={p.id}/><button title="Quitar">×</button></form></span>) : <em>Sin datos todavía</em>}</div></div>
        </div>
      </article>

      <article className="person-intel-card wide">
        <span>DESEOS</span><h2>Ideas que dejó caer</h2>
        <form action={addPersonWish} className="intel-inline-form"><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="personId" value={personId}/><input name="category" placeholder="Categoría: viaje, objeto, experiencia…"/><input name="wish" required placeholder="Ej: quiere conocer Bariloche en invierno"/><button className="occasion-primary" type="submit">Guardar deseo</button></form>
        {wishes?.length ? <div className="wish-list">{wishes.map((w:any)=><article key={w.id}><div><small>{w.category || "Deseo"}</small><b>{w.text}</b></div><form action={removePersonIntel}><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="personId" value={personId}/><input type="hidden" name="kind" value="wish"/><input type="hidden" name="itemId" value={w.id}/><button>Quitar</button></form></article>)}</div> : <p className="home-muted">Todavía no guardaste ningún deseo. Cuando haya uno, el Birthday Engine lo usa para proponer regalos mejores.</p>}
      </article>
    </section>
  </div>;
}
