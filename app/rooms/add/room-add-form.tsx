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
  const {
    data: rooms,
    error,
    setError,
    isLoading,
    handleSubmit,
    fetchData: fetchRooms,
  } = useCrudOperations("/api/rooms");
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
        "La cantidad del producto en la habitación excede a la del Almacén",
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

  useEffect(() => {
    fetchData();
    fetchRooms();
  }, []);

  return (
    <>
      <GenericForm
        defaultValues={defaultValues}
        formConfig={roomFormConfig}
        schema={RoomFormSchema}
        onCancelClick={() => router.replace("/rooms")}
        onSubmit={onSubmit}
        gridcols={4}
      >
        {isLoading && <Loading />}
        {!error && !isLoading && isFinished && (
          <SuccessMessage
            text="Datos Creados Correctamente"
            title="Tarea Exitosa!"
            handleConfirm={() => router.replace("/rooms")}
          />
        )}
      </GenericForm>
    </>
  );
}

export default RoomAddForm;
