"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const MAX_BYTES = 25 * 1024 * 1024;

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
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  function choose(list: FileList | File[]) {
    const incoming = Array.from(list);
    if (!incoming.length) return;
    const tooBig = incoming.find(file => file.size > MAX_BYTES);
    const empty = incoming.find(file => !file.size);
    if (empty) return setState(`“${empty.name}” está vacío.`);
    if (tooBig) return setState(`“${tooBig.name}” supera 25 MB.`);
    setFiles(incoming);
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
    setState(`Preparando ${index + 1} de ${total} · ${file.name}`);
    const { data: reservation, error: reserveError } = await supabase.functions.invoke("cofre-media-upload-url", {
      body: { cofreId, kind: mediaKind(file.type), filename: file.name, mimeType: file.type || "application/octet-stream", sizeBytes: file.size },
    });
    if (reserveError || !reservation) throw new Error(reserveError?.message || "No pude reservar la subida.");

    setState(`Subiendo ${index + 1} de ${total} · ${file.name}`);
    const signed = reservation.signedUpload;
    const { error: uploadError } = await supabase.storage.from(reservation.bucket).uploadToSignedUrl(reservation.path, signed.token, file, {
      contentType: file.type || "application/octet-stream",
    });
    if (uploadError) throw uploadError;

    setState(`Guardando ${index + 1} de ${total} · ${file.name}`);
    const { error: finalError } = await supabase.functions.invoke("cofre-media-finalize", { body: { mediaId: reservation.mediaId } });
    if (finalError) throw finalError;
  }

  async function uploadSelected() {
    if (!files.length || busy) return;
    setBusy(true);
    try {
      for (let index = 0; index < files.length; index++) await uploadOne(files[index], index, files.length);
      setState(files.length === 1 ? "Archivo guardado." : `${files.length} archivos guardados.`);
      setFiles([]);
      router.refresh();
    } catch (error: any) {
      setState(error?.message || "No se pudo completar la subida.");
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

    {state && <p className={`media-upload-state ${state.includes("guardado") ? "success" : ""}`}>{state}</p>}
  </div>;
}
