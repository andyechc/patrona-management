"use client";
import CellActionButton from "@/components/data-table/cell-action-button";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

function InventaryTable({ inventary, id }: { inventary: any; id: string }) {
  const searchParams = useSearchParams();

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
      cell: ({ row }) => <p>{row.getValue("name")}</p>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cantidad
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <p>{row.getValue("stock")}</p>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <CellActionButton handleDelete={() => {}} handleEdit={() => {}} />
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      searchKey="name"
      searchPlaceholder="Buscar por nombre..."
      data={inventary}
      addHref={"/rooms/inventary/add?id=" + id}
    />
  );
}

export default InventaryTable;
