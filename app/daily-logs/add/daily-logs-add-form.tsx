"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { GenericForm } from "@/components/forms/generic-form";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import SuccessMessage from "@/components/success-mesage";
import { useState } from "react";
import {
  dailyLogsFormConfig,
  DailyLogsFormSchema,
} from "@/components/forms/schemas/daily-logs";

function DailyLogsAddForm() {
  const { error, setError, isLoading, handleSubmit } = useCrudOperations(
    "/api/operations-log"
  );
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof DailyLogsFormSchema>) {
    console.log("Formulario", data)
    setIsFinished(false);
    handleSubmit(data);
    setIsFinished(true);
  }

  return (
    <GenericForm
      formConfig={dailyLogsFormConfig}
      onSubmit={onSubmit}
      schema={DailyLogsFormSchema}
      defaultValues={{
        type: "",
        title: "",
        description: "",
        currency: "",
        amount: 0,
      }}
      onCancelClick={() => router.back()}
      gridcols={4}
    >
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Registro Creado Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.back()}
        />
      )}
    </GenericForm>
  );
}

export default DailyLogsAddForm;
