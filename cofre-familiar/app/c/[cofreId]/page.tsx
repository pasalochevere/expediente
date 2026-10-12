import Link from "next/link";
import { getCofre } from "@/lib/cofre";
import { createBirthdayGift, prepareBirthday } from "./birthday-actions";

async function count(db:any,table:string,cofreId:string){const{count}=await db.from(table).select("*",{count:"exact",head:true}).eq("cofre_id",cofreId).is("deleted_at",null);return count??0}

export default async function CofreHome({params}:{params:Promise<{cofreId:string}>}){
  const{cofreId}=await params;
  const{db,cofre}=await getCofre(cofreId);
  const now=new Date();
  const today=localYmd(now,cofre.timezone||"America/Argentina/Buenos_Aires");

  const[memoriesCount,peopleCount,{data:recent},{data:dates},{data:people},{data:capsules},{data:letters},{data:datedMemories}]=await Promise.all([
    count(db,"memories",cofreId),count(db,"people",cofreId),
    db.from("memories").select("id,title,story,memory_date,memory_type").eq("cofre_id",cofreId).is("deleted_at",null).order("created_at",{ascending:false}).limit(4),
    db.from("important_dates").select("id,title,event_type,event_date,repeat_rule,reminder_days,person_id").eq("cofre_id",cofreId).is("deleted_at",null),
    db.from("people").select("id,first_name,last_name,display_name,birth_date,relationship_label,bio").eq("cofre_id",cofreId).is("deleted_at",null),
    db.from("capsules").select("id,title,open_at,status").eq("cofre_id",cofreId).eq("status","sealed").gte("open_at",now.toISOString()).order("open_at").limit(4),
    db.from("letters").select("id,title,open_at,status,open_mode").eq("cofre_id",cofreId).eq("status","sealed").eq("open_mode","date").gte("open_at",now.toISOString()).order("open_at").limit(4),
    db.from("memories").select("id,title,memory_date,memory_type").eq("cofre_id",cofreId).is("deleted_at",null).not("memory_date","is",null).limit(300)
  ]);

  const peopleMap=new Map((people||[]).map((person:any)=>[person.id,person]));
  const upcoming=(dates||[]).map((d:any)=>({...d,...nextOccurrence(d.event_date,d.repeat_rule,today)})).filter((d:any)=>d.next&&d.days>=0).sort((a:any,b:any)=>a.days-b.days);
  const birthdays=upcoming.filter((d:any)=>d.event_type==="birthday").map((d:any)=>{
    const person=peopleMap.get(d.person_id) as any;
    const name=person?.display_name||[person?.first_name,person?.last_name].filter(Boolean).join(" ")||d.title.replace(/^Cumpleaños de\s+/i,"");
    const turning=Number(d.next.slice(0,4))-Number(d.event_date.slice(0,4));
    return{...d,person,name,turning};
  }).slice(0,4);
  const hero=birthdays[0];
  const otherDates=upcoming.filter((d:any)=>d.event_type!=="birthday").slice(0,4);

  const mmdd=today.slice(5),year=Number(today.slice(0,4));
  const anniversaries=(datedMemories||[]).filter((m:any)=>m.memory_date?.slice(5)===mmdd&&Number(m.memory_date.slice(0,4))<year).map((m:any)=>({...m,years:year-Number(m.memory_date.slice(0,4))})).slice(0,4);
  const future=[...(capsules||[]).map((x:any)=>({...x,kind:"Cápsula",href:`/c/${cofreId}/capsules`})),...(letters||[]).map((x:any)=>({...x,kind:"Carta",href:`/c/${cofreId}/letters`}))].sort((a:any,b:any)=>new Date(a.open_at).getTime()-new Date(b.open_at).getTime()).slice(0,4);

  return <div className="emotional-home">
    <header className="home-welcome">
      <div><span className="home-kicker">TU COFRE FAMILIAR</span><h1>{greeting()}.</h1><p>{cofre.tagline||"Tu historia, las personas que querés y lo que viene después."}</p></div>
      <div className="home-small-stats"><span><b>{memoriesCount}</b> recuerdos</span><span><b>{peopleCount}</b> personas</span></div>
    </header>

    {hero ? <section className="birthday-hero">
      <div className="birthday-orbit" aria-hidden="true"><span>{hero.name.slice(0,1).toUpperCase()}</span></div>
      <div className="birthday-hero-copy">
        <span className="birthday-eyebrow">PRÓXIMO CUMPLEAÑOS</span>
        <h2>{hero.days===0?`Hoy cumple ${hero.name}`:hero.days===1?`Mañana cumple ${hero.name}`:`Faltan ${hero.days} días para ${hero.name}`}</h2>
        <p>{formatDate(hero.next)}{hero.turning>0?` · cumple ${hero.turning}`:""}{hero.person?.relationship_label?` · ${hero.person.relationship_label}`:""}</p>
        <div className="birthday-reminders">Avisos: {(hero.reminder_days||[]).map(labelReminder).join(" · ")}</div>
        <div className="birthday-hero-actions">
          <form action={prepareBirthday}><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="dateId" value={hero.id}/><button className="occasion-primary">Preparar cumpleaños</button></form>
          <form action={createBirthdayGift}><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="dateId" value={hero.id}/><button className="occasion-secondary">Generar regalo</button></form>
          <Link className="occasion-link" href={`/c/${cofreId}/dates/${hero.id}`}>Ver todo →</Link>
        </div>
      </div>
      <aside className="birthday-hero-note"><small>COFRE TE ACOMPAÑA</small><b>No hace falta acordarse de todo.</b><p>El motor revisa las fechas y prepara los avisos automáticamente.</p></aside>
    </section> : <section className="home-empty-hero"><span>PRÓXIMOS MOMENTOS</span><h2>¿A quién querés sumar primero?</h2><p>Agregá una persona con su fecha de nacimiento. El Cofre va a crear su cumpleaños, preparar los avisos y empezar a relacionarlo con recuerdos y proyectos.</p><Link href={`/c/${cofreId}/people`}>Agregar persona →</Link></section>}

    {birthdays.length>1&&<section className="home-section"><div className="home-section-head"><div><span>PERSONAS</span><h2>Los próximos cumpleaños</h2></div><Link href={`/c/${cofreId}/dates`}>Ver calendario</Link></div><div className="birthday-row">{birthdays.slice(1).map((birthday:any)=><article className="birthday-mini" key={birthday.id}><div className="birthday-mini-avatar">{birthday.name.slice(0,1).toUpperCase()}</div><div><small>{birthday.days===0?"HOY":birthday.days===1?"MAÑANA":`EN ${birthday.days} DÍAS`}</small><h3>{birthday.name}</h3><p>{birthday.turning>0?`Cumple ${birthday.turning} · `:""}{formatDate(birthday.next)}</p><Link href={`/c/${cofreId}/dates/${birthday.id}`}>Preparar →</Link></div></article>)}</div></section>}

    <div className="home-story-grid">
      <section className="home-section home-story-card">
        <div className="home-section-head"><div><span>MEMORIA</span><h2>{anniversaries.length?"Hoy en tu historia":"Últimos recuerdos"}</h2></div><Link href={`/c/${cofreId}/history`}>Historia</Link></div>
        {anniversaries.length?<div className="home-memory-list">{anniversaries.map((m:any)=><article key={m.id}><small>HACE {m.years} {m.years===1?"AÑO":"AÑOS"}</small><h3>{m.title}</h3><p>{m.memory_type}</p></article>)}</div>:recent?.length?<div className="home-memory-list">{recent.map((m:any)=><article key={m.id}><small>{m.memory_date?formatDate(m.memory_date):"RECIENTE"}</small><h3>{m.title}</h3>{m.story&&<p>{m.story}</p>}</article>)}</div>:<p className="home-muted">Todavía no guardaste recuerdos. El primero puede ser una foto, una historia o simplemente algo que no quieras perder.</p>}
        <Link className="home-inline-action" href={`/c/${cofreId}/memories`}>Guardar un recuerdo →</Link>
      </section>

      <section className="home-section home-future-card">
        <div className="home-section-head"><div><span>FUTURO</span><h2>Lo que espera su momento</h2></div></div>
        {future.length?<div className="home-future-list">{future.map((item:any)=><Link href={item.href} key={`${item.kind}-${item.id}`}><small>{item.kind.toUpperCase()}</small><b>{item.title}</b><span>{new Date(item.open_at).toLocaleDateString("es-AR",{day:"numeric",month:"long"})}</span></Link>)}</div>:<p className="home-muted">No hay cartas o cápsulas esperando. Podés escribir algo para abrir más adelante.</p>}
        <div className="home-dual-actions"><Link href={`/c/${cofreId}/letters`}>Escribir carta</Link><Link href={`/c/${cofreId}/capsules`}>Crear cápsula</Link></div>
      </section>
    </div>

    {otherDates.length>0&&<section className="home-section"><div className="home-section-head"><div><span>CALENDARIO EMOCIONAL</span><h2>También se acerca</h2></div><Link href={`/c/${cofreId}/dates`}>Todas las fechas</Link></div><div className="date-ribbon">{otherDates.map((d:any)=><article key={d.id}><small>{d.days===0?"HOY":d.days===1?"MAÑANA":`EN ${d.days} DÍAS`}</small><b>{d.title}</b><span>{formatDate(d.next)}</span></article>)}</div></section>}

    <section className="home-quiet-actions"><p>¿Qué querés cuidar hoy?</p><div><Link href={`/c/${cofreId}/media`}>Fotos</Link><Link href={`/c/${cofreId}/people`}>Personas</Link><Link href={`/c/${cofreId}/dreams`}>Sueños</Link><Link href={`/c/${cofreId}/projects`}>Proyectos</Link><Link href={`/c/${cofreId}/notifications`}>Avisos</Link></div></section>
  </div>;
}

