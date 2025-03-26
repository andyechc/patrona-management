"use client";
import CellActionButton from "@/components/data-table/cell-action-button";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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

function ProductsTable() {
  const [showEdit, setShowEdit] = useState(false);
  const {
    data,
    error,
    setError,
    isLoading,
    fetchData,
    handleDelete,
    handleSubmit,
  } = useCrudOperations("/api/products");

  const [productToUpdate, setProductToUpdate]: [
    Product,
    Dispatch<SetStateAction<Product>>
  ] = useState({
    _id: "",
    name: "",
    purchasePrice: 0,
    salePrice: 0,
    category: "",
    currency: "",
  });

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
          <CellActionButton
            handleDelete={() => handleDelete(product._id)}
            handleEdit={() => handleEdit(product._id)}
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
        addHref="/products/add"
      />

      {error && (
        <ErrorMessage
          error={error}
          onClose={() => setError("")}
          className="mt-2 m-auto"
        />
      )}

      {isLoading && <Loading />}

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
