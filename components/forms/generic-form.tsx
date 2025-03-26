"use client";
import { Form } from "@/components/ui/form";
import { DynamicFormField } from "./dynamic-form-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

export const GenericForm = ({
  schema,
  defaultValues,
  onSubmit,
  formConfig,
  onCancelClick = undefined,
  selectData = [],
  gridcols=3,
  children,
}: GenericFormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`w-full grid gap-4 grid-cols-${gridcols}`}
      >
        {children}
        {formConfig.map((field) => (
          <DynamicFormField
            key={field.name}
            control={form.control}
            selectData={selectData}
            {...field}
          />
        ))}
        <div className="col-span-3 mt-5">
          {onCancelClick && (
            <Button
              className="bg-red-900 hover:bg-red-950 text-300 rounded cursor-pointer"
              onClick={onCancelClick}
              type="button"
            >
              Cancelar
            </Button>
          )}
          <Button className="rounded cursor-pointer ml-2" type="submit">
            Aceptar
          </Button>
        </div>
      </form>
    </Form>
  );
};
