"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const MAX_BYTES = 25 * 1024 * 1024;
type Tone = "idle" | "success" | "partial" | "error";

function mediaKind(type: string) {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "document";
}

function fileSize(bytes: number) {
  const mb = bytes / 1024 / 1024;
  return mb < 1 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${mb.toFixed(1)} MB`;
}

export function MediaUpload({ cofreId }: { cofreId: string }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState("");
  const [tone, setTone] = useState<Tone>("idle");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  function choose(list: FileList | File[]) {
    const incoming = Array.from(list);
    if (!incoming.length) return;
    const tooBig = incoming.find(file => file.size > MAX_BYTES);
    const empty = incoming.find(file => !file.size);
    if (empty) {
      setTone("error");
      return setState(`“${empty.name}” está vacío.`);
    }
    if (tooBig) {
      setTone("error");
      return setState(`“${tooBig.name}” supera 25 MB.`);
    }
    setFiles(incoming);
    setTone("idle");
    setState("");
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) choose(event.target.files);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    choose(event.dataTransfer.files);
  }

  async function uploadOne(file: File, index: number, total: number) {
    const supabase = createBrowserSupabase();
    let mediaId: string | null = null;
    try {
      setTone("idle");
      setState(`Preparando ${index + 1} de ${total} · ${file.name}`);
      const { data: reservation, error: reserveError } = await supabase.functions.invoke("cofre-media-upload-url", {
        body: { cofreId, kind: mediaKind(file.type), filename: file.name, mimeType: file.type || "application/octet-stream", sizeBytes: file.size },
      });
      if (reserveError || !reservation) throw new Error(reserveError?.message || "No pude reservar la subida.");
      mediaId = reservation.mediaId;

      setState(`Subiendo ${index + 1} de ${total} · ${file.name}`);
      const signed = reservation.signedUpload;
      const { error: uploadError } = await supabase.storage.from(reservation.bucket).uploadToSignedUrl(reservation.path, signed.token, file, {
        contentType: file.type || "application/octet-stream",
      });
      if (uploadError) throw uploadError;

      setState(`Guardando ${index + 1} de ${total} · ${file.name}`);
      const { error: finalError } = await supabase.functions.invoke("cofre-media-finalize", { body: { mediaId } });
      if (finalError) throw finalError;
    } catch (error) {
      if (mediaId) {
        await supabase.schema("cofre").rpc("cancel_my_media_upload_secure", {
          p_cofre_id: cofreId,
          p_media_id: mediaId,
          p_reason: "client_upload_failed",
        }).catch(() => null);
      }
      throw error;
    }
  }

  async function uploadSelected() {
    if (!files.length || busy) return;
    setBusy(true);
    const pending: File[] = [];
    const messages: string[] = [];
    let saved = 0;

    try {
      for (let index = 0; index < files.length; index++) {
        try {
          await uploadOne(files[index], index, files.length);
          saved++;
        } catch (error: any) {
          pending.push(files[index]);
          messages.push(error?.message || `No se pudo subir ${files[index].name}.`);
        }
      }

      setFiles(pending);
      if (!pending.length) {
        setTone("success");
        setState(saved === 1 ? "Archivo guardado." : `${saved} archivos guardados.`);
      } else if (saved) {
        setTone("partial");
        setState(`${saved} ${saved === 1 ? "archivo guardado" : "archivos guardados"} · ${pending.length} ${pending.length === 1 ? "quedó pendiente" : "quedaron pendientes"}. Podés reintentar sólo los pendientes.`);
      } else {
        setTone("error");
        setState(messages[0] || "No se pudo completar la subida. La carga incompleta fue descartada.");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return <div className="media-uploader">
    <label
      className={`media-dropzone ${dragging ? "dragging" : ""} ${busy ? "busy" : ""}`}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDragOver={event => event.preventDefault()}
      onDrop={onDrop}
    >
      <input className="media-file-input" type="file" multiple accept="image/*,video/*,audio/*,.pdf" onChange={onInput} disabled={busy} />
      <span className="media-drop-icon">＋</span>
      <strong>{dragging ? "Soltá los archivos acá" : "Arrastrá fotos o elegí archivos"}</strong>
      <small>Fotos, videos, audios o PDF · hasta 25 MB por archivo</small>
    </label>

    {!!files.length && <div className="media-selection">
      <div><b>{files.length} {files.length === 1 ? "archivo seleccionado" : "archivos seleccionados"}</b><span>{files.slice(0, 3).map(file => `${file.name} · ${fileSize(file.size)}`).join("  ·  ")}{files.length > 3 ? `  ·  +${files.length - 3} más` : ""}</span></div>
      <button className="primary" type="button" onClick={uploadSelected} disabled={busy}>{busy ? "Subiendo…" : files.length === 1 ? "Guardar archivo" : `Guardar ${files.length} archivos`}</button>
    </div>}

    {state && <p className={`media-upload-state ${tone}`}>{state}</p>}
  </div>;
}
