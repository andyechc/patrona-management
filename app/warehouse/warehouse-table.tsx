"use client";
import CellActionButton from "@/components/data-table/cell-action-button";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash, X } from "lucide-react";
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
import Loading from "@/components/loading";
import { toast } from "sonner";
import AcceptAlert from "@/components/accept-alert";

function WarehouseTable() {
  const {
    data,
    error,
    setError,
    fetchData,
    handleDelete,
    handleSubmit,
    isLoading,
  } = useCrudOperations("/api/warehouse");
  const { data: cashRegister, fetchData: fetchCashRegister }: any =
    useCrudOperations("/api/cash-register");
  const [showEdit, setShowEdit] = useState(false);
  const [warehouseToUpdate, setWarehouseToUpdate] = useState({
    _id: "",
    name: "",
    productId: "",
    purchasePrice: 0,
    salePrice: 0,
    currency: "",
    category: "",
    stock: 0,
  });
  const [showAcceptAlert, setShowAcceptAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");

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
      accessorKey: "currency",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Moneda
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("currency")}</div>,
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
          <div className={"flex gap-2 "}>
            <Button
              variant={"destructive"}
              onClick={() => {
                setShowAcceptAlert(true);
                setIdToDelete(warehouse._id);
              }}
            >
              <Trash />
            </Button>

            <Button
              variant={"default"}
              onClick={() => handleEdit(warehouse._id)}
            >
              <Edit />
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
    fetchCashRegister();

    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error]);

  console.log(error);

  return (
    <>
      <DataTable
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar por nombre..."
        data={data}
        addHref="/warehouse/add"
      />

      {isLoading && <Loading />}

      {showAcceptAlert && (
        <AcceptAlert
          onAccept={() => {
            handleDelete(idToDelete);
            setShowAcceptAlert(false);
          }}
          title={"Eliminar Ítem de Almacén"}
          description={"Seguro que quieres eliminar este ítem de almacén"}
          onDecline={() => setShowAcceptAlert(false)}
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
              <div className="col-span-3">
                <p>Nombre: {warehouseToUpdate.name}</p>
                <p>Precio de compra: ${warehouseToUpdate.purchasePrice}</p>
                <p>Precio de venta: ${warehouseToUpdate.salePrice}</p>
                <p>Moneda: {warehouseToUpdate.currency}</p>
                <p>Categoría: {warehouseToUpdate.category}</p>
              </div>

              <div className="col-span-3">
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
