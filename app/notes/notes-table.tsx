"use client";
import { DataTable } from "@/components/data-table/data-table";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import parseDate from "@/utils/parse-date";
import { typeLogParser } from "@/utils/type-log-parser";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, File, Trash2 } from "lucide-react";
import { useEffect } from "react";

export default function NotesTable() {
  const { data, error, setError, isLoading, fetchData, handleDelete }: any =
    useCrudOperations("/api/notes");

  const handleExport = async () => {
    try {
      const response = await fetch("/api/notes/export");
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "observaciones.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: any) {
      setError(error);
    }
  };

  const columns: ColumnDef<DailyLog>[] = [
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

  useEffect(fetchData, []);

  return (
    <div className="flex flex-col gap-2">
      <DataTable
        addHref="/notes/add"
        columns={columns}
        data={data}
        searchKey="date"
        searchPlaceholder="Busqueda por fecha"
        actionComponents={
          <>
            <Button
              variant={"destructive"}
              className="rounded"
              onClick={() => handleDelete()}
            >
              <Trash2 />
              Eliminar Observaciones
            </Button>
            <Button
              variant={"outline"}
              className="rounded"
              onClick={handleExport}
            >
              <File />
              Exportar Observaciones
            </Button>
          </>
        }
      />
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
    </div>
  );
}
