import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/select";
}

function safeCofreId(value: string | null) {
  return value && /^[0-9a-f-]{36}$/i.test(value) ? value : null;
}

function siteOrigin(request: Request) {
  const url = new URL(request.url);
  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  return configuredSite || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin);
}

function birthdayFromGoogle(person: any) {
  const birthday = Array.isArray(person?.birthdays)
    ? person.birthdays.find((item: any) => item?.date?.year && item?.date?.month && item?.date?.day)
    : null;
  if (!birthday?.date) return "";
  const { year, month, day } = birthday.date;
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function normalizeGooglePerson(person: any) {
  const primaryName = Array.isArray(person?.names) ? person.names.find((item: any) => item?.metadata?.primary) || person.names[0] : null;
  const primaryEmail = Array.isArray(person?.emailAddresses) ? person.emailAddresses.find((item: any) => item?.metadata?.primary) || person.emailAddresses[0] : null;
  const primaryPhone = Array.isArray(person?.phoneNumbers) ? person.phoneNumbers.find((item: any) => item?.metadata?.primary) || person.phoneNumbers[0] : null;
  const primaryUrl = Array.isArray(person?.urls) ? person.urls.find((item: any) => item?.metadata?.primary) || person.urls[0] : null;
  const relation = Array.isArray(person?.relations) ? person.relations[0] : null;
  const name = String(primaryName?.displayName || "").trim();
  const firstName = String(primaryName?.givenName || "").trim();
  const lastName = String(primaryName?.familyName || "").trim();
  return {
    name,
    firstName,
    lastName,
    displayName: name,
    birthDate: birthdayFromGoogle(person),
    email: String(primaryEmail?.value || "").trim(),
    emailLabel: String(primaryEmail?.type || "").trim(),
    phone: String(primaryPhone?.value || "").trim(),
    phoneLabel: String(primaryPhone?.type || "").trim(),
    relationship: String(relation?.person || relation?.type || "").trim(),
    externalId: String(person?.resourceName || "").trim(),
    profileUrl: String(primaryUrl?.value || "").trim(),
    sourceLabel: "Google Contacts",
  };
}

async function stageGoogleContacts(supabase: Awaited<ReturnType<typeof createServerSupabase>>, cofreId: string, providerToken: string) {
  const contacts: any[] = [];
  let pageToken = "";
  do {
    const endpoint = new URL("https://people.googleapis.com/v1/people/me/connections");
    endpoint.searchParams.set("personFields", "names,birthdays,emailAddresses,phoneNumbers,relations,urls");
    endpoint.searchParams.set("pageSize", String(Math.min(500 - contacts.length, 500)));
    if (pageToken) endpoint.searchParams.set("pageToken", pageToken);
    const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${providerToken}` }, cache: "no-store" });
    if (!response.ok) throw new Error(`google_contacts_${response.status}`);
    const payload = await response.json();
    for (const person of payload.connections || []) {
      const normalized = normalizeGooglePerson(person);
      if (normalized.name || normalized.firstName || normalized.email || normalized.phone) contacts.push(normalized);
      if (contacts.length >= 500) break;
    }
    pageToken = contacts.length < 500 ? String(payload.nextPageToken || "") : "";
  } while (pageToken);
  if (!contacts.length) throw new Error("google_contacts_empty");
  const { data, error } = await supabase.schema("cofre").rpc("stage_contact_import_secure", {
    p_cofre_id: cofreId,
    p_provider: "google",
    p_contacts: contacts,
  });
  if (error) throw new Error(error.message);
  return String(data);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const contactMode = url.searchParams.get("contacts") === "google";
  const cofreId = safeCofreId(url.searchParams.get("cofreId"));
  const origin = siteOrigin(request);

  if (code) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (contactMode) {
        if (!cofreId || process.env.NEXT_PUBLIC_GOOGLE_CONTACTS_ENABLED !== "true") {
          return NextResponse.redirect(`${origin}${cofreId ? `/c/${cofreId}/people/import?error=google_not_enabled` : "/select"}`);
        }
        const providerToken = data.session?.provider_token;
        if (!providerToken) return NextResponse.redirect(`${origin}/c/${cofreId}/people/import?error=google_token`);
        try {
          const batchId = await stageGoogleContacts(supabase, cofreId, providerToken);
          return NextResponse.redirect(`${origin}/c/${cofreId}/people/import?batch=${encodeURIComponent(batchId)}`);
        } catch {
          return NextResponse.redirect(`${origin}/c/${cofreId}/people/import?error=google_contacts`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  if (contactMode && cofreId) return NextResponse.redirect(`${origin}/c/${cofreId}/people/import?error=google_callback`);
  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
