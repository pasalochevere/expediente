"use server";
import { revalidatePath } from "next/cache";
import { getCofre } from "@/lib/cofre";
function t(fd:FormData,key:string,max=50){return String(fd.get(key)||"").trim().slice(0,max)}
export async function updateNotificationPreferences(fd:FormData){
 const cofreId=t(fd,"cofreId",64);const{db,userId}=await getCofre(cofreId);const frequency=t(fd,"frequency",30);const valid=new Set(["high","normal","dates_only","none"]);
 const payload={user_id:userId,cofre_id:cofreId,emotional_frequency:valid.has(frequency)?frequency:"normal",event_notifications:Boolean(fd.get("eventNotifications")),member_activity:Boolean(fd.get("memberActivity")),email_enabled:Boolean(fd.get("emailEnabled")),push_enabled:Boolean(fd.get("pushEnabled")),updated_at:new Date().toISOString()};
 const{error}=await db.from("notification_preferences").upsert(payload,{onConflict:"user_id,cofre_id"});if(error)throw new Error(error.message);revalidatePath(`/c/${cofreId}/notifications`);revalidatePath(`/c/${cofreId}`)
}
