"use client";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, CircleDotIcon } from "lucide-react";
import { useEffect } from "react";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import Link from "next/link";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";

function ClientsDetails({
  client,
  handleSubmit,
  updateDetails,
}: {
  client: Client;
  handleSubmit: () => void;
  updateDetails: () => void;
}) {
  return (
    <div className={"flex flex-col gap-8"}>
      <div className={"flex gap-4 flex-wrap"}>
        <p className={"text-xl font-bold  text-white/70"}>
          <small className={""}>email</small>
          {client.email || "No tiene email"}
        </p>
        <p className={"text-xl font-bold text-white/70"}>
          {client.phone || "No tiene teléfono"}
        </p>
        <p className={"text-xl font-bold text-white/70"}>
          {client.dni || "No tiene DNI"}
        </p>
        <p className={"text-xl font-bold text-white/70"}>
          {client.status === "activo" ? "Activo" : "Inactivo"}
        </p>
      </div>

      <div></div>
    </div>
  );
}

export default ClientsDetails;
