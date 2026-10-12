"use server";
import { revalidatePath } from "next/cache";
import { getCofre } from "@/lib/cofre";

function t(fd:FormData,key:string,max=5000){return String(fd.get(key)||"").trim().slice(0,max)}
function n(v:string){return v||null}
function parseRecipient(v:string){if(v.startsWith("person:"))return{recipient_person_id:v.slice(7),recipient_user_id:null};if(v.startsWith("user:"))return{recipient_person_id:null,recipient_user_id:v.slice(5)};return{recipient_person_id:null,recipient_user_id:null}}
function path(id:string,suffix:string){return `/c/${id}${suffix}`}

export async function createLetterComplete(fd:FormData){
  const cofreId=t(fd,"cofreId",64);const{db,userId}=await getCofre(cofreId);
  const mode=t(fd,"openMode",20);const openMode=["now","date","manual"].includes(mode)?mode:"now";const openAt=openMode==="date"?n(t(fd,"openAt",40)):null;const recipient=parseRecipient(t(fd,"recipient",100));
  const{data:letter,error}=await db.from("letters").insert({cofre_id:cofreId,created_by:userId,title:t(fd,"title",160),open_mode:openMode,open_at:openAt,status:"draft",...recipient}).select("id").single();
  if(error)throw new Error(error.message);
  const body=t(fd,"body",16000);if(body){const{error:e}=await db.from("letter_contents").insert({cofre_id:cofreId,letter_id:letter.id,body});if(e){await db.from("letters").delete().eq("id",letter.id);throw new Error(e.message)}}
  const mediaId=t(fd,"mediaId",64);if(mediaId){const{error:e}=await db.from("letter_media").insert({cofre_id:cofreId,letter_id:letter.id,media_id:mediaId,position:0});if(e&&e.code!=="23505")throw new Error(e.message)}
  revalidatePath(path(cofreId,"/letters"));
}
export async function attachLetterMedia(fd:FormData){const cofreId=t(fd,"cofreId",64),letterId=t(fd,"letterId",64),mediaId=t(fd,"mediaId",64);const{db}=await getCofre(cofreId);if(!mediaId)return;const{error}=await db.from("letter_media").insert({cofre_id:cofreId,letter_id:letterId,media_id:mediaId,position:0});if(error&&error.code!=="23505")throw new Error(error.message);revalidatePath(path(cofreId,"/letters"))}
export async function openLetterAction(fd:FormData){const cofreId=t(fd,"cofreId",64),letterId=t(fd,"letterId",64);const{db}=await getCofre(cofreId);const{error}=await db.rpc("open_letter",{p_letter_id:letterId});if(error)throw new Error(error.message);revalidatePath(path(cofreId,"/letters"))}

