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
    handleSubmit(data);
    setIsFinished(true);
  }

  return (
    <GenericForm
      formConfig={productsFormConfig}
      onSubmit={onSubmit}
      schema={ProductsFormSchema}
      defaultValues={{
        name: "",
        purchasePrice: undefined,
        salePrice: undefined,
        category: "",
        currency: "",
      }}
      onCancelClick={() => router.back()}
      selectData={[
        { _id: "CUP", name: "CUP" },
        { _id: "USD", name: "USD" },
      ]}
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
