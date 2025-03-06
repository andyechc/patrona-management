import { Metadata } from "next";
import "../app/globals.css";

export const metadata: Metadata = {
  title: "404 Pagina No Encontrada",
  description: "Sistema de Gestion de Contabilidad de La Patrona",
};

export default function ErrorPageLayout({ children }: {children: React.ReactNode}) {
  return (
      <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}