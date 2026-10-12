import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCofre } from "@/lib/cofre";

export async function POST(request: Request, { params }: { params: Promise<{ cofreId: string }> }) {
  const { cofreId } = await params;
  try {
    const { db } = await getCofre(cofreId);
    const body = await request.json();
    if (body?.batchId) {
      const ids = Array.isArray(body.candidateIds) ? body.candidateIds.filter((v: unknown) => typeof v === "string").slice(0, 500) : [];
      const { data, error } = await db.rpc("commit_contact_import_batch_secure", { p_batch_id: String(body.batchId), p_candidate_ids: ids });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      revalidatePath(`/c/${cofreId}/people`); revalidatePath(`/c/${cofreId}`);
      return NextResponse.json(data || {});
    }
    const provider = String(body?.provider || "").toLowerCase();
    const contacts = Array.isArray(body?.contacts) ? body.contacts.slice(0, 500) : [];
    if (!contacts.length) return NextResponse.json({ error: "No hay contactos para importar." }, { status: 400 });
    const { data, error } = await db.rpc("import_people_secure", { p_cofre_id: cofreId, p_provider: provider, p_contacts: contacts });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    revalidatePath(`/c/${cofreId}/people`); revalidatePath(`/c/${cofreId}`);
    return NextResponse.json(data || {});
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo importar." }, { status: 500 });
  }
}
