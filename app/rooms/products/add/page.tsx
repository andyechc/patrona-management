"use client";

import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { GenericForm } from "@/components/forms/generic-form";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import SuccessMessage from "@/components/success-mesage";
import { useEffect, useState } from "react";
import {
  productFormConfig,
  ProductsFormSchema,
} from "@/components/forms/schemas/room";
import PageSection from "@/components/page-section";

function ProductsAddPage() {
  const { data, fetchData, error, setError, isLoading, handleSubmit }: any =
    useCrudOperations("/api/rooms");
  const { data: productList, fetchData: fetchProductFromWarehouse }: any =
    useCrudOperations("/api/warehouse");
  const [isFinished, setIsFinished] = useState(false);
  const room: Room = data;
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  useEffect(() => {
    fetchData(id);
    fetchProductFromWarehouse();
  }, []);

  async function onSubmit(data: z.infer<typeof ProductsFormSchema>) {
    setIsFinished(false);
    const referenceWarehouse = productList.find(
      (item: Warehouse) => item.productId === data.product,
    );

    if (data.stock > referenceWarehouse.stock) {
      return setError(
        "La cantidad del producto en la habitación sobrepasa a la del Almacén",
      );
    }

    const newData = room.products.map(
      (prod: { product: Product; stock: number }) => {
        return { stock: prod.stock, product: prod.product._id };
      },
    );

    newData.push(data);
    console.log(newData);
    handleSubmit({ products: newData }, id);
    setIsFinished(true);
  }

  if (!room) {
    return (
      <PageSection title="">
        <Loading />
      </PageSection>
    );
  }

  return (
    <PageSection title="Añadir Nuevo Producto a la Habitación">
      {error && <ErrorMessage error={error} />}
      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Datos Creados Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.back()}
        />
      )}
      <GenericForm
        formConfig={productFormConfig}
        onSubmit={onSubmit}
        schema={ProductsFormSchema}
        defaultValues={{}}
        selectData={productList}
        onCancelClick={() => router.back()}
      ></GenericForm>
    </PageSection>
  );
}

export default ProductsAddPage;
