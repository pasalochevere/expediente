"use client";

import { useMemo, useState } from "react";
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
  const [provider, setProvider] = useState(batchId ? "google" : "csv");
  const [relationship, setRelationship] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

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
    if (!googleEnabled) return;
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
    <section className="people-sync-grid">
      <article className="sync-source-card sync-google">
        <span>GOOGLE CONTACTS</span>
        <h2>Traer tu agenda</h2>
        <p>Nombre, cumpleaños, email y teléfono cuando estén disponibles. Cofre pide acceso de sólo lectura.</p>
        <button className="occasion-primary" type="button" onClick={connectGoogle} disabled={!googleEnabled || busy}>{googleEnabled ? "Conectar Google" : "Listo para activar OAuth"}</button>
        {!googleEnabled && <small>La interfaz y el callback ya están preparados. Falta la configuración OAuth externa de Google/Supabase antes de habilitar este botón.</small>}
      </article>
      <article className="sync-source-card">
        <span>ARCHIVO</span>
        <h2>vCard o CSV</h2>
        <p>Sirve para exportaciones del teléfono, Google, Outlook u otra agenda. Nada se guarda hasta que confirmes.</p>
        <label className="import-file-button">Elegir archivo<input type="file" accept=".vcf,.csv,text/vcard,text/csv" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}/></label>
      </article>
    </section>

    {contacts.length > 0 && <section className="import-review-panel">
      <div className="import-review-head"><div><span>REVISAR ANTES DE GUARDAR</span><h2>{contacts.length} contactos encontrados</h2></div><b>{selectedCount} seleccionados</b></div>
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
