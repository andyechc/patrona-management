'use client'

import ErrorMessage from "@/components/error-message";
import { GenericForm } from "@/components/forms/generic-form";
import {
  roomFormConfig,
  RoomFormSchema,
} from "@/components/forms/schemas/room";
import Loading from "@/components/loading";
import SuccessMessage from "@/components/success-mesage";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

function RoomAddForm() {
  const { error, setError, isLoading, handleSubmit } = useCrudOperations("/api/rooms");
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();
  const defaultValues = { name: "" };

  const onSubmit = (data: z.infer<typeof RoomFormSchema>) => {
    setIsFinished(false);
    handleSubmit(data);
    setIsFinished(true)
  };

  return (
    <GenericForm
      defaultValues={defaultValues}
      formConfig={roomFormConfig}
      schema={RoomFormSchema}
      onCancelClick={() => router.back()}
      onSubmit={onSubmit}
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

export default RoomAddForm;
