import Link from "next/link";
import { desktopNav, mobileNav } from "@/lib/nav";
import type { CofreSummary } from "@/lib/cofre";

export function AppShell({ cofre, children }: { cofre: CofreSummary; children: React.ReactNode }) {
  const base = `/c/${cofre.id}`;
  return (
    <div className="app-grid">
      <aside className="sidebar">
        <Link className="brand" href={base}>COFRE<span>FAMILIAR</span></Link>
        <div className="cofre-chip"><b>{cofre.name}</b><small>{cofre.tagline || "Tu historia, en un solo lugar"}</small></div>
        <nav>{desktopNav.map(([label, path]) => <Link key={label} href={`${base}${path}`}>{label}</Link>)}</nav>
        <div className="sidebar-bottom"><Link href="/select">Cambiar de cofre</Link><Link href="/logout">Cerrar sesión</Link></div>
      </aside>
      <main className="main"><div className="main-inner">{children}</div></main>
      <nav className="mobile-nav">{mobileNav.map(([label, path]) => <Link key={label} href={`${base}${path}`}>{label}</Link>)}</nav>
    </div>
  );
}
