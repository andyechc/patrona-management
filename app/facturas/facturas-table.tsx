"use client";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, Trash, X } from "lucide-react";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AcceptAlert from "@/components/accept-alert";

function FacturasTable() {
  const { data, error, isLoading, fetchData, handleDelete } =
    useCrudOperations("/api/facturas");
  const router = useRouter();
  const [showAcceptAlert, setShowAcceptAlert] = useState(false);
  const [facturaDeleteId, setFacturaDeleteId] = useState("");

  useEffect(() => {
    fetchData();

    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error]);

  const columns: ColumnDef<Factura>[] = [
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
        <div
          className={`text-foreground rounded px-2 py-1 text-center ${row.original.status === "pendiente" ? "bg-amber-800" : "bg-green-800"}`}
        >
          {row.getValue("status")}
        </div>
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
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
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
      cell: ({ row }) => <div>{row.getValue("dni") || "N/A"}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const factura = row.original;
        return (
          <div className={"flex gap-2 "}>
            <Button
              variant={"destructive"}
              onClick={() => {
                setFacturaDeleteId(factura._id);
                setShowAcceptAlert(true);
              }}
            >
              <Trash />
            </Button>

            <Button
              variant={"default"}
              onClick={() => router.push("/facturas/" + row.original._id)}
            >
              <ArrowRight />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar por nombre..."
        data={data}
      />

      {isLoading && <Loading />}

      {showAcceptAlert && (
        <AcceptAlert
          onAccept={() => {
            handleDelete(facturaDeleteId);
            setShowAcceptAlert(false);
          }}
          onDecline={() => setShowAcceptAlert(false)}
          description={"Seguro qué desea eliminar esta Factura."}
          title={"Eliminar Factura"}
          color={"red"}
          buttonText={"Eliminar"}
        />
      )}
    </>
  );
}

export default FacturasTable;
