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
import {
  clientFormConfig,
  ClientFormSchema,
} from "@/components/forms/schemas/client";

function ClientAddForm() {
  const { error, isLoading, handleSubmit } = useCrudOperations("/api/clients");
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  const onSubmit = (data: z.infer<typeof ClientFormSchema>) => {
    setIsFinished(false);
    handleSubmit(data);
    setIsFinished(true);
  };

  return (
    <GenericForm
      defaultValues={{}}
      formConfig={clientFormConfig}
      schema={ClientFormSchema}
      onCancelClick={() => router.back()}
      onSubmit={onSubmit}
      gridcols={4}
    >
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} />}
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

export default ClientAddForm;