export async function createCapsuleComplete(fd:FormData){
  const cofreId=t(fd,"cofreId",64);const{db,userId}=await getCofre(cofreId);const visibility=t(fd,"visibility",20);const safeVisibility=["members","selected","private"].includes(visibility)?visibility:"selected";
  const{data:capsule,error}=await db.from("capsules").insert({cofre_id:cofreId,created_by:userId,title:t(fd,"title",160),description:n(t(fd,"description",4000)),open_at:t(fd,"openAt",40),status:"draft",visibility:safeVisibility}).select("id").single();if(error)throw new Error(error.message);
  try{
    const initial=t(fd,"initialText",8000);if(initial){const{error:e}=await db.from("capsule_items").insert({cofre_id:cofreId,capsule_id:capsule.id,item_type:"text",text_content:initial,position:0});if(e)throw e}
    const recipient=parseRecipient(t(fd,"recipient",100));if(recipient.recipient_person_id||recipient.recipient_user_id){const{error:e}=await db.from("capsule_recipients").insert({cofre_id:cofreId,capsule_id:capsule.id,person_id:recipient.recipient_person_id,user_id:recipient.recipient_user_id});if(e)throw e}
  }catch(e:any){await db.from("capsules").delete().eq("id",capsule.id);throw new Error(e?.message||"No se pudo crear la cápsula")}
  revalidatePath(path(cofreId,"/capsules"));
}
export async function addCapsuleTextItem(fd:FormData){const cofreId=t(fd,"cofreId",64),capsuleId=t(fd,"capsuleId",64),content=t(fd,"content",8000);if(!content)return;const{db}=await getCofre(cofreId);const{error}=await db.from("capsule_items").insert({cofre_id:cofreId,capsule_id:capsuleId,item_type:"text",text_content:content,position:0});if(error)throw new Error(error.message);revalidatePath(path(cofreId,"/capsules"))}
export async function addCapsuleMediaItem(fd:FormData){const cofreId=t(fd,"cofreId",64),capsuleId=t(fd,"capsuleId",64),mediaId=t(fd,"mediaId",64);if(!mediaId)return;const{db}=await getCofre(cofreId);const{error}=await db.from("capsule_items").insert({cofre_id:cofreId,capsule_id:capsuleId,item_type:"media",media_id:mediaId,position:0});if(error&&error.code!=="23505")throw new Error(error.message);revalidatePath(path(cofreId,"/capsules"))}
export async function addCapsuleLetterItem(fd:FormData){const cofreId=t(fd,"cofreId",64),capsuleId=t(fd,"capsuleId",64),letterId=t(fd,"letterId",64);if(!letterId)return;const{db}=await getCofre(cofreId);const{error}=await db.from("capsule_items").insert({cofre_id:cofreId,capsule_id:capsuleId,item_type:"letter",letter_id:letterId,position:0});if(error&&error.code!=="23505")throw new Error(error.message);revalidatePath(path(cofreId,"/capsules"))}
export async function addCapsuleRecipient(fd:FormData){const cofreId=t(fd,"cofreId",64),capsuleId=t(fd,"capsuleId",64),recipient=parseRecipient(t(fd,"recipient",100));if(!recipient.recipient_person_id&&!recipient.recipient_user_id)return;const{db}=await getCofre(cofreId);const{error}=await db.from("capsule_recipients").insert({cofre_id:cofreId,capsule_id:capsuleId,person_id:recipient.recipient_person_id,user_id:recipient.recipient_user_id});if(error&&error.code!=="23505")throw new Error(error.message);revalidatePath(path(cofreId,"/capsules"))}
export async function removeCapsuleItem(fd:FormData){const cofreId=t(fd,"cofreId",64),itemId=t(fd,"itemId",64);const{db}=await getCofre(cofreId);const{error}=await db.from("capsule_items").delete().eq("id",itemId);if(error)throw new Error(error.message);revalidatePath(path(cofreId,"/capsules"))}
export async function removeCapsuleRecipient(fd:FormData){const cofreId=t(fd,"cofreId",64),recipientId=t(fd,"recipientId",64);const{db}=await getCofre(cofreId);const{error}=await db.from("capsule_recipients").delete().eq("id",recipientId);if(error)throw new Error(error.message);revalidatePath(path(cofreId,"/capsules"))}
export async function sealCapsuleAction(fd:FormData){const cofreId=t(fd,"cofreId",64),capsuleId=t(fd,"capsuleId",64);const{db}=await getCofre(cofreId);const{error}=await db.rpc("seal_capsule",{p_capsule_id:capsuleId});if(error)throw new Error(error.message);revalidatePath(path(cofreId,"/capsules"))}
export async function openCapsuleAction(fd:FormData){const cofreId=t(fd,"cofreId",64),capsuleId=t(fd,"capsuleId",64);const{db}=await getCofre(cofreId);const{error}=await db.rpc("open_capsule",{p_capsule_id:capsuleId});if(error)throw new Error(error.message);revalidatePath(path(cofreId,"/capsules"))}
