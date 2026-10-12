"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

function mediaKind(type: string) {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "document";
}

export function MediaUpload({ cofreId }: { cofreId: string }) {
  const router = useRouter(); const [state,setState]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setState("Reservando espacio…");const fd=new FormData(e.currentTarget);const file=fd.get("file");if(!(file instanceof File)||!file.size){setState("Elegí un archivo.");setBusy(false);return}const supabase=createBrowserSupabase();const {data:reservation,error:reserveError}=await supabase.functions.invoke("cofre-media-upload-url",{body:{cofreId,kind:mediaKind(file.type),filename:file.name,mimeType:file.type||"application/octet-stream",sizeBytes:file.size}});if(reserveError||!reservation){setState(reserveError?.message||"No pude reservar la subida.");setBusy(false);return}setState("Subiendo archivo…");const signed=reservation.signedUpload;const {error:uploadError}=await supabase.storage.from(reservation.bucket).uploadToSignedUrl(reservation.path,signed.token,file,{contentType:file.type||"application/octet-stream"});if(uploadError){setState(uploadError.message);setBusy(false);return}setState("Finalizando…");const {error:finalError}=await supabase.functions.invoke("cofre-media-finalize",{body:{mediaId:reservation.mediaId}});if(finalError){setState(finalError.message);setBusy(false);return}setState("Listo.");setBusy(false);e.currentTarget.reset();router.refresh()}
  return <form onSubmit={submit} className="upload-row"><input type="file" name="file" required/><button className="primary" disabled={busy}>{busy?"Subiendo…":"Subir archivo"}</button>{state&&<small>{state}</small>}</form>;
}
