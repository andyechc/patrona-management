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

function RoomTable() {
  const { data, error, setError, fetchData, isLoading } =
    useCrudOperations("/api/rooms");

  const columns: ColumnDef<Room>[] = [
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
          href={"/rooms/" + row.original._id}
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
        addHref="/rooms/add"
      />

      {error && (
        <ErrorMessage
          error={error}
          onClose={() => setError("")}
          className="mt-2 m-auto"
        />
      )}

      {isLoading && <Loading />}
    </>
  );
}

export default RoomTable;
