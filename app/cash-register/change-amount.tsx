import { GenericForm } from "@/components/forms/generic-form";
import {
  changeAmountFormConfig,
  ChangeAmountFormSchema,
} from "@/components/forms/schemas/exchange";
import { MouseEventHandler } from "react";
import { z } from "zod";

function ChangeAmountForm({
  primaryAmount,
  secondaryAmount,
  cancelClick,
  onSubmit,
}: {
  primaryAmount: number;
  secondaryAmount: number;
  cancelClick: MouseEventHandler;
  onSubmit: (data: z.infer<typeof ChangeAmountFormSchema>) => void;
}) {
  return (
    <GenericForm
      defaultValues={{ primaryAmount, secondaryAmount }}
      formConfig={changeAmountFormConfig}
      onSubmit={onSubmit}
      schema={ChangeAmountFormSchema}
      onCancelClick={cancelClick}
    ></GenericForm>
  );
}

export default ChangeAmountForm;
