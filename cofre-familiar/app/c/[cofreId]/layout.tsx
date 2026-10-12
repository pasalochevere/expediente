import { AppShell } from "@/components/app-shell";
import { getCofre } from "@/lib/cofre";
export default async function CofreLayout({ children, params }: { children: React.ReactNode; params: Promise<{cofreId:string}> }) {
  const { cofreId } = await params;
  const { cofre } = await getCofre(cofreId);
  return <AppShell cofre={cofre}>{children}</AppShell>;
}
