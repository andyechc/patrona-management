import { z } from "zod";

export const DailyLogsFormSchema = z.object({
  type: z.string(),
  title: z.string().min(1, "El Título debe tener al menos 2 caracteres."),
  description: z
    .string()
    .max(300, "La descripción no puede ser de más de 300 caracteres."),
  amount: z.number().nonnegative("La cantidad no puede ser negativa").optional(),
  currency: z.string().optional()
});

export type DailyLogsFormValues = z.infer<typeof DailyLogsFormSchema>;

export const dailyLogsFormConfig: FormFieldConfig[] = [
  {
    name: "type",
    label: "Tipo de Registro",
    type: "select",
    description:
      "Esto influye en el color del punto en la tabla: Rojo - Pérdida, Verde - Ganancia, Amarillo - Advertencia y Gris - Informativo.",
    placeholder: "Selecciona el tipo",
    selectData: [
      { _id: "losses", name: "Pérdida" },
      { _id: "gains", name: "Ganancia" },
      { _id: "info", name: "Informativo" },
      { _id: "warn", name: "Advertencia" },
    ],
  },
  {
    name: "title",
    label: "Título",
    type: "text",
    description: "El título debe ser corto y generalizado.",
    placeholder: "Nuevo Registro",
  },
  {
    name: "amount",
    label: "Cantidad",
    type: "number",
    description:
      "En caso de ser el registro de tipo GANANCIA/PÉRDIDA esta será la cantidad ganada/perdida. Dejar vacío en caso contrario.",
    placeholder: "0.00",
  },
  {
    name: "currency",
    label: "Moneda",
    type: "select",
    description: "El tipo de moneda a amuentar/restar a la caja.",
    placeholder: "Selecciona la moneda",
    selectData: [
      { _id: "CUP", name: "CUP" },
      { _id: "USD", name: "USD" },
    ],
  },
  {
    name: "description",
    label: "Descripción",
    type: "textarea",
    description:
      "La descripción debe ser explicativa abarcando lo realizado. En caso de ser el registro de tipo GANANCIA/PÉRDIDA debe de mencional la cantidad ganada/perdida.",
    placeholder: "Descripción del nuevo registro.",
    colspan: 3,
  },
];
