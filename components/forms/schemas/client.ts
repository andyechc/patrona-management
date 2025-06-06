import { z } from "zod";

export const ClientFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El Nombre debe tener al menos 2 caracteres.",
    })
    .trim(),
  email: z
    .string()
    .nullable()
    .or(z.string().email("El correo debe ser válido.")),
  phone: z
    .number()
    .nullable()
    .or(z.number().positive("El número de telefono debe ser positivo")),
  dni: z.string().nullable(),
  status: z.string(),
});

export type ClientFormValues = z.infer<typeof ClientFormSchema>;

export const clientFormConfig: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
    description: "Nombre y/o Apellidos",
    placeholder: "Jhon Doe",
  },
  {
    name: "email",
    label: "Correo Electrónico",
    type: "email",
    description: "Dirección de correo electrónico (opcional)",
    placeholder: "jhondoe@example.com",
  },
  {
    name: "phone",
    label: "Número de Teléfono",
    type: "number",
    description: "Número de teléfono celular o fijo (opcional)",
    placeholder: "12345678",
  },
  {
    name: "dni",
    label: "DNI",
    type: "text",
    description: "Número de identificación DNI o Pasaporte (opcional)",
    placeholder: "123456789ABCDEF",
  },
  {
    name: "status",
    label: "Estado",
    type: "select",
    selectData: [
      { name: "Activo", _id: "activo" },
      { name: "Inactivo", _id: "inactivo" },
    ],
    description: "Estado del Cliente",
    placeholder: "Selecciona el estado",
  },
];

export const ClientFormServicesSchema = z.object({
  description: z
    .string()
    .min(2, {
      message: "La descripción debe tener al menos 2 caracteres.",
    })
    .trim(),
  price: z.number().positive("El precio debe ser positivo"),
});

export type ClientFormServicesValues = z.infer<typeof ClientFormServicesSchema>;

export const clientFormServicesConfig: FormFieldConfig[] = [
  {
    name: "price",
    label: "Precio",
    type: "number",
    description: "Precio del servicio",
    placeholder: "0.00",
    colspan: 3,
  },
  {
    name: "description",
    label: "Descripción",
    type: "text",
    description: "Descripción del servicio",
    placeholder: "Servicio de Taxi",
    colspan: 3,
  },
];
