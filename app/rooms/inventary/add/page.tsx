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
  inventaryFormConfig,
  InventaryFormSchema,
} from "@/components/forms/schemas/room";
import PageSection from "@/components/page-section";

function InventaryAddPage() {
  const { data, fetchData, error, setError, isLoading, handleSubmit }: any =
    useCrudOperations("/api/rooms");
  const [isFinished, setIsFinished] = useState(false);
  const room: Room = data.data;
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  useEffect(() => {
    fetchData(id);
  }, []);

  async function onSubmit(item: z.infer<typeof InventaryFormSchema>) {
    setIsFinished(false);
    room.inventary.push(item);
    const data = { inventary: room.inventary };
    handleSubmit(data, id);
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
    <PageSection title="Añadir Nuevo Ítem de Inventario">
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Datos Creados Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.back()}
        />
      )}
      <GenericForm
        formConfig={inventaryFormConfig}
        onSubmit={onSubmit}
        schema={InventaryFormSchema}
        defaultValues={{}}
        onCancelClick={() => router.back()}
      ></GenericForm>
    </PageSection>
  );
}

export default InventaryAddPage;
