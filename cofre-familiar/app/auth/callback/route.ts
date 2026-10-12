import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/select";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
      const forwardedHost = request.headers.get("x-forwarded-host");
      const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
      const origin = configuredSite || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || url.origin;
  return NextResponse.redirect(`${configuredSite}/login?error=auth_callback`);
}
