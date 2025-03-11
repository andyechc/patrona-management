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
  children,
}: GenericFormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {children}
        {formConfig.map((field) => (
          <DynamicFormField
            key={field.name}
            control={form.control}
            selectData={selectData}
            {...field}
          />
        ))}
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
      </form>
    </Form>
  );
};
