"use client";

import ErrorMessage from "@/components/error-message";
import { GenericForm } from "@/components/forms/generic-form";
import {
  inventaryFormConfig,
  InventaryFormSchema,
  productFormConfig,
  ProductsFormSchema,
  roomFormConfig,
  RoomFormSchema,
} from "@/components/forms/schemas/room";
import Loading from "@/components/loading";
import SuccessMessage from "@/components/success-mesage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const inventaryDefaultValue: { name: string; stock: number }[] = [];
const productsDefaultValue: { product: string; stock: number }[] = [];

function RoomAddForm() {
  const [inventary, setinventary] = useState(inventaryDefaultValue);
  const [showAddInventary, setshowAddInventary] = useState(false);
  const [products, setproducts] = useState(productsDefaultValue);
  const [showAddProducts, setshowAddProducts] = useState(false);
  const { error, setError, isLoading, handleSubmit } =
    useCrudOperations("/api/rooms");
  const { data: productList, fetchData }: any =
    useCrudOperations("/api/warehouse");
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();
  const defaultValues = { name: "" };

  const onSubmitEditInventary = (data: z.infer<typeof InventaryFormSchema>) => {
    setinventary((prev: any) => (prev.length > 0 ? [...prev, data] : [data]));
    setshowAddInventary(false);
  };

  const onSubmitEditProduct = (data: z.infer<typeof ProductsFormSchema>) => {
    const { stock, product } = data;

    const referenceWarehouse = productList.find(
      (item: Warehouse) => item.productId === product,
    );

    if (data.stock > referenceWarehouse.stock) {
      return setError(
        "La cantidad del producto en la habitación sobrepasa a la del Almacén",
      );
    }

    setproducts((prev: any) =>
      prev.length > 0 ? [...prev, { stock, product }] : [{ product, stock }],
    );
    setshowAddProducts(false);
  };

  const handleDelete = (i: number, type: "product" | "inventary") => {
    if (type === "product") {
      const newProds = products.filter((_prod, index) => i !== index);
      setproducts(newProds);
    } else {
      const newInventary = inventary.filter((_inve, index) => i !== index);
      setinventary(newInventary);
    }
  };

  const onSubmit = (data: z.infer<typeof RoomFormSchema>) => {
    setIsFinished(false);

    const newData = {
      ...data,
      inventary,
      products,
    };

    handleSubmit(newData);
    setIsFinished(true);
  };

  useEffect(fetchData, []);

  return (
    <>
      <GenericForm
        defaultValues={defaultValues}
        formConfig={roomFormConfig}
        schema={RoomFormSchema}
        onCancelClick={() => router.back()}
        onSubmit={onSubmit}
        gridcols={4}
      >
        {isLoading && <Loading />}
        {!error && !isLoading && isFinished && (
          <SuccessMessage
            text="Datos Creados Correctamente"
            title="Tarea Exitosa!"
            handleConfirm={() => router.back()}
          />
        )}

        <div className="flex flex-col gap-8 col-span-3 mt-4">
          <div className="flex items-center gap-4 ">
            <b className="text-xl font-bold">Inventario</b>
            <Button
              variant={"default"}
              type="button"
              className="rounded cursor-pointer"
              size={"icon"}
              onClick={() => setshowAddInventary(true)}
            >
              <Plus />
            </Button>
          </div>

          <ul className="flex flex-col gap-2">
            {inventary.length > 0 ? (
              inventary.map((item, i) => (
                <li
                  key={i}
                  className="border-b border-border p-2 flex items-center gap-4"
                >
                  <Button
                    variant={"destructive"}
                    className="rounded cursor-pointer"
                    onClick={() => handleDelete(i, "inventary")}
                  >
                    <Trash2 size={20} color="white" />
                  </Button>
                  Nombre: {item.name}, Cantidad: {item.stock}
                </li>
              ))
            ) : (
              <li className="border-b border-border p-2">
                No hay ítems en el inventario
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-8 col-span-3 mt-4">
          <div className="flex items-center gap-4 ">
            <b className="text-xl font-bold">Productos</b>
            <Button
              variant={"default"}
              type="button"
              className="rounded cursor-pointer"
              size={"icon"}
              onClick={() => setshowAddProducts(true)}
            >
              <Plus />
            </Button>
          </div>

          <ul className="flex flex-col gap-2">
            {products.length > 0 ? (
              products.map((prod, i) => (
                <li
                  key={i}
                  className="border-b border-border p-2 flex items-center gap-4"
                >
                  <Button
                    variant={"destructive"}
                    className="rounded cursor-pointer"
                    onClick={() => handleDelete(i, "product")}
                  >
                    <Trash2 size={20} color="white" />
                  </Button>
                  Nombre:{" "}
                  {
                    productList.find(
                      (item: Warehouse) => item.productId === prod.product,
                    ).name
                  }
                  , Cantidad: {prod.stock}
                </li>
              ))
            ) : (
              <li className="border-b border-border p-2">No hay productos</li>
            )}
          </ul>
        </div>
      </GenericForm>

      {showAddInventary && (
        <Dialog open>
          <DialogContent className="rounded">
            <DialogTitle>Añade un Ítem</DialogTitle>

            <GenericForm
              defaultValues={{}}
              formConfig={inventaryFormConfig}
              onSubmit={onSubmitEditInventary}
              schema={InventaryFormSchema}
              onCancelClick={() => setshowAddInventary(false)}
            >
              {error && (
                <ErrorMessage error={error} onClose={() => setError("")} />
              )}
              {isLoading && <Loading />}
            </GenericForm>
          </DialogContent>
        </Dialog>
      )}

      {showAddProducts && (
        <Dialog open>
          <DialogContent className="rounded">
            <DialogTitle>Añade un Producto</DialogTitle>

            <GenericForm
              defaultValues={{}}
              formConfig={productFormConfig}
              onSubmit={onSubmitEditProduct}
              selectData={productList}
              schema={ProductsFormSchema}
              onCancelClick={() => setshowAddProducts(false)}
            >
              {error && (
                <ErrorMessage
                  error={error}
                  onClose={() => setError("")}
                  className="col-span-3"
                />
              )}
              {isLoading && <Loading />}
            </GenericForm>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default RoomAddForm;
