import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase-config";
export function createPublicSupabase(){const{url,key}=supabaseConfig();return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})}
