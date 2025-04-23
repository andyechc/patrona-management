"use client";
import CellActionButton from "@/components/data-table/cell-action-button";
import { DataTable } from "@/components/data-table/data-table";
import { GenericForm } from "@/components/forms/generic-form";
import {
  productEditFormConfig,
  ProductsEditFormSchema,
  ProductsFormSchema,
} from "@/components/forms/schemas/room";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import AcceptAlert from "@/components/accept-alert";

type ProductTableProps = {
  products: any[];
  id: string;
  handleSubmit: (value: any, id: string) => void;
  updateDetails: () => void;
  productList: any;
};

function ProductsTable({
  products,
  id,
  handleSubmit,
  updateDetails,
  productList,
}: ProductTableProps) {
  const [showEdit, setshowEdit] = useState(false);
  const [prodToEdit, setProdToEdit] = useState({
    _id: "",
    product: {
      name: "",
      salePrice: 0,
      _id: "",
    },
    stock: 0,
  });
  const [showAcceptAlert, setShowAcceptAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");

  const handleEdit = (id: string) => {
    const prodFound = products.find((prod) => prod._id === id);
    if (prodFound) {
      setProdToEdit(prodFound);
      setshowEdit(true);
    }
  };

  const onSubmitEdit = async (data: z.infer<typeof ProductsFormSchema>) => {
    if (prodToEdit.stock === data.stock) return setshowEdit(false);

    const referenceWarehouse: any = productList.find(
      (item: Warehouse) => item.productId === prodToEdit.product._id,
    );

    if (data.stock > referenceWarehouse.stock) {
      return;
    }

    const filterProducts = products.filter(
      (prod) => prod._id !== prodToEdit._id,
    );
    const newData = filterProducts.map((prod) => {
      return { stock: prod.stock, product: prod.product._id };
    });
    newData.push({ stock: data.stock, product: prodToEdit.product._id });

    handleSubmit(
      {
        products: newData,
        productEditedId: prodToEdit.product._id,
      },
      id,
    );
    updateDetails();
    setshowEdit(false);
  };

  const handleDelete = (idToDelete: string) => {
    const filterProducts = products.filter(
      (prod) => prod.product._id !== idToDelete,
    );
    const findProduct = products.find(
      (prod) => prod.product._id === idToDelete,
    );
    findProduct.stock = 0;
    filterProducts.push(findProduct);

    handleSubmit(
      {
        products: filterProducts,
        productEditedId: idToDelete,
      },
      id,
    );
    updateDetails();
  };

  const columns: ColumnDef<{
    _id: string;
    stock: number;
    product: Product;
  }>[] = [
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
      cell: ({ row }) => <p>{row.original.product.name}</p>,
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
      cell: ({ row }) => <p>${row.original.product.salePrice}</p>,
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
      cell: ({ row }) => {
        console.log(row.original);
        return <p>{row.getValue("stock")}</p>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className={"flex gap-2 "}>
            <Button
              variant={"destructive"}
              onClick={() => {
                setShowAcceptAlert(true);
                setIdToDelete(row.original.product._id);
              }}
            >
              <Trash />
            </Button>

            <Button
              variant={"default"}
              onClick={() => handleEdit(row.original._id)}
            >
              <Edit />
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
        data={products || []}
        addHref={"/rooms/products/add?id=" + id}
      />

      {showAcceptAlert && (
        <AcceptAlert
          onAccept={() => {
            handleDelete(idToDelete);
            setShowAcceptAlert(false);
          }}
          onDecline={() => setShowAcceptAlert(false)}
          description={
            "Seguro que desea eliminar este producto de esta habitación."
          }
          title={"Eliminar Producto de Habitación"}
        />
      )}

      {showEdit && (
        <Dialog open>
          <DialogContent className="rounded">
            <DialogTitle>
              Editar Producto: {prodToEdit.product.name} - $
              {prodToEdit.product.salePrice}
            </DialogTitle>

            <GenericForm
              defaultValues={prodToEdit}
              formConfig={productEditFormConfig}
              onSubmit={onSubmitEdit}
              schema={ProductsEditFormSchema}
              onCancelClick={() => setshowEdit(false)}
            >
              <p className={"text-sm col-span-3 text-white/70 "}>
                Cantidad Previa: {prodToEdit.stock}
              </p>
              <p className={"text-sm col-span-3 text-white/70 "}>
                Cantidad en Almacen:{" "}
                {
                  productList.find(
                    (item: Warehouse) =>
                      item.productId === prodToEdit.product._id,
                  ).stock
                }
              </p>
            </GenericForm>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ProductsTable;
