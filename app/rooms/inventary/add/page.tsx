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
  inventaryFormConfig,
  InventaryFormSchema,
} from "@/components/forms/schemas/room";
import PageSection from "@/components/page-section";

function InventaryAddPageContent() {
  const { data, fetchData, error, setError, isLoading, handleSubmit }: any =
    useCrudOperations("/api/rooms");
  const [isFinished, setIsFinished] = useState(false);
  const room: Room = data;
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  useEffect(() => {
    fetchData(id);
  }, []);

  async function onSubmit(item: z.infer<typeof InventaryFormSchema>) {
    console.log(item);
    setIsFinished(false);
    room.inventary?.push(item);

    const data = {
      inventary: room.inventary || [item],
      inventaryEditedId:
        Date.now().toString(36) + Math.random().toString(36).substring(2),
    };
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
      <Suspense>
        {error && <ErrorMessage error={error} onClose={() => setError("")} />}
        {isLoading && <Loading />}
        {!error && !isLoading && isFinished && (
          <SuccessMessage
            text="Datos Creados Correctamente"
            title="Tarea Exitosa!"
            handleConfirm={() => router.replace("/rooms/" + id)}
          />
        )}
        <GenericForm
          formConfig={inventaryFormConfig}
          onSubmit={onSubmit}
          schema={InventaryFormSchema}
          defaultValues={{}}
          onCancelClick={() => router.replace("/rooms/" + id)}
        ></GenericForm>
      </Suspense>
    </PageSection>
  );
}

export default function InventaryAddPage() {
  return (
    <Suspense fallback={<Loading />}>
      <InventaryAddPageContent />
    </Suspense>
  );
}
