"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import {
  productsFormConfig,
  ProductsFormSchema,
} from "@/components/forms/schemas/product";
import { GenericForm } from "@/components/forms/generic-form";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import SuccessMessage from "@/components/success-mesage";
import { useState } from "react";

function ProductAddForm() {
  const { error, setError, isLoading, handleSubmit } =
    useCrudOperations("/api/products");
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof ProductsFormSchema>) {
    setIsFinished(false);

    if (data.purchasePrice > data.salePrice) {
      setError("El precio de venta no puede ser menor al precio de compra");
      return;
    } else {
      handleSubmit(data);
      setIsFinished(true);
    }
  }

  return (
    <GenericForm
      formConfig={productsFormConfig}
      onSubmit={onSubmit}
      schema={ProductsFormSchema}
      defaultValues={{
        name: "",
        purchasePrice: 0,
        salePrice: 0,
        category: "",
      }}
      onCancelClick={() => router.back()}
    >
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Datos Creados Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.back()}
        />
      )}
    </GenericForm>
  );
}

export default ProductAddForm;
