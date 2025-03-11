import { z } from "zod";

export const ExchangeFormSchema = z.object({
  to: z.string(),
  exchange: z.number().min(1, { message: "La taza de cambio mínima debe ser mayor a 0." }),
  amount: z.number().nonnegative("La cantidad no puede ser negativa")
});

export type ExchangeFormValues = z.infer<typeof ExchangeFormSchema>;

export const exchangeFormConfig: FormFieldConfig[] = [
  {
    name: "from",
    label: "Moneda a Cambiar",
    type: "select",
    description: "La moneda que desea cambiar.",
    placeholder: "Seleciona la moneda",
  },
  {
    name: "to",
    label: "Moneda Objetivo",
    type: "select",
    description: "La moneda que desea obtener.",
    placeholder: "Selecciona la moneda.",
  },
  {
    name: "exchange",
    label: "Monto de Cambio",
    type: "number",
    description: "El monto al que desea realizar el cambio.",
    placeholder: "0",
  },
];

export const ChangeAmountFormSchema = z.object({
  primaryAmount: z.number().nonnegative("La cantidad no puede ser negativa"),
  secondaryAmount: z.number().nonnegative("La cantidad no puede ser negativa")
});

export type ChangeAmountFormValues = z.infer<typeof ChangeAmountFormSchema>;

export const changeAmountFormConfig: FormFieldConfig[] = [
  {
    name: "primaryAmount",
    label: "Fondo USD",
    type: "number",
    placeholder: "0",
    step: 1,
  },
  {
    name: "secondaryAmount",
    label: "Fondo CUP",
    type: "number",
    placeholder: "0",
    step: 1
  },
];

