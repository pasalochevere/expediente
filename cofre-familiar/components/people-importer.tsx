"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type ContactCandidate = {
  key: string;
  candidateId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  externalId?: string;
  profileUrl?: string;
  relationship?: string;
  sourceLabel?: string;
};

type NativeContact = { name?: string[]; email?: string[]; tel?: string[] };
type ContactsNavigator = Navigator & {
  contacts?: {
    select: (properties: Array<"name" | "email" | "tel">, options: { multiple: boolean }) => Promise<NativeContact[]>;
  };
};

type Props = {
  cofreId: string;
  batchId?: string | null;
  stagedContacts?: Array<{ id: string; payload: Record<string, unknown> }>;
  googleEnabled: boolean;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function csvRows(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (ch === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(cell); cell = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && input[i + 1] === "\n") i += 1;
      row.push(cell); cell = "";
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((v) => v.trim())) rows.push(row);
  return rows;
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

function field(headers: string[], row: string[], aliases: string[]) {
  const wanted = aliases.map(normalizeHeader);
  const index = headers.findIndex((h) => wanted.includes(h));
  return index >= 0 ? clean(row[index]) : "";
}

function normalizeBirth(value: string) {
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  if (/^\d{8}$/.test(v)) return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
  const m = v.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return "";
}

function parseCsv(input: string): ContactCandidate[] {
  const rows = csvRows(input);
  if (rows.length < 2) return [];
  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((row, index) => {
    const firstName = field(headers, row, ["first_name", "firstname", "nombre", "given_name", "givenname"]);
    const lastName = field(headers, row, ["last_name", "lastname", "apellido", "family_name", "familyname"]);
    const name = field(headers, row, ["name", "full_name", "fullname", "nombrecompleto", "display_name", "displayname"]) || [firstName, lastName].filter(Boolean).join(" ");
    return {
      key: `csv-${index}`,
      name,
      firstName,
      lastName,
      displayName: field(headers, row, ["display_name", "displayname", "apodo", "nickname"]),
      birthDate: normalizeBirth(field(headers, row, ["birth_date", "birthdate", "birthday", "cumpleanos", "nacimiento"])),
      email: field(headers, row, ["email", "e-mail", "mail", "correo"]),
      phone: field(headers, row, ["phone", "mobile", "telefono", "celular", "tel"]),
      relationship: field(headers, row, ["relationship", "vinculo", "relacion"]),
      externalId: field(headers, row, ["id", "external_id", "externalid", "uid"]),
      sourceLabel: "CSV",
    };
  }).filter((c) => c.name || c.firstName || c.email || c.phone);
}

function unescapeVcard(value: string) {
  return value.replace(/\\n/gi, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").trim();
}

function parseVcard(input: string): ContactCandidate[] {
  const unfolded = input.replace(/\r?\n[ \t]/g, "");
  const blocks = unfolded.split(/BEGIN:VCARD/i).slice(1);
  return blocks.map((block, index) => {
    const lines = block.split(/\r?\n/);
    const values = (key: string) => lines.filter((line) => line.toUpperCase().startsWith(key)).map((line) => unescapeVcard(line.slice(line.indexOf(":") + 1)));
    const fn = values("FN")[0] || "";
    const n = values("N")[0]?.split(";") || [];
    const lastName = n[0] || "";
    const firstName = n[1] || "";
    const birthday = normalizeBirth(values("BDAY")[0] || "");
    return {
      key: `vcf-${index}`,
      name: fn || [firstName, lastName].filter(Boolean).join(" "),
      firstName,
      lastName,
      displayName: fn,
      birthDate: birthday,
      email: values("EMAIL")[0] || "",
      phone: values("TEL")[0] || "",
      externalId: values("UID")[0] || "",
      sourceLabel: "vCard",
    };
  }).filter((c) => c.name || c.firstName || c.email || c.phone);
}

function fromStaged(items: Props["stagedContacts"]): ContactCandidate[] {
  return (items || []).map((item, index) => ({
    key: item.id,
    candidateId: item.id,
    name: clean(item.payload.name),
    firstName: clean(item.payload.firstName),
    lastName: clean(item.payload.lastName),
    displayName: clean(item.payload.displayName),
    birthDate: clean(item.payload.birthDate),
    email: clean(item.payload.email),
    phone: clean(item.payload.phone),
    externalId: clean(item.payload.externalId),
    profileUrl: clean(item.payload.profileUrl),
    relationship: clean(item.payload.relationship),
    sourceLabel: clean(item.payload.sourceLabel) || `Contacto ${index + 1}`,
  }));
}

export default function PeopleImporter({ cofreId, batchId, stagedContacts, googleEnabled }: Props) {
  const initial = useMemo(() => fromStaged(stagedContacts), [stagedContacts]);
  const [contacts, setContacts] = useState<ContactCandidate[]>(initial);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial.map((c) => c.key)));
  const [provider, setProvider] = useState(batchId ? "google" : "phone");
  const [relationship, setRelationship] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [phonePickerAvailable, setPhonePickerAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const nav = navigator as ContactsNavigator;
    setPhonePickerAvailable(Boolean(nav.contacts?.select));
  }, []);

  async function readFile(file: File) {
    setStatus("");
    const text = await file.text();
    const isVcard = file.name.toLowerCase().endsWith(".vcf") || /BEGIN:VCARD/i.test(text);
    const parsed = isVcard ? parseVcard(text) : parseCsv(text);
    setProvider(isVcard ? "vcard" : "csv");
    setContacts(parsed);
    setSelected(new Set(parsed.map((c) => c.key)));
    setStatus(parsed.length ? `${parsed.length} contactos listos para revisar.` : "No pude encontrar contactos válidos en ese archivo.");
  }

  async function pickPhoneContacts() {
    const nav = navigator as ContactsNavigator;
    if (!nav.contacts?.select) {
      setStatus("Este navegador no permite abrir la agenda directamente. Probalo desde Chrome en Android o usá Google/vCard.");
      return;
    }
    setBusy(true);
    setStatus("Elegí los contactos que querés sumar al Cofre…");
    try {
      const picked = await nav.contacts.select(["name", "email", "tel"], { multiple: true });
      const parsed = picked.map((item, index) => {
        const name = clean(item.name?.[0]) || clean(item.email?.[0]) || clean(item.tel?.[0]) || `Contacto ${index + 1}`;
        const parts = name.split(/\s+/).filter(Boolean);
        return {
          key: `phone-${index}-${clean(item.tel?.[0]) || clean(item.email?.[0]) || name}`,
          name,
          firstName: parts[0] || name,
          lastName: parts.slice(1).join(" "),
          displayName: name,
          email: clean(item.email?.[0]),
          phone: clean(item.tel?.[0]),
          relationship,
          sourceLabel: "Teléfono",
        } satisfies ContactCandidate;
      }).filter((c) => c.name || c.email || c.phone);
      setProvider("phone");
      setContacts(parsed);
      setSelected(new Set(parsed.map((c) => c.key)));
      setStatus(parsed.length ? `${parsed.length} contactos elegidos. Revisalos antes de importar.` : "No elegiste contactos.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo abrir la agenda.";
      if (/cancel|abort/i.test(message)) setStatus("Selección cancelada. No se guardó nada.");
      else setStatus(message);
    } finally {
      setBusy(false);
    }
  }

  async function importSelected() {
    const chosen = contacts.filter((c) => selected.has(c.key));
    if (!chosen.length) { setStatus("Elegí al menos una persona."); return; }
    setBusy(true); setStatus("Importando y evitando duplicados…");
    try {
      const body = batchId
        ? { batchId, candidateIds: chosen.map((c) => c.candidateId).filter(Boolean) }
        : { provider, contacts: chosen.map(({ key, candidateId, ...c }) => ({ ...c, relationship: c.relationship || relationship })) };
      const response = await fetch(`/c/${cofreId}/people/import/api`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "No se pudo importar.");
      setStatus(`Listo: ${data.created || 0} nuevas · ${data.merged || 0} combinadas con personas existentes.`);
      setContacts([]); setSelected(new Set());
      setTimeout(() => { window.location.href = `/c/${cofreId}/people`; }, 900);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo importar.");
    } finally { setBusy(false); }
  }

  async function connectGoogle() {
    if (!googleEnabled) {
      setStatus("Google Contacts está preparado, pero todavía falta activar el OAuth externo del producto.");
      return;
    }
    setBusy(true); setStatus("Abriendo Google para autorizar sólo lectura de contactos…");
    const supabase = createBrowserSupabase();
    const redirectTo = `${window.location.origin}/auth/callback?contacts=google&cofreId=${encodeURIComponent(cofreId)}&next=${encodeURIComponent(`/c/${cofreId}/people/import`)}`;
    const credentials: any = {
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/contacts.readonly",
        redirectTo,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    };
    const { error } = await supabase.auth.linkIdentity(credentials);
    if (error) { setBusy(false); setStatus(error.message); }
  }

  const selectedCount = selected.size;
  return <div className="people-import-stack">
    <div className="easy-import-steps" aria-label="Pasos para importar contactos">
      <span><b>1</b> Elegí de dónde traerlos</span><span><b>2</b> Revisá la lista</span><span><b>3</b> Importá</span>
    </div>

    <section className="people-sync-grid easy-flow-grid">
      <article className="sync-source-card sync-phone">
        <span>MÁS RÁPIDO</span>
        <h2>Elegir del teléfono</h2>
        <p>Abrí tu agenda, marcá las personas y volvé al Cofre. No hace falta exportar ningún archivo.</p>
        <button className="occasion-primary" type="button" onClick={pickPhoneContacts} disabled={busy || phonePickerAvailable === null}>{phonePickerAvailable === null ? "Comprobando…" : phonePickerAvailable ? "Elegir contactos" : "No disponible en este navegador"}</button>
        <small>{phonePickerAvailable === false ? "Abrí esta misma pantalla desde Chrome en Android. Si no aparece, usá Google o vCard." : "Cofre sólo recibe los contactos que vos selecciones."}</small>
      </article>

      <article className="sync-source-card sync-google">
        <span>GOOGLE CONTACTS</span>
        <h2>Conectar Google</h2>
        <p>Ideal para importar muchos contactos desde PC o Android. Primero revisás la lista y elegís a quién sumar.</p>
        <button className="occasion-secondary" type="button" onClick={connectGoogle} disabled={busy}>{googleEnabled ? "Conectar Google" : "Activación pendiente"}</button>
        {!googleEnabled && <small>La integración está construida. Falta activar una vez el OAuth de Google/Supabase.</small>}
      </article>

      <article className="sync-source-card sync-file">
        <span>RESPALDO</span>
        <h2>vCard o CSV</h2>
        <p>Para iPhone, Outlook u otras agendas cuando no esté disponible el selector directo.</p>
        <label className="import-file-button">Elegir archivo<input type="file" accept=".vcf,.csv,text/vcard,text/csv" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}/></label>
      </article>
    </section>

    {contacts.length > 0 && <section className="import-review-panel">
      <div className="import-review-head"><div><span>PASO 2 · REVISAR ANTES DE GUARDAR</span><h2>{contacts.length} contactos encontrados</h2></div><b>{selectedCount} seleccionados</b></div>
      {!batchId && <label className="import-global-relation">Vínculo por defecto<input value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="Amigo, familia, trabajo…"/></label>}
      <div className="import-select-actions"><button type="button" onClick={() => setSelected(new Set(contacts.map((c) => c.key)))}>Seleccionar todos</button><button type="button" onClick={() => setSelected(new Set())}>Ninguno</button></div>
      <div className="import-contact-list">{contacts.map((c) => <label className="import-contact-row" key={c.key}>
        <input type="checkbox" checked={selected.has(c.key)} onChange={(e) => { const next = new Set(selected); if (e.target.checked) next.add(c.key); else next.delete(c.key); setSelected(next); }}/>
        <span className="import-avatar">{(c.displayName || c.name || c.firstName || "?").slice(0,1).toUpperCase()}</span>
        <span className="import-contact-main"><b>{c.displayName || c.name || [c.firstName,c.lastName].filter(Boolean).join(" ") || "Sin nombre"}</b><small>{[c.email,c.phone,c.birthDate].filter(Boolean).join(" · ") || "Sin datos extra"}</small></span>
      </label>)}</div>
      <button className="occasion-primary import-confirm" type="button" disabled={busy || !selectedCount} onClick={importSelected}>{busy ? "Importando…" : `Importar ${selectedCount} personas`}</button>
    </section>}
    {status && <p className="import-status" aria-live="polite">{status}</p>}
  </div>;
}
