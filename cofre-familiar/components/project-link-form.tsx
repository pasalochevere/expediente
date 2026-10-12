"use client";
import { useActionState, useState } from "react";
import { createProjectContributionLink, type ProjectLinkState } from "@/app/c/[cofreId]/project-manage-actions";

const initial:ProjectLinkState={ok:false};
export default function ProjectLinkForm({cofreId,projectId}:{cofreId:string;projectId:string}){
 const[state,action,pending]=useActionState(createProjectContributionLink,initial);const[copied,setCopied]=useState(false);
 async function copy(){if(!state.url)return;await navigator.clipboard.writeText(state.url);setCopied(true);setTimeout(()=>setCopied(false),1600)}
 return <div className="invite-panel"><form action={action} className="form-grid"><input type="hidden" name="cofreId" value={cofreId}/><input type="hidden" name="projectId" value={projectId}/><label>Tipo de acceso<select name="purpose" defaultValue="contribute"><option value="contribute">Aportar contenido</option><option value="guest">Invitado</option></select></label><label>Vence<select name="hours" defaultValue="168"><option value="24">24 horas</option><option value="72">3 días</option><option value="168">7 días</option><option value="336">14 días</option><option value="720">30 días</option></select></label><label>Usos máximos<input name="maxUses" type="number" min="1" placeholder="Sin límite"/></label><div className="invite-submit"><button className="primary" disabled={pending}>{pending?"Generando…":"Generar link"}</button></div></form>{state.error&&<div className="notice invite-error">{state.error}</div>}{state.ok&&state.url&&<div className="notice invite-success"><b>Link generado · copialo ahora</b><p>Por seguridad el token crudo no queda guardado y no puede recuperarse después.</p><div className="invite-link"><input readOnly value={state.url}/><button className="secondary" type="button" onClick={copy}>{copied?"Copiado":"Copiar link"}</button></div>{state.expiresAt&&<small>Vence {new Date(state.expiresAt).toLocaleString("es-AR")}</small>}</div>}</div>
}
