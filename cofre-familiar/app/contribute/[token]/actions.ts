"use server";
import { createPublicSupabase } from "@/lib/public-supabase";

export type ContributionState={ok:boolean;error?:string};
function t(fd:FormData,key:string,max=5000){return String(fd.get(key)||"").trim().slice(0,max)}
export async function submitContribution(_prev:ContributionState,fd:FormData):Promise<ContributionState>{
 try{
  const token=t(fd,"token",500),requestId=t(fd,"requestId",64),submissionType=t(fd,"submissionType",30),text=t(fd,"text",8000),name=t(fd,"name",120),email=t(fd,"email",240);
  const valid=new Set(["photo","video","audio","memory","message","letter","song","document","recipe","quote"]);if(!token||!text)return{ok:false,error:"Completá el aporte antes de enviar."};
  const db=createPublicSupabase().schema("cofre");const{error}=await db.rpc("submit_collaboration_contribution",{p_raw_token:token,p_request_id:requestId||null,p_submission_type:valid.has(submissionType)?submissionType:"message",p_text_content:text,p_media_id:null,p_contributor_name:name||null,p_contributor_email:email||null});if(error)throw new Error(error.message);return{ok:true};
 }catch(e:any){return{ok:false,error:e?.message||"No se pudo enviar el aporte."}}
}
