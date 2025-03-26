import { z } from "zod";

export const RoomFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El Nombre debe tener al menos 2 caracteres.",
    })
    .trim(),
});

export type RoomFormValues = z.infer<typeof RoomFormSchema>;

export const roomFormConfig: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
    description: "Nombre visible de la Habitación",
    placeholder: "Habitación X",
  },
];

//Inventary
export const InventaryFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El Nombre debe tener al menos 2 caracteres.",
    })
    .trim(),
  stock: z.number().min(1, "La cantidad mínima es 1"),
});

export type InventaryFormValues = z.infer<typeof InventaryFormSchema>;

export const inventaryFormConfig: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
    description: "Nombre del Ítem de Inventario",
    placeholder: "Ítem",
  },
  {
    name: "stock",
    label: "Cantidad",
    type: "number",
    description: "Cantidad que existe en la Habitación",
    placeholder: "0",
  },
];
