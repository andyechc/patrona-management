import { z } from "zod";

export const ProductsFormSchema = z.object({
  name: z.string().min(2, {
    message: "El Nombre debe tener al menos 2 caracteres.",
  }).trim(),
  purchasePrice: z
    .number()
    .nonnegative("El precio de compra no puede ser negativo")
    .min(0.01, { message: "El precio de compra minimo es 0.01" }),
  salePrice: z
    .number()
    .nonnegative("El precio de venta no puede ser negativo")
    .min(0.01, { message: "El precio de venta minimo es 0.01" }),
  category: z.string().min(2, {
    message: "La categoria debe tener al menos 2 caracteres.",
  }).trim(),
});

export type ProductFormValues = z.infer<typeof ProductsFormSchema>;

export const productsFormConfig: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
    description: "Nombre visible del producto",
    placeholder: "Nombre"
  },
  {
    name: "purchasePrice",
    label: "Precio de Compra",
    type: "number",
    step: 0.01,
    description: "Precio por el cual fue comprado el producto.",
    placeholder: "0.00"
  },
  {
    name: "salePrice",
    label: "Precio de Venta",
    type: "number",
    step: 0.01,
    description: "Precio por el cual será vendido el producto.",
    placeholder: "0.00"
  },
  {
    name: "category",
    label: "Categoría",
    type: "text",
    description: "Categoría que agrupa a este producto.",
    placeholder: "Categoría"
  },
];
