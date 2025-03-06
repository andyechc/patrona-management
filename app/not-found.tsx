"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import ErrorPageLayout from "../components/error-page-layout";

export default function NotFound() {
  const url = usePathname();
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <ErrorPageLayout>
      <main className="flex flex-col items-center justify-center gap-5 w-screen h-screen">
        <h1 className="text-7xl font-extrabold">404</h1>
        <p className="w-xl text-center">
          Ups! la URL <b className="font-bold bg-accent px-1 rounded">{url}</b>{" "}
          que intentaste acceder no existe. Verifica que la hayas escrito
          correctamente o que lo que deseas acceder exista.
        </p>
        <Button
          className="bg-background border border-accent text-white rounded cursor-pointer hover:text-background"
          onClick={handleClick}
        >
          Volver
        </Button>
      </main>
    </ErrorPageLayout>
  );
}
