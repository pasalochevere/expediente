import Link from "next/link";

export function PageHeader({ eyebrow, title, text, action }: { eyebrow?: string; title: string; text?: string; action?: React.ReactNode }) {
  return <header className="page-header"><div><small>{eyebrow}</small><h1>{title}</h1>{text && <p>{text}</p>}</div>{action}</header>;
}
export function Empty({ title, text }: { title: string; text: string }) { return <div className="empty"><b>{title}</b><p>{text}</p></div>; }
export function Card({ children, className="" }: { children: React.ReactNode; className?: string }) { return <section className={`card ${className}`}>{children}</section>; }
export function Stat({ value, label, href }: { value: number | string; label: string; href?: string }) {
  const content = <div className="stat"><strong>{value}</strong><span>{label}</span></div>;
  return href ? <Link href={href}>{content}</Link> : content;
}
export function SubmitButton({ children }: { children: React.ReactNode }) { return <button className="primary" type="submit">{children}</button>; }
