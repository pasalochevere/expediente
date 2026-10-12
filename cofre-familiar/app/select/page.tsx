import Link from "next/link";
import { listMyCofres } from "@/lib/cofre";
import { createFamilyCofre } from "./actions";

export default async function SelectPage() {
  const cofres = await listMyCofres();
  return <main className="select-screen"><div className="select-wrap">
    <header className="select-header"><div className="auth-mark">COFRE <span>FAMILIAR</span></div><h1>Elegí tu cofre</h1><p>Podés tener más de un espacio sin mezclar historias.</p></header>
    <div className="cofre-grid">{cofres.map((c: any) => <Link className="cofre-card" href={`/c/${c.id}`} key={c.id}><small>{c.type === "family" ? "FAMILIA" : "NOSOTROS"}</small><h2>{c.name}</h2><p>{c.tagline || "Tu historia, en un solo lugar"}</p><span>Abrir →</span></Link>)}</div>
    <section className="create-cofre"><h2>Crear Cofre Familiar</h2><form action={createFamilyCofre} className="form-grid"><label>Nombre<input name="name" placeholder="Familia Pérez" required /></label><label>Frase<input name="tagline" placeholder="Donde guardamos lo nuestro" /></label><button className="primary" type="submit">Crear cofre</button></form></section>
  </div></main>;
}
