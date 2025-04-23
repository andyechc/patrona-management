import { z } from "zod";

export const NotesFormSchema = z.object({
  title: z.string().min(1, "El Título debe tener al menos 2 caracteres."),
  description: z
    .string()
    .max(300, "La descripción no puede ser de más de 300 caracteres."),
});

export type NotesFormValues = z.infer<typeof NotesFormSchema>;

export const notesFormConfig: FormFieldConfig[] = [
  {
    name: "title",
    label: "Título",
    type: "text",
    description: "El título debe ser corto y generalizado.",
    placeholder: "Nueva Observación",
  },
  {
    name: "description",
    label: "Descripción",
    type: "textarea",
    description: "Esta es una descirpción para los observaciones.",
    placeholder: "Descripción de la nueva Observación.",
    colspan: 3,
  },
];
