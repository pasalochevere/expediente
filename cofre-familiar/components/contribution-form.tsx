"use client";
import { useActionState } from "react";
import { submitContribution, type ContributionState } from "@/app/contribute/[token]/actions";

const initial:ContributionState={ok:false};
export default function ContributionForm({token,request}:{token:string;request:any}){
 const[state,action,pending]=useActionState(submitContribution,initial);if(state.ok)return <div className="notice invite-success"><b>Aporte enviado</b><p>Gracias. El organizador ya puede verlo dentro del proyecto.</p></div>;
 return <form action={action} className="stack contribution-form"><input type="hidden" name="token" value={token}/><input type="hidden" name="requestId" value={request?.id||""}/><input type="hidden" name="submissionType" value={request?.request_type||"message"}/>{request?.prompt&&<><small>{String(request.request_type||"aporte").toUpperCase()}{request.required?" · OBLIGATORIO":""}</small><h3>{request.prompt}</h3></>}<label>Tu nombre<input name="name" placeholder="Opcional"/></label><label>Email<input name="email" type="email" placeholder="Opcional"/></label><label>Tu aporte<textarea name="text" rows={5} required placeholder={placeholder(request?.request_type)}/></label>{state.error&&<div className="notice invite-error">{state.error}</div>}<button className="primary" disabled={pending}>{pending?"Enviando…":"Enviar aporte"}</button></form>
}
function placeholder(type:string){if(type==="memory")return"Contá ese recuerdo…";if(type==="quote")return"Escribí una frase…";if(type==="recipe")return"Compartí la receta…";if(type==="letter")return"Escribí tu carta…";if(["photo","video","audio","document","song"].includes(type))return"Podés dejar una descripción o enlace. La carga directa de archivos se incorpora en el polish de Media.";return"Escribí tu mensaje…"}
