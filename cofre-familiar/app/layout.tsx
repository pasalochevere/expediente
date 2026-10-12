import type { Metadata } from "next";
import "./globals.css";
import "./r04.css";
import "./r04-5.css";
import "./r05.css";

export const metadata: Metadata = {
  title: { default: "Cofre Familiar", template: "%s · Cofre Familiar" },
  description: "Recuerdos, personas, fechas, cartas, cápsulas, sueños y proyectos de tu familia.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
