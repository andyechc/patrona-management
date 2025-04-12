import type { Metadata } from "next";
import "../app/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export const metadata: Metadata = {
  title: "La Patrona - Sistema de Gestión",
  description: "Sistema de Gestion de Contabilidad de La Patrona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full h-full flex flex-col gap-5">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
