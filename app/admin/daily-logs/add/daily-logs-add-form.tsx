"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { GenericForm } from "@/components/forms/generic-form";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import SuccessMessage from "@/components/success-mesage";
import { useEffect, useState } from "react";
import {
  dailyLogsFormConfig,
  DailyLogsFormSchema,
} from "@/components/forms/schemas/daily-logs";
import { toast } from "sonner";
import { X } from "lucide-react";

function DailyLogsAddForm() {
  const { error, isLoading, handleSubmit } = useCrudOperations(
    "/api/operations-log",
  );
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof DailyLogsFormSchema>) {
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
      onCancelClick={() => router.replace("/admin/daily-logs")}
      gridcols={4}
    >
      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Registro Creado Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.replace("/admin/daily-logs")}
        />
      )}
    </GenericForm>
  );
}

export default DailyLogsAddForm;
