"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nullableDate(formData: FormData, key: string) {
  const raw = value(formData, key);
  return raw || null;
}

function done(cofreId: string, message: string) {
  revalidatePath(`/c/${cofreId}/media`);
  redirect(`/c/${cofreId}/media?notice=${encodeURIComponent(message)}`);
}

function failed(cofreId: string, message: string) {
  redirect(`/c/${cofreId}/media?error=${encodeURIComponent(message)}`);
}

export async function createMediaAlbumAction(formData: FormData) {
  const cofreId = value(formData, "cofreId");
  const name = value(formData, "name");
  const eventDate = nullableDate(formData, "eventDate");
  const description = value(formData, "description") || null;
  if (!cofreId || !name) return failed(cofreId, "Completá el nombre del álbum.");

  const { supabase } = await requireUser();
  const { error } = await supabase.schema("cofre").rpc("create_media_album_secure", {
    p_cofre_id: cofreId,
    p_name: name,
    p_event_date: eventDate,
    p_description: description,
  });
  if (error) return failed(cofreId, "No se pudo crear el álbum.");
  return done(cofreId, "Álbum creado.");
}

export async function updateMediaMetadataAction(formData: FormData) {
  const cofreId = value(formData, "cofreId");
  const mediaId = value(formData, "mediaId");
  const displayName = value(formData, "displayName") || null;
  const mediaDate = nullableDate(formData, "mediaDate");
  const albumId = value(formData, "albumId") || null;
  if (!cofreId || !mediaId) return failed(cofreId, "No se pudo identificar el archivo.");

  const { supabase } = await requireUser();
  const { error } = await supabase.schema("cofre").rpc("update_media_asset_metadata_secure", {
    p_cofre_id: cofreId,
    p_media_id: mediaId,
    p_display_name: displayName,
    p_media_date: mediaDate,
    p_album_id: albumId,
  });
  if (error) return failed(cofreId, "No se pudieron guardar los cambios del archivo.");
  return done(cofreId, "Archivo actualizado.");
}

export async function updateMediaAlbumAction(formData: FormData) {
  const cofreId = value(formData, "cofreId");
  const albumId = value(formData, "albumId");
  const name = value(formData, "name");
  const eventDate = nullableDate(formData, "eventDate");
  const description = value(formData, "description") || null;
  if (!cofreId || !albumId || !name) return failed(cofreId, "Completá el nombre del álbum.");

  const { supabase } = await requireUser();
  const { error } = await supabase.schema("cofre").rpc("update_media_album_secure", {
    p_cofre_id: cofreId,
    p_album_id: albumId,
    p_name: name,
    p_event_date: eventDate,
    p_description: description,
  });
  if (error) return failed(cofreId, "No se pudo actualizar el álbum.");
  return done(cofreId, "Álbum actualizado.");
}
