"use server";
import { revalidatePath } from "next/cache";
import { getCofre } from "@/lib/cofre";
function t(fd:FormData,key:string,max=500){return String(fd.get(key)||"").trim().slice(0,max)}
function reminderDays(fd:FormData){const allowed=new Set([0,1,3,7,14,30]);return fd.getAll("reminderDays").map(v=>Number(v)).filter(v=>allowed.has(v)).sort((a,b)=>b-a)}
export async function addImportantDateRich(fd:FormData){const cofreId=t(fd,"cofreId",64);const{db,userId}=await getCofre(cofreId);const days=reminderDays(fd);const{error}=await db.from("important_dates").insert({cofre_id:cofreId,created_by:userId,title:t(fd,"title",160),event_type:t(fd,"type",30)||"custom",event_date:t(fd,"date",10),repeat_rule:fd.get("yearly")?"yearly":"none",reminder_days:days,visibility:"members"});if(error)throw new Error(error.message);revalidatePath(`/c/${cofreId}/dates`);revalidatePath(`/c/${cofreId}`)}
export async function updateDateReminders(fd:FormData){const cofreId=t(fd,"cofreId",64),dateId=t(fd,"dateId",64);const{db}=await getCofre(cofreId);const{error}=await db.from("important_dates").update({reminder_days:reminderDays(fd),updated_at:new Date().toISOString()}).eq("id",dateId).eq("cofre_id",cofreId);if(error)throw new Error(error.message);revalidatePath(`/c/${cofreId}/dates`);revalidatePath(`/c/${cofreId}`)}
