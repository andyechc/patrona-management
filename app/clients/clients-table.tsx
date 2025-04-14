"use client";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown } from "lucide-react";
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
        <p
          className={`
            "p-2 flex items-center gap-2 text-${
              row.original.status === "activo" ? "green" : "red"
            }-500
          `}
        >
          {row.getValue("status")}
        </p>
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
        <div className="p-2 flex items-center justify-between">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Teléfonos
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="p-2 flex items-center justify-between">
          {row.getValue("phone") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Emails
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="p-2 flex items-center justify-between">
          {row.getValue("email") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "dni",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          DNI
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="p-2 flex items-center justify-between">
          {row.getValue("dni") || "N/A"}
        </div>
      ),
    },
    {
      id: "action",
      header: () => {},
      cell: ({ row }) => (
        <Link
          href={"/clients/" + row.original._id}
          className="p-2 flex items-center justify-between hover:underline bg-foreground rounded text-black"
        >
          <ArrowRight size={18} />
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
