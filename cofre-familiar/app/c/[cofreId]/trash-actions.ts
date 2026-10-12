"use server";
import { revalidatePath } from "next/cache";
import { getCofre } from "@/lib/cofre";
function t(fd:FormData,key:string,max=100){return String(fd.get(key)||"").trim().slice(0,max)}
const allowed=new Set(["memory","person","date","dream","project"]);
export async function trashItem(fd:FormData){const cofreId=t(fd,"cofreId",64),entityType=t(fd,"entityType",20),entityId=t(fd,"entityId",64);if(!allowed.has(entityType))throw new Error("Tipo no soportado");const{db}=await getCofre(cofreId);const{error}=await db.rpc("trash_cofre_item_secure",{p_cofre_id:cofreId,p_entity_type:entityType,p_entity_id:entityId});if(error)throw new Error(error.message);revalidateAll(cofreId)}
export async function restoreItem(fd:FormData){const cofreId=t(fd,"cofreId",64),entityType=t(fd,"entityType",20),entityId=t(fd,"entityId",64);if(!allowed.has(entityType))throw new Error("Tipo no soportado");const{db}=await getCofre(cofreId);const{error}=await db.rpc("restore_cofre_item_secure",{p_cofre_id:cofreId,p_entity_type:entityType,p_entity_id:entityId});if(error)throw new Error(error.message);revalidateAll(cofreId)}
function revalidateAll(id:string){for(const p of ["","/memories","/people","/dates","/dreams","/projects","/trash"])revalidatePath(`/c/${id}${p}`)}
