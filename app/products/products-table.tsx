"use client";
import CellActionButton from "@/components/data-table/cell-action-button";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, Edit, Trash, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  productsFormConfig,
  ProductsFormSchema,
} from "@/components/forms/schemas/product";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import AcceptAlert from "@/components/accept-alert";
import { toast } from "sonner";

function ProductsTable() {
  const [showEdit, setShowEdit] = useState(false);
  const { data, error, isLoading, fetchData, handleDelete, handleSubmit } =
    useCrudOperations("/api/products");

  const [productToUpdate, setProductToUpdate]: [
    Product,
    Dispatch<SetStateAction<Product>>,
  ] = useState({
    _id: "",
    name: "",
    purchasePrice: 0,
    salePrice: 0,
    category: "",
    currency: "",
  });
  const [showAcceptAlert, setShowAcceptAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");

  const handleEdit = async (id: string) => {
    const product = data.find((item: Product) => item._id === id);
    if (product) {
      setProductToUpdate(product);
      setShowEdit(true);
    }
  };

  async function onSubmitEdit(data: z.infer<typeof ProductsFormSchema>) {
    handleSubmit(data, productToUpdate?._id);
    setShowEdit(false);
  }

  const columns: ColumnDef<Product>[] = [
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className={"flex gap-2 "}>
            <Button
              variant={"destructive"}
              onClick={() => {
                setShowAcceptAlert(true);
                setIdToDelete(product._id);
              }}
            >
              <Trash />
            </Button>

            <Button variant={"default"} onClick={() => handleEdit(product._id)}>
              <Edit />
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error]);

  return (
    <>
      <DataTable
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar por nombre..."
        data={data}
        addHref="/products/add"
      />

      {isLoading && <Loading />}

      {showAcceptAlert && (
        <AcceptAlert
          onAccept={() => {
            handleDelete(idToDelete);
            setShowAcceptAlert(false);
          }}
          description={"Seguro que desea eliminar este producto?"}
          title={"Eliminar Producto"}
          onDecline={() => setShowAcceptAlert(false)}
        />
      )}

      {showEdit && (
        <Dialog open>
          <DialogTrigger asChild>
            <Button variant="outline">Editar Producto</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Editar Producto</DialogTitle>

            <GenericForm
              defaultValues={productToUpdate}
              formConfig={productsFormConfig}
              onSubmit={onSubmitEdit}
              schema={ProductsFormSchema}
              onCancelClick={() => setShowEdit(false)}
              selectData={[
                { _id: "CUP", name: "CUP" },
                { _id: "USD", name: "USD" },
              ]}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ProductsTable;
