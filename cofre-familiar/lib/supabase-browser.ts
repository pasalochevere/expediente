"use client";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "@/lib/supabase-config";

let client: ReturnType<typeof createBrowserClient> | undefined;
export function createBrowserSupabase() {
  if (!client) {
    const { url, key } = supabaseConfig();
    client = createBrowserClient(url, key);
  }
  return client;
}
