"use client";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/select";
  const [mode, setMode] = useState<"login"|"register">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const supabase = createBrowserSupabase();
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) { setMessage(result.error.message); setBusy(false); return; }
    if (mode === "register" && !result.data.session) {
      setMessage("Cuenta creada. Revisá tu correo para confirmar el acceso."); setBusy(false); return;
    }
    router.replace(next.startsWith("/") ? next : "/select"); router.refresh();
  }

  return <main className="auth-screen"><section className="auth-card">
    <div className="auth-mark">COFRE <span>FAMILIAR</span></div>
    <h1>{mode === "login" ? "Volvé a tu historia" : "Creá tu cuenta"}</h1>
    <p>Un lugar privado para guardar lo que importa y preparar lo que viene.</p>
    <form onSubmit={submit} className="stack">
      <label>Correo<input name="email" type="email" autoComplete="email" required /></label>
      <label>Contraseña<input name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>
      {message && <div className="notice">{message}</div>}
      <button className="primary wide" disabled={busy}>{busy ? "Procesando…" : mode === "login" ? "Entrar" : "Crear cuenta"}</button>
    </form>
    <button className="text-button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>
      {mode === "login" ? "No tengo cuenta" : "Ya tengo cuenta"}
    </button>
  </section></main>;
}
