// src/schemas/citaSchema.ts
import { z } from 'zod';

export const citaFormSchema = z.object({
  // Use coerce for select inputs which might return strings initially
  id_paciente: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un paciente." })
    .int()
    .positive({ message: "Debe seleccionar un paciente válido." }),

  id_doctor: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un doctor." })
    .int()
    .positive({ message: "Debe seleccionar un doctor válido." }),

  // Validate as Date object in the form
  fecha_hora: z.date({
    required_error: "La fecha y hora de la cita son requeridas.",
    invalid_type_error: "Formato de fecha y hora inválido.",
  })
  .min(new Date(new Date().setHours(0, 0, 0, 0)), { message: "La cita no puede ser en el pasado." }), // Ensure date is not in the past

  motivo_cita: z.string()
    .min(3, { message: "El motivo debe tener al menos 3 caracteres." })
    .max(255, { message: "El motivo no puede exceder 255 caracteres." }),

  notas_medicas: z.string()
    .max(1000, { message: "Las notas no pueden exceder 1000 caracteres." })
    .optional()
    .or(z.literal('')), // Allow empty string for optional textarea
});

// Type for form validation data derived from schema
export type CitaFormValidationData = z.infer<typeof citaFormSchema>;