"use client";

import { z } from "zod";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import SuccessMessage from "@/components/success-mesage";
import { useEffect, useState } from "react";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import {
  warehouseFormConfig,
  WarehouseFormSchema,
} from "@/components/forms/schemas/warehouse";
import { GenericForm } from "@/components/forms/generic-form";

function WarehouseForm() {
  const { error, setError, isLoading, handleSubmit } =
    useCrudOperations("/api/warehouse");
  const { data, fetchData } = useCrudOperations("/api/products");
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof WarehouseFormSchema>) {
    setIsFinished(false);
    handleSubmit(data);
    setIsFinished(true);
  }

  useEffect(fetchData, []);

  return (
    <GenericForm
      defaultValues={{
        productId: "",
        stock: 0,
      }}
      formConfig={warehouseFormConfig}
      onCancelClick={() => router.back()}
      onSubmit={onSubmit}
      schema={WarehouseFormSchema}
      selectData={data}
    >
      {error && <ErrorMessage error={error} />}
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

export default WarehouseForm;
