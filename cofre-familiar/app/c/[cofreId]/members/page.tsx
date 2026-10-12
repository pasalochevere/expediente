import{PageHeader,Card,Empty}from"@/components/ui";import{InvitationForm}from"@/components/invitation-form";import{getCofre}from"@/lib/cofre";import{revokeInvitation}from"../actions";

export default async function Page({params}:{params:Promise<{cofreId:string}>}){
  const{cofreId}=await params;const{db,userId}=await getCofre(cofreId);
  const[{data:members},{data:me}]=await Promise.all([
    db.from("cofre_members").select("id,user_id,role,status,joined_at,created_at").eq("cofre_id",cofreId).order("created_at"),
    db.from("cofre_members").select("role,status").eq("cofre_id",cofreId).eq("user_id",userId).maybeSingle()
  ]);
  const ids=(members||[]).map((m:any)=>m.user_id);const{data:profiles}=ids.length?await db.from("profiles").select("id,display_name").in("id",ids):{data:[] as any[]};const names=new Map((profiles||[]).map((p:any)=>[p.id,p.display_name]));
  const role=String(me?.role||"member");const canManage=role==="owner"||role==="admin";const canInviteAdmin=role==="owner";
  const{data:invitations}=canManage?await db.from("invitations").select("id,email,role,status,expires_at,accepted_at,created_at").eq("cofre_id",cofreId).order("created_at",{ascending:false}).limit(30):{data:[] as any[]};
  return <><PageHeader eyebrow="ACCESO" title="Miembros" text="Quiénes forman parte del cofre, qué rol tienen y cómo invitás a alguien nuevo."/>
    {members?.length?<div className="person-grid">{members.map((m:any)=><Card key={m.id}><div className="avatar">{String(names.get(m.user_id)||"?").slice(0,1).toUpperCase()}</div><h3>{names.get(m.user_id)||"Miembro"}</h3><small>{labelRole(m.role)} · {labelStatus(m.status)}</small><p className="muted">{m.joined_at?`Desde ${new Date(m.joined_at).toLocaleDateString("es-AR")}`:"Invitación pendiente"}</p></Card>)}</div>:<Empty title="No hay miembros visibles" text="El propietario del cofre debería aparecer acá."/>}
    {canManage&&<Card><h2>Invitar a alguien</h2><p className="muted">Generá un enlace seguro. Podés ligarlo a un email o dejarlo abierto para compartirlo por WhatsApp.</p><InvitationForm cofreId={cofreId} canInviteAdmin={canInviteAdmin}/></Card>}
    {canManage&&<Card><div className="section-title"><h2>Invitaciones recientes</h2><span className="muted">{invitations?.length||0}</span></div>{invitations?.length?<div className="simple-list">{invitations.map((i:any)=><article key={i.id} className="invite-row"><div><small>{labelStatus(i.status)} · {labelRole(i.role)}</small><b>{i.email||"Enlace abierto"}</b><p>Creada {new Date(i.created_at).toLocaleString("es-AR")} · vence {new Date(i.expires_at).toLocaleString("es-AR")}{i.accepted_at?` · aceptada ${new Date(i.accepted_at).toLocaleString("es-AR")}`:""}</p></div>{i.status==="pending"&&new Date(i.expires_at)>new Date()&&<form action={revokeInvitation}><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="invitationId" value={i.id}/><button className="secondary" type="submit">Revocar</button></form>}</article>)}</div>:<Empty title="Todavía no hay invitaciones" text="Creá una arriba y el enlace aparecerá una sola vez para copiarlo."/>}</Card>}
    {!canManage&&<Card><h2>Invitaciones</h2><p className="muted">Sólo propietarios y administradores pueden generar invitaciones.</p></Card>}
  </>;
}
function labelRole(v:string){return v==="owner"?"PROPIETARIO":v==="admin"?"ADMINISTRADOR":"MIEMBRO"}
function labelStatus(v:string){return v==="active"?"ACTIVO":v==="pending"?"PENDIENTE":v==="accepted"?"ACEPTADA":v==="revoked"?"REVOCADA":v==="expired"?"VENCIDA":v.toUpperCase()}
