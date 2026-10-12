import Link from "next/link";
import { Card, Empty, PageHeader } from "@/components/ui";
import { MediaUpload } from "@/components/media-upload";
import { getCofre } from "@/lib/cofre";
import { createMediaAlbumAction, updateMediaAlbumAction, updateMediaMetadataAction } from "./actions";

export const dynamic = "force-dynamic";

type Search = { album?: string; notice?: string; error?: string };

function shortDate(value?: string | null) {
  if (!value) return null;
  const raw = value.length === 10 ? `${value}T12:00:00` : value;
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(raw));
}

function kindLabel(kind: string) {
  return ({ image: "Foto", video: "Video", audio: "Audio", document: "Documento" } as Record<string, string>)[kind] || "Archivo";
}

function friendlyName(asset: any) {
  if (asset.display_name) return asset.display_name;
  const date = shortDate(asset.media_date || asset.created_at);
  return `${kindLabel(asset.kind)}${date ? ` · ${date}` : ""}`;
}

function cardTitle(asset: any) {
  return asset.display_name || kindLabel(asset.kind);
}

function sizeLabel(bytes: number) {
  if (!bytes) return "0 MB";
  const mb = bytes / 1024 / 1024;
  return mb < 1 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

export default async function Page({ params, searchParams }: { params: Promise<{ cofreId: string }>; searchParams: Promise<Search> }) {
  const { cofreId } = await params;
  const search = await searchParams;
  const { supabase, db, userId } = await getCofre(cofreId);

  const [{ data: assets, error: assetsError }, { data: albums, error: albumsError }, { data: membership }] = await Promise.all([
    db.from("media_assets")
      .select("id,kind,storage_bucket,storage_path,original_filename,display_name,media_date,album_id,mime_type,size_bytes,status,uploaded_by,created_at")
      .eq("cofre_id", cofreId).eq("status", "ready").is("deleted_at", null).order("media_date", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }).limit(240),
    db.from("media_albums")
      .select("id,name,description,event_date,created_by,created_at")
      .eq("cofre_id", cofreId).is("deleted_at", null).order("event_date", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }),
    db.from("cofre_members").select("role").eq("cofre_id", cofreId).eq("user_id", userId).eq("status", "active").maybeSingle(),
  ]);
  if (assetsError) throw new Error(assetsError.message);
  if (albumsError) throw new Error(albumsError.message);

  const ready = await Promise.all((assets || []).map(async (asset: any) => {
    const { data: signed } = await supabase.storage.from(asset.storage_bucket).createSignedUrl(asset.storage_path, 60 * 20);
    return { ...asset, url: signed?.signedUrl || null };
  }));

  const albumList = albums || [];
  const albumMap = new Map(albumList.map((album: any) => [album.id, album]));
  const role = String(membership?.role || "");
  const canAdmin = role === "owner" || role === "admin";
  const selected = search.album || "all";
  const counts = new Map<string, number>();
  for (const asset of ready) counts.set(asset.album_id || "none", (counts.get(asset.album_id || "none") || 0) + 1);

  const filtered = selected === "all" ? ready : selected === "none" ? ready.filter((a: any) => !a.album_id) : ready.filter((a: any) => a.album_id === selected);
  const groups: Array<{ id: string; name: string; date?: string | null; description?: string | null; items: any[] }> = [];
  if (selected === "all") {
    for (const album of albumList as any[]) {
      const items = filtered.filter((a: any) => a.album_id === album.id);
      if (items.length) groups.push({ id: album.id, name: album.name, date: album.event_date, description: album.description, items });
    }
    const loose = filtered.filter((a: any) => !a.album_id);
    if (loose.length) groups.push({ id: "none", name: "Sin álbum", description: "Fotos y archivos sueltos, ordenados por fecha.", items: loose });
  } else if (selected === "none") {
    groups.push({ id: "none", name: "Sin álbum", description: "Fotos y archivos sueltos, ordenados por fecha.", items: filtered });
  } else {
    const album = albumMap.get(selected) as any;
    groups.push({ id: selected, name: album?.name || "Álbum", date: album?.event_date, description: album?.description, items: filtered });
  }

  return <>
    <PageHeader eyebrow="ARCHIVO FAMILIAR" title="Fotos y archivos" text="Tus fotos completas, videos, audios y documentos. Organizalos por álbum, salida o fecha sin perder el archivo original." />

    {search.notice && <div className="notice media-notice success">{search.notice}</div>}
    {search.error && <div className="notice media-notice error">{search.error}</div>}

    <div className="media-top-grid">
      <Card className="media-upload-card">
        <div className="media-section-kicker">AGREGAR</div>
        <h2>Sumar recuerdos</h2>
        <p className="muted">Podés elegir varios archivos. Cada uno queda guardado en el storage privado del Cofre.</p>
        <MediaUpload cofreId={cofreId} />
      </Card>

      <Card className="album-create-card">
        <div className="media-section-kicker">ORGANIZAR</div>
        <h2>Nuevo álbum</h2>
        <form action={createMediaAlbumAction} className="media-form compact">
          <input type="hidden" name="cofreId" value={cofreId} />
          <label>Nombre<input name="name" required maxLength={120} placeholder="Ej. Tandil · finde largo" /></label>
          <label>Fecha o salida<input name="eventDate" type="date" /></label>
          <label className="full">Nota<input name="description" maxLength={1000} placeholder="Opcional: lugar, festejo o momento" /></label>
          <button className="primary" type="submit">Crear álbum</button>
        </form>
      </Card>
    </div>

    <section className="album-shelf" aria-label="Álbumes">
      <Link className={`album-chip ${selected === "all" ? "active" : ""}`} href={`/c/${cofreId}/media`}>Todos <span>{ready.length}</span></Link>
      {albumList.map((album: any) => <Link key={album.id} className={`album-chip ${selected === album.id ? "active" : ""}`} href={`/c/${cofreId}/media?album=${album.id}`}>{album.name}<span>{counts.get(album.id) || 0}</span></Link>)}
      <Link className={`album-chip ${selected === "none" ? "active" : ""}`} href={`/c/${cofreId}/media?album=none`}>Sin álbum <span>{counts.get("none") || 0}</span></Link>
    </section>

    {!!albumList.length && <details className="album-manage card">
      <summary>Administrar álbumes</summary>
      <div className="album-manage-grid">
        {albumList.map((album: any) => {
          const editable = canAdmin || album.created_by === userId;
          return <article key={album.id} className="album-manage-item">
            <div><b>{album.name}</b><small>{shortDate(album.event_date) || "Sin fecha"} · {counts.get(album.id) || 0} archivos</small></div>
            {editable ? <form action={updateMediaAlbumAction} className="media-form compact">
              <input type="hidden" name="cofreId" value={cofreId} />
              <input type="hidden" name="albumId" value={album.id} />
              <label>Nombre<input name="name" required maxLength={120} defaultValue={album.name} /></label>
              <label>Fecha<input name="eventDate" type="date" defaultValue={album.event_date || ""} /></label>
              <label className="full">Nota<input name="description" maxLength={1000} defaultValue={album.description || ""} /></label>
              <button className="secondary" type="submit">Guardar álbum</button>
            </form> : <span className="muted">Sólo el creador o un administrador puede editarlo.</span>}
          </article>;
        })}
      </div>
    </details>}

    {filtered.length ? groups.map(group => <section className="media-group" key={group.id}>
      <div className="media-group-head">
        <div>
          <div className="media-group-kicker-row"><span className="media-section-kicker">ÁLBUM</span><span className="media-group-count">{group.items.length} {group.items.length === 1 ? "archivo" : "archivos"}</span></div>
          <h2>{group.name}</h2>
          <div className="media-group-subline">{group.date && <time>{shortDate(group.date)}</time>}{group.description && <p>{group.description}</p>}</div>
        </div>
      </div>
      <div className={`media-library-grid media-count-${Math.min(group.items.length, 3)}`}>
        {group.items.map((asset: any) => {
          const editable = canAdmin || asset.uploaded_by === userId;
          const displayDate = shortDate(asset.media_date || asset.created_at);
          return <article className="media-library-card" key={asset.id}>
            <div className="media-preview">
              {asset.kind === "image" && asset.url ? <img src={asset.url} alt={friendlyName(asset)} /> :
               asset.kind === "video" && asset.url ? <video src={asset.url} controls preload="metadata" /> :
               asset.kind === "audio" && asset.url ? <div className="media-audio"><span>Audio</span><audio src={asset.url} controls /></div> :
               <div className="media-file-icon">{kindLabel(asset.kind)}</div>}
            </div>
            <div className="media-card-body">
              <div className="media-card-title"><div><small>{kindLabel(asset.kind)}</small><h3>{cardTitle(asset)}</h3></div></div>
              <p className="media-meta">{displayDate}{displayDate ? " · " : ""}{sizeLabel(Number(asset.size_bytes || 0))}</p>

              {asset.url && <a className="media-open-original" href={asset.url} target="_blank" rel="noreferrer">Ver original ↗</a>}

              {editable && <details className="media-edit">
                <summary>Editar</summary>
                <form action={updateMediaMetadataAction} className="media-form compact">
                  <input type="hidden" name="cofreId" value={cofreId} />
                  <input type="hidden" name="mediaId" value={asset.id} />
                  <label>Nombre visible<input name="displayName" maxLength={120} defaultValue={asset.display_name || ""} placeholder={friendlyName(asset)} /></label>
                  <label>Fecha<input name="mediaDate" type="date" defaultValue={asset.media_date || ""} /></label>
                  <label className="full">Álbum<select name="albumId" defaultValue={asset.album_id || ""}><option value="">Sin álbum</option>{albumList.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
                  <button className="primary" type="submit">Guardar</button>
                </form>
              </details>}

              <details className="media-technical"><summary>Información</summary><p>{asset.original_filename || "Sin nombre original"}</p><p>{asset.mime_type} · {sizeLabel(Number(asset.size_bytes || 0))}</p></details>
            </div>
          </article>;
        })}
      </div>
    </section>) : <Empty title={selected === "all" ? "Todavía no hay archivos" : "Este álbum está vacío"} text="Subí fotos, videos o audios y organizalos por salida, fecha o momento. Las fotos se muestran completas, sin recortes." />}
  </>;
}
