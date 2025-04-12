"use client";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowRight,
  ArrowUpDown,
  CircleDotIcon,
  LucideDot,
} from "lucide-react";
import { useEffect } from "react";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import Link from "next/link";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";

function ClientsTable() {
  const { data, error, setError, fetchData, isLoading } =
    useCrudOperations("/api/clients");

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={"/clients/" + row.original._id}
          className="p-2 flex items-center gap-2 "
        >
          {row.getValue("status") === "activo" ? "Activo" : "Inactivo"}{" "}
          <CircleDotIcon
            size={18}
            color={row.original.status === "activo" ? "green" : "red"}
          />
        </Link>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombres
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={"/clients/" + row.original._id}
          className="p-2 flex items-center justify-between hover:underline"
        >
          {row.getValue("name")} <ArrowRight size={18} />
        </Link>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <DataTable
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar por nombre..."
        data={data}
        addHref="/clients/add"
      />

      {error && (
        <ErrorMessage
          error={error}
          onClose={() => setError("")}
          className="mt-2 m-auto col-span-3"
        />
      )}

      {isLoading && <Loading />}
    </>
  );
}

export default ClientsTable;
