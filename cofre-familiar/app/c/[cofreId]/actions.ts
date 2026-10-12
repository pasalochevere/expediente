"use server";
import { revalidatePath } from "next/cache";
import { getCofre } from "@/lib/cofre";

function text(fd: FormData, key: string, max = 5000) { return String(fd.get(key) || "").trim().slice(0,max); }
function nullable(v: string) { return v || null; }
function path(id: string, suffix = "") { return `/c/${id}${suffix}`; }

export async function addMemory(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const {db,userId}=await getCofre(cofreId);
  const {error}=await db.from("memories").insert({cofre_id:cofreId,created_by:userId,title:text(fd,"title",160),story:nullable(text(fd,"story",8000)),memory_date:nullable(text(fd,"memoryDate",10)),memory_date_precision:"day",location_text:nullable(text(fd,"location",180)),memory_type:text(fd,"type",30)||"moment",visibility:"members",status:"published"});
  if(error) throw new Error(error.message); revalidatePath(path(cofreId,"/memories")); revalidatePath(path(cofreId));
}
export async function addPerson(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const {db,userId}=await getCofre(cofreId);
  const {error}=await db.from("people").insert({cofre_id:cofreId,created_by:userId,first_name:text(fd,"firstName",80),last_name:nullable(text(fd,"lastName",80)),display_name:nullable(text(fd,"displayName",120)),birth_date:nullable(text(fd,"birthDate",10)),relationship_label:nullable(text(fd,"relationship",80)),bio:nullable(text(fd,"bio",3000))});
  if(error) throw new Error(error.message); revalidatePath(path(cofreId,"/people")); revalidatePath(path(cofreId));
}
export async function addImportantDate(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const {db,userId}=await getCofre(cofreId);
  const {error}=await db.from("important_dates").insert({cofre_id:cofreId,created_by:userId,title:text(fd,"title",160),event_type:text(fd,"type",30)||"custom",event_date:text(fd,"date",10),repeat_rule:fd.get("yearly")?"yearly":"none",reminder_days:[7,1,0],visibility:"members"});
  if(error) throw new Error(error.message); revalidatePath(path(cofreId,"/dates")); revalidatePath(path(cofreId));
}
export async function addDream(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const {db,userId}=await getCofre(cofreId);
  const {error}=await db.from("dreams").insert({cofre_id:cofreId,created_by:userId,title:text(fd,"title",160),description:nullable(text(fd,"description",5000)),target_date:nullable(text(fd,"targetDate",10)),status:"active"});
  if(error) throw new Error(error.message); revalidatePath(path(cofreId,"/dreams")); revalidatePath(path(cofreId));
}
export async function addLetter(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const {db,userId}=await getCofre(cofreId);
  const openMode=text(fd,"openMode",20)||"now"; const openAt=openMode==="date"?nullable(text(fd,"openAt",40)):null;
  const {data:letter,error}=await db.from("letters").insert({cofre_id:cofreId,created_by:userId,title:text(fd,"title",160),open_mode:openMode,open_at:openAt,status:"draft"}).select("id").single();
  if(error) throw new Error(error.message);
  const body=text(fd,"body",16000); if(body){ const {error:bodyError}=await db.from("letter_contents").insert({cofre_id:cofreId,letter_id:letter.id,body}); if(bodyError){await db.from("letters").delete().eq("id",letter.id);throw new Error(bodyError.message);} }
  revalidatePath(path(cofreId,"/letters"));
}
export async function sealLetter(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const letterId=text(fd,"letterId",64); const {db}=await getCofre(cofreId);
  const {error}=await db.rpc("seal_letter",{p_letter_id:letterId}); if(error) throw new Error(error.message); revalidatePath(path(cofreId,"/letters"));
}
export async function addCapsule(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const {db,userId}=await getCofre(cofreId);
  const {error}=await db.from("capsules").insert({cofre_id:cofreId,created_by:userId,title:text(fd,"title",160),description:nullable(text(fd,"description",4000)),open_at:text(fd,"openAt",40),status:"draft",visibility:"selected"});
  if(error) throw new Error(error.message); revalidatePath(path(cofreId,"/capsules"));
}
export async function createGiftProject(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const {db}=await getCofre(cofreId);
  const {error}=await db.rpc("create_gift_project_secure",{p_cofre_id:cofreId,p_title:text(fd,"title",160),p_target_person_id:null,p_occasion_campaign_id:null,p_budget_level:nullable(text(fd,"budget",40)),p_time_horizon:nullable(text(fd,"horizon",80)),p_surprise_mode:Boolean(fd.get("surprise")),p_target_date:nullable(text(fd,"targetDate",40))});
  if(error) throw new Error(error.message); revalidatePath(path(cofreId,"/projects"));
}
export async function updateCofreSettings(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const {db}=await getCofre(cofreId);
  const {error}=await db.rpc("update_cofre_settings_secure",{p_cofre_id:cofreId,p_name:text(fd,"name",80),p_tagline:nullable(text(fd,"tagline",160)),p_start_date:nullable(text(fd,"startDate",10)),p_theme_key:text(fd,"theme",40)||"classic",p_timezone:"America/Argentina/Buenos_Aires",p_default_content_visibility:text(fd,"visibility",20)||"members"});
  if(error) throw new Error(error.message); revalidatePath(path(cofreId,"/settings")); revalidatePath(path(cofreId));
}
export async function markNotificationRead(fd: FormData) {
  const cofreId=text(fd,"cofreId",64); const id=text(fd,"notificationId",64); const {db}=await getCofre(cofreId);
  const {error}=await db.from("notifications").update({read_at:new Date().toISOString()}).eq("id",id); if(error) throw new Error(error.message); revalidatePath(path(cofreId,"/notifications"));
}
