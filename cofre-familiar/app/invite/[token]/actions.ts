"use server";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
export async function acceptInvitation(fd:FormData){const token=String(fd.get("token")||"");const{supabase}=await requireUser();const{data,error}=await supabase.schema("cofre").rpc("accept_cofre_invitation",{p_raw_token:token});if(error)throw new Error(error.message);const cofreId=Array.isArray(data)?data[0]?.cofre_id:(data as any)?.cofre_id;redirect(cofreId?`/c/${cofreId}`:"/select")}
