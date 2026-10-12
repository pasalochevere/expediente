"use client";

import { useActionState, useState } from "react";
import { createInvitation, type InvitationActionState } from "@/app/c/[cofreId]/actions";

const initialState:InvitationActionState={ok:false,message:""};

export function InvitationForm({cofreId,canInviteAdmin}:{cofreId:string;canInviteAdmin:boolean}){
  const[state,action,pending]=useActionState(createInvitation,initialState);
  const[copied,setCopied]=useState(false);
  async function copy(){if(!state.inviteUrl)return;await navigator.clipboard.writeText(state.inviteUrl);setCopied(true);setTimeout(()=>setCopied(false),1800);}
  return <div className="invite-panel">
    <form action={action} className="form-grid">
      <input type="hidden" name="cofreId" value={cofreId}/>
      <label>Email opcional<input name="email" type="email" placeholder="persona@correo.com"/></label>
      <label>Rol<select name="role" defaultValue="member"><option value="member">Miembro</option>{canInviteAdmin&&<option value="admin">Administrador</option>}</select></label>
      <label>Vencimiento<select name="expiresHours" defaultValue="168"><option value="24">24 horas</option><option value="72">3 días</option><option value="168">7 días</option><option value="336">14 días</option><option value="720">30 días</option></select></label>
      <div className="invite-submit"><button className="primary" type="submit" disabled={pending}>{pending?"Generando…":"Crear invitación"}</button></div>
    </form>
    {state.message&&<div className={`notice ${state.ok?"invite-success":"invite-error"}`}><b>{state.ok?"Invitación lista":"No se pudo crear"}</b><p>{state.message}</p>{state.inviteUrl&&<><div className="invite-link"><input readOnly value={state.inviteUrl} aria-label="Enlace de invitación"/><button type="button" className="secondary" onClick={copy}>{copied?"Copiado":"Copiar link"}</button></div>{state.expiresAt&&<small>Vence {new Date(state.expiresAt).toLocaleString("es-AR")}</small>}</>}</div>}
    <p className="muted invite-help">Si dejás el email vacío, cualquiera que tenga el enlace podrá aceptarlo. El enlace crudo se muestra una sola vez y no queda guardado en el navegador.</p>
  </div>;
}
