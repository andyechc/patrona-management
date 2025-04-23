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
import {
  notesFormConfig,
  NotesFormSchema,
} from "@/components/forms/schemas/notes";

function NotesAddForm() {
  const { error, setError, isLoading, handleSubmit } =
    useCrudOperations("/api/notes");
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof NotesFormSchema>) {
    setIsFinished(false);
    handleSubmit(data);
    setIsFinished(true);
  }

  return (
    <GenericForm
      formConfig={notesFormConfig}
      onSubmit={onSubmit}
      schema={NotesFormSchema}
      defaultValues={{
        title: "",
        description: "",
      }}
      onCancelClick={() => router.replace("/notes")}
      gridcols={4}
    >
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Registro Creado Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.replace("/notes")}
        />
      )}
    </GenericForm>
  );
}

export default NotesAddForm;
