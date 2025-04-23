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
import { toast } from "sonner";
import { X } from "lucide-react";
import excludeFromArray from "@/utils/excludeFromArray";

function WarehouseForm() {
  const {
    data: warehouse,
    error,
    isLoading,
    handleSubmit,
    fetchData: fetchWarehouse,
  }: any = useCrudOperations("/api/warehouse");
  const { data: products, fetchData: fetchProducts } =
    useCrudOperations("/api/products");
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof WarehouseFormSchema>) {
    setIsFinished(false);
    handleSubmit(data);
    setIsFinished(true);
  }

  useEffect(() => {
    fetchProducts();
    fetchWarehouse();
    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error]);

  return (
    <GenericForm
      defaultValues={{
        productId: "",
        stock: 0,
      }}
      formConfig={warehouseFormConfig}
      onCancelClick={() => router.replace("/warehouse")}
      onSubmit={onSubmit}
      schema={WarehouseFormSchema}
      selectData={excludeFromArray(products, warehouse, "_id", "productId")}
      gridcols={5}
    >
      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Datos Creados Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.replace("/warehouse")}
        />
      )}
    </GenericForm>
  );
}

export default WarehouseForm;
