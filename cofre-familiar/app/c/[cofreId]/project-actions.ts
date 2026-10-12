"use server";
import { revalidatePath } from "next/cache";
import { getCofre } from "@/lib/cofre";
function t(fd:FormData,key:string,max=5000){return String(fd.get(key)||"").trim().slice(0,max)}
function n(v:string){return v||null}
function person(fd:FormData){const v=t(fd,"targetPersonId",64);return v||null}
function done(id:string){revalidatePath(`/c/${id}/projects`);revalidatePath(`/c/${id}`)}

export async function createGift(fd:FormData){
 const cofreId=t(fd,"cofreId",64);const{db}=await getCofre(cofreId);const budget=t(fd,"budget",30),horizon=t(fd,"horizon",30);const validBudget=new Set(["free","low","medium","special","unspecified"]),validHorizon=new Set(["today","week","month","no_rush"]);const{error}=await db.rpc("create_gift_project_secure",{p_cofre_id:cofreId,p_title:t(fd,"title",160),p_target_person_id:person(fd),p_occasion_campaign_id:null,p_budget_level:validBudget.has(budget)?budget:"unspecified",p_time_horizon:validHorizon.has(horizon)?horizon:null,p_surprise_mode:Boolean(fd.get("surprise")),p_target_date:n(t(fd,"targetDate",40))});if(error)throw new Error(error.message);done(cofreId)
}
export async function createExperience(fd:FormData){
 const cofreId=t(fd,"cofreId",64);const{db}=await getCofre(cofreId);const budget=t(fd,"budget",30),locationType=t(fd,"locationType",30);const validBudget=new Set(["free","low","medium","special","unspecified"]),validLocation=new Set(["home","nearby","out","travel","custom"]);
 const{error}=await db.rpc("create_experience_project_secure",{p_cofre_id:cofreId,p_title:t(fd,"title",160),p_experience_type:t(fd,"experienceType",60)||"custom",p_target_person_id:person(fd),p_occasion_campaign_id:null,p_budget_level:validBudget.has(budget)?budget:"unspecified",p_starts_at:n(t(fd,"startsAt",40)),p_ends_at:n(t(fd,"endsAt",40)),p_location_text:n(t(fd,"location",180)),p_location_type:validLocation.has(locationType)?locationType:null,p_surprise_mode:Boolean(fd.get("surprise")),p_source_type:"manual",p_source_id:null});if(error)throw new Error(error.message);done(cofreId)
}
export async function createCreation(fd:FormData){
 const cofreId=t(fd,"cofreId",64);const{db}=await getCofre(cofreId);const creationType=t(fd,"creationType",40);const valid=new Set(["album","poster","calendar","book","video","card","gift_kit"]);const{error}=await db.rpc("create_creation_project_secure",{p_cofre_id:cofreId,p_title:t(fd,"title",160),p_creation_type:valid.has(creationType)?creationType:"album",p_target_person_id:person(fd),p_occasion_campaign_id:null,p_template_id:null,p_theme_key:t(fd,"theme",40)||"classic",p_format_key:n(t(fd,"format",40)),p_surprise_mode:Boolean(fd.get("surprise")),p_source_type:"manual",p_source_id:null});if(error)throw new Error(error.message);done(cofreId)
}
export async function createCollaboration(fd:FormData){
 const cofreId=t(fd,"cofreId",64);const{db}=await getCofre(cofreId);const room=t(fd,"roomType",40),visibility=t(fd,"visibilityMode",40);const validRoom=new Set(["gift","album","capsule","video","tribute","memory","recipe_book","custom"]),validVisibility=new Set(["open_group","organizers_only","blind_contributors","surprise"]);const safeVisibility=validVisibility.has(visibility)?visibility:"organizers_only";const{error}=await db.rpc("create_collaboration_room_secure",{p_cofre_id:cofreId,p_title:t(fd,"title",160),p_room_type:validRoom.has(room)?room:"custom",p_target_person_id:person(fd),p_occasion_campaign_id:null,p_visibility_mode:safeVisibility,p_surprise_mode:Boolean(fd.get("surprise"))||safeVisibility==="surprise",p_contribution_deadline:n(t(fd,"contributionDeadline",40)),p_review_deadline:n(t(fd,"reviewDeadline",40)),p_event_at:n(t(fd,"eventAt",40))});if(error)throw new Error(error.message);done(cofreId)
}
