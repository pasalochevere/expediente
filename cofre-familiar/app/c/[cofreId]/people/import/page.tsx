import Link from "next/link";
import { PageHeader } from "@/components/ui";
import PeopleImporter from "@/components/people-importer";
import { getCofre } from "@/lib/cofre";

const googleErrors: Record<string, string> = {
  google_not_enabled: "Google Contacts todavía no está habilitado para este entorno.",
  google_token: "Google autorizó la cuenta, pero no entregó un token válido para leer contactos. Volvé a intentar la conexión.",
  google_contacts: "No pudimos leer los contactos de Google. Revisá el permiso de Contactos y volvé a conectar.",
  google_callback: "Google no completó la autorización. No se importó ni guardó ningún contacto.",
};

export default async function PeopleImportPage({ params, searchParams }: { params: Promise<{ cofreId: string }>; searchParams: Promise<{ batch?: string; error?: string }> }) {
  const { cofreId } = await params;
  const { batch, error } = await searchParams;
  const { db } = await getCofre(cofreId);
  let stagedContacts: Array<{ id: string; payload: Record<string, unknown> }> = [];
  let validBatch: string | null = null;
  if (batch) {
    const { data: batchRow } = await db.from("contact_import_batches").select("id,status,expires_at").eq("id", batch).eq("cofre_id", cofreId).maybeSingle();
    if (batchRow?.status === "pending" && new Date(batchRow.expires_at).getTime() > Date.now()) {
      validBatch = batchRow.id;
      const { data } = await db.from("contact_import_candidates").select("id,payload").eq("batch_id", batchRow.id).eq("cofre_id", cofreId).order("position");
      stagedContacts = (data || []) as Array<{ id: string; payload: Record<string, unknown> }>;
    }
  }
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_CONTACTS_ENABLED === "true";
  const googleError = error ? googleErrors[error] || "No se pudo completar la conexión con Google. No se guardó ningún contacto." : "";
  return <div className="people-import-page">
    <Link className="occasion-back" href={`/c/${cofreId}/people`}>← Volver a Personas</Link>
    <PageHeader eyebrow="PEOPLE SYNC" title="Importar personas" text="Traé tu agenda, revisá qué personas querés sumar y dejá que Cofre evite duplicados automáticamente."/>
    <div className="import-privacy-note"><b>Tu agenda no se copia completa sin permiso.</b><span>Primero ves la lista, elegís a quién importar y recién ahí se guarda. Teléfonos, emails y fuentes externas quedan privados para quien los importó o un admin.</span></div>
    {googleError && <div className="import-privacy-note"><b>Google Contacts no se conectó.</b><span>{googleError}</span></div>}
    <PeopleImporter cofreId={cofreId} batchId={validBatch} stagedContacts={stagedContacts} googleEnabled={googleEnabled}/>
  </div>;
}
