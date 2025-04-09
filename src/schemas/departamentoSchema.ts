// src/schemas/departamentoSchema.ts
import { z } from 'zod';

export const departamentoFormSchema = z.object({
  nombre: z.string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
    .max(100, { message: "El nombre no puede exceder 100 caracteres." }),

  descripcion: z.string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres." })
    .max(500, { message: "La descripción no puede exceder 500 caracteres." }),

  // Validate jefe as a positive integer number
  jefe: z.coerce // Use coerce to handle potential string input from number field
    .number({ invalid_type_error: "El ID del jefe debe ser un número." })
    .int({ message: "El ID del jefe debe ser un número entero." })
    .positive({ message: "El ID del jefe debe ser un número positivo." }),
});

// Type for form validation data derived from schema
export type DepartamentoFormValidationData = z.infer<typeof departamentoFormSchema>;