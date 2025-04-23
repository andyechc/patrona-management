"use client";
import { DataTable } from "@/components/data-table/data-table";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import parseDate from "@/utils/parse-date";
import { typeLogParser } from "@/utils/type-log-parser";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, File, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AcceptAlert from "@/components/accept-alert";

export default function DailyLogsTable() {
  const { data, error, setError, isLoading, fetchData, handleDelete }: any =
    useCrudOperations("/api/operations-log");
  const [showAcceptAlert, setShowAcceptAlert] = useState(false);

  const handleExport = async () => {
    try {
      const response = await fetch("/api/operations-log/export");
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "registros.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: any) {
      setError(error);
    }
  };

  const columns: ColumnDef<DailyLog>[] = [
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{typeLogParser(row.getValue("type"))}</div>,
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
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Título
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-wrap min-w-[200px]">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Descripción
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-wrap min-w-[250px]">
          {row.getValue("description")}
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <DataTable
        addHref="/daily-logs/add"
        columns={columns}
        data={data}
        searchKey="date"
        searchPlaceholder="Busqueda por fecha"
        actionComponents={
          <>
            <Button
              variant={"destructive"}
              className="rounded"
              onClick={() => setShowAcceptAlert(true)}
            >
              <Trash2 />
              Eliminar Registros
            </Button>
            <Button
              variant={"outline"}
              className="rounded"
              onClick={handleExport}
            >
              <File />
              Exportar Registros
            </Button>
          </>
        }
      />
      {isLoading && <Loading />}

      {showAcceptAlert && (
        <AcceptAlert
          onAccept={() => {
            handleDelete();
            setShowAcceptAlert(false);
          }}
          onDecline={() => setShowAcceptAlert(false)}
          description={
            "Seguro que desea eliminar los Registros. Aegúrate de exportarlos antes."
          }
          title={"Eliminar Registros"}
        />
      )}
    </div>
  );
}
