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
    step: 1,
    description: "Cantidad que existe en la Habitación",
    placeholder: "0",
  },
];

//Products
export const ProductsFormSchema = z.object({
  product: z.string(),
  stock: z.number().min(1, "La cantidad mínima es 1"),
});

export type ProductsFormValues = z.infer<typeof ProductsFormSchema>;

export const productFormConfig: FormFieldConfig[] = [
  {
    name: "product",
    label: "Producto de Almacén",
    type: "select",
    description:
      "Seleciona un producto existente en el almacén, para incorporarlo a esta habitación.",
    placeholder: "Selecciona un producto.",
    colspan: 3,
  },
  {
    name: "stock",
    label: "Cantidad",
    type: "number",
    step: 1,
    description: "Cantidad que existe en la Habitación",
    placeholder: "0",
  },
];

export const ProductsEditFormSchema = z.object({
  stock: z.number().min(1, "La cantidad mínima es 1"),
});

export type ProductsEditFormValues = z.infer<typeof ProductsEditFormSchema>;

export const productEditFormConfig: FormFieldConfig[] = [
  {
    name: "stock",
    label: "Cantidad",
    type: "number",
    step: 1,
    description: "Cantidad que existe en la Habitación",
    placeholder: "0",
  },
];
