"use server";
import { revalidatePath } from "next/cache";
import { getCofre } from "@/lib/cofre";

function t(fd:FormData,key:string,max=100){return String(fd.get(key)||"").trim().slice(0,max)}

export async function releaseLetterAction(fd:FormData){
  const cofreId=t(fd,"cofreId",64),letterId=t(fd,"letterId",64);
  const{db}=await getCofre(cofreId);
  const{error}=await db.rpc("release_letter",{p_letter_id:letterId});
  if(error)throw new Error(error.message);
  revalidatePath(`/c/${cofreId}/letters`);
}
