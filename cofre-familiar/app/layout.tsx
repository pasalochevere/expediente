import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Cofre Familiar", template: "%s · Cofre Familiar" },
  description: "Recuerdos, personas, fechas, cartas, cápsulas, sueños y proyectos de tu familia.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
