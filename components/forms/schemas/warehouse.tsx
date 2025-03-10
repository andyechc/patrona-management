import { z } from "zod";

export const WarehouseFormSchema = z.object({
  productId: z.string(),
  stock: z.number().min(1, { message: "La cantidad mínima es 1" }),
});

export type WarehouseFormValues = z.infer<typeof WarehouseFormSchema>;

export const warehouseFormConfig: FormFieldConfig[] = [
  {
    name: "productId",
    label: "Producto",
    type: "select",
    description: "El producto que decea enviar al Almacén",
    placeholder: "Seleciona un producto",
  },{
    name: "stock",
    label: "Cantidad",
    type: "number",
    step: 1,
    description: "Cantidad de este producto en el Almacén",
    placeholder: "0"
  },
];

export const warehouseEditFormConfig: FormFieldConfig[] = [
  {
    name: "stock",
    label: "Cantidad",
    type: "number",
    step: 1,
    description: "Cantidad de este producto en el Almacén",
    placeholder: "0"
  },
];