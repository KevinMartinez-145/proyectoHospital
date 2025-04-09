// src/schemas/tratamientoSchema.ts
import { z } from 'zod';

export const tratamientoFormSchema = z.object({
  id_paciente: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un paciente." })
    .int()
    .positive({ message: "Debe seleccionar un paciente válido." }),

  id_doctor: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un doctor." })
    .int()
    .positive({ message: "Debe seleccionar un doctor válido." }),

  descripcion: z.string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres." })
    .max(500, { message: "La descripción no puede exceder 500 caracteres." }),

  fecha_inicio: z.date({
    required_error: "La fecha de inicio es requerida.",
    invalid_type_error: "Fecha de inicio inválida.",
  }),

  fecha_fin: z.date({
    required_error: "La fecha de fin es requerida.",
    invalid_type_error: "Fecha de fin inválida.",
  }),
})
.refine(data => data.fecha_fin >= data.fecha_inicio, {
  message: "La fecha de fin no puede ser anterior a la fecha de inicio.",
  path: ["fecha_fin"], // Show error on the end date field
});


// Type for form validation data derived from schema
export type TratamientoFormValidationData = z.infer<typeof tratamientoFormSchema>;