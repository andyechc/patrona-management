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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

function ProductAddForm() {
  const { error, isLoading, handleSubmit } = useCrudOperations("/api/products");
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof ProductsFormSchema>) {
    setIsFinished(false);
    handleSubmit(data);
    setIsFinished(true);
  }

  useEffect(() => {
    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error]);

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
      onCancelClick={() => router.replace("/products")}
      selectData={[
        { _id: "CUP", name: "CUP" },
        { _id: "USD", name: "USD" },
      ]}
    >
      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Datos Creados Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.replace("/products")}
        />
      )}
    </GenericForm>
  );
}

export default ProductAddForm;
