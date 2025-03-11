"use client";
import CellActionButton from "@/components/data-table/cell-action-button";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { GenericForm } from "@/components/forms/generic-form";
import {
  warehouseEditFormConfig,
  WarehouseFormSchema,
} from "@/components/forms/schemas/warehouse";
import Link from "next/link";
import ErrorMessage from "@/components/error-message";

function WarehouseTable() {
  const { data, error, setError, fetchData, handleDelete, handleSubmit, isLoading } =
    useCrudOperations("/api/warehouse");
  const [showEdit, setShowEdit] = useState(false);
  const [warehouseToUpdate, setWarehouseToUpdate] = useState({
    _id: "",
    name: "",
    productId: "",
    purchasePrice: 0,
    salePrice: 0,
    category: "",
    stock: 0,
  });

  const handleEdit = async (id: string) => {
    const warehouse = data.find((item: Product) => item._id === id);

    if (warehouse) {
      setWarehouseToUpdate(warehouse);
      setShowEdit(true);
    }
  };

  async function onSubmitEdit(data: z.infer<typeof WarehouseFormSchema>) {
    const filterData = { stock: data.stock };
    handleSubmit(filterData, warehouseToUpdate._id);
    setShowEdit(false);
  }

  const columns: ColumnDef<Warehouse>[] = [
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
      accessorKey: "purchasePrice",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio de Compra
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>${row.getValue("purchasePrice")}</div>,
    },
    {
      accessorKey: "salePrice",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio de Venta
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>${row.getValue("salePrice")}</div>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoría
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
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
      cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const warehouse = row.original;
        return (
          <CellActionButton
            handleDelete={() => handleDelete(warehouse._id)}
            handleEdit={() => handleEdit(warehouse._id)}
          />
        );
      },
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
        error={error}
        isLoading={isLoading}
        addHref="/warehouse/add"
      />

      {error && (
        <ErrorMessage
          error={error}
          onClose={() => setError("")}
          className="mt-2 m-auto"
        />
      )}

      {showEdit && (
        <Dialog open>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Item de Almacén</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Editar Ítem de Almacén</DialogTitle>

            <GenericForm
              defaultValues={warehouseToUpdate}
              formConfig={warehouseEditFormConfig}
              onCancelClick={() => setShowEdit(false)}
              onSubmit={onSubmitEdit}
              schema={WarehouseFormSchema}
            >
              <div>
                <p>Nombre: {warehouseToUpdate.name}</p>
                <p>Precio de compra: ${warehouseToUpdate.purchasePrice}</p>
                <p>Precio de venta: ${warehouseToUpdate.salePrice}</p>
                <p>Categoría: {warehouseToUpdate.category}</p>
              </div>

              <div>
                <p className="text-accent-foreground/35 text-sm">
                  Para cambiar estos valores, ve a la sección de{" "}
                  <Link href={"/products"} className="underline text-blue-800">
                    Productos
                  </Link>
                  .
                </p>
              </div>
            </GenericForm>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default WarehouseTable;