function greeting(){const hour=new Date().getHours();return hour<12?"Buen día":hour<19?"Buenas tardes":"Buenas noches"}
function localYmd(date:Date,timeZone:string){const parts=new Intl.DateTimeFormat("en-US",{timeZone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date);const get=(x:string)=>parts.find(p=>p.type===x)?.value||"";return`${get("year")}-${get("month")}-${get("day")}`}
function nextOccurrence(eventDate:string,repeatRule:string,today:string){if(!eventDate)return{next:null,days:-1};let candidate=eventDate;if(repeatRule==="yearly"){let year=Number(today.slice(0,4));const month=Number(eventDate.slice(5,7)),day=Number(eventDate.slice(8,10));candidate=safeDate(year,month,day);if(daysBetween(today,candidate)<0)candidate=safeDate(++year,month,day)}const days=daysBetween(today,candidate);return{next:candidate,days}}
function safeDate(year:number,month:number,day:number){const last=new Date(Date.UTC(year,month,0)).getUTCDate();return`${year}-${String(month).padStart(2,"0")}-${String(Math.min(day,last)).padStart(2,"0")}`}
function daysBetween(a:string,b:string){const A=Date.UTC(Number(a.slice(0,4)),Number(a.slice(5,7))-1,Number(a.slice(8,10))),B=Date.UTC(Number(b.slice(0,4)),Number(b.slice(5,7))-1,Number(b.slice(8,10)));return Math.round((B-A)/86400000)}
function formatDate(v:string){return new Date(`${v}T12:00:00`).toLocaleDateString("es-AR",{day:"numeric",month:"long",year:"numeric"})}
function labelReminder(v:number){return v===0?"hoy":v===1?"1 día":`${v} días`}
