"use client";

import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { GenericForm } from "@/components/forms/generic-form";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import SuccessMessage from "@/components/success-mesage";
import { Suspense, useEffect, useState } from "react";
import {
  productFormConfig,
  ProductsFormSchema,
} from "@/components/forms/schemas/room";
import PageSection from "@/components/page-section";
import { toast } from "sonner";
import { X } from "lucide-react";
import excludeFromArray from "@/utils/excludeFromArray";

function ProductsAddPageContent() {
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

    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error]);

  async function onSubmit(data: z.infer<typeof ProductsFormSchema>) {
    setIsFinished(false);
    const referenceWarehouse = productList.find(
      (item: Warehouse) => item.productId === data.product,
    );

    if (data.stock > referenceWarehouse.stock) {
      return setError(
        "La cantidad del producto en la habitación excede a la del Almacén",
      );
    }

    const newData = room.products.map(
      (prod: { product: Product; stock: number }) => {
        return { stock: prod.stock, product: prod.product._id };
      },
    );

    newData.push(data);
    handleSubmit({ products: newData, productEditedId: data.product }, id);
    setIsFinished(true);
  }

  if (!room) {
    return (
      <PageSection title="">
        <Loading />
      </PageSection>
    );
  }
  console.log(room.products, productList);
  return (
    <PageSection title="Añadir Nuevo Producto a la Habitación">
      <Suspense>
        {isLoading && <Loading />}
        {!error && !isLoading && isFinished && (
          <SuccessMessage
            text="Datos Creados Correctamente"
            title="Tarea Exitosa!"
            handleConfirm={() => router.replace("/rooms/" + id)}
          />
        )}
        <GenericForm
          formConfig={productFormConfig}
          onSubmit={onSubmit}
          schema={ProductsFormSchema}
          defaultValues={{}}
          selectData={
            (data.products &&
              excludeFromArray(
                productList,
                room.products,
                "productId",
                "product",
                "_id",
              )) ||
            []
          }
          onCancelClick={() => router.replace("/rooms/" + id)}
        ></GenericForm>
      </Suspense>
    </PageSection>
  );
}

export default function ProductAddPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsAddPageContent />
    </Suspense>
  );
}
