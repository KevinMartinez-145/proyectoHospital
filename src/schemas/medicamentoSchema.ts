// src/schemas/medicamentoSchema.ts
import { z } from 'zod';

export const medicamentoFormSchema = z.object({
  nombre: z.string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
    .max(100, { message: "El nombre no puede exceder 100 caracteres." }),

  descripcion: z.string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres." })
    .max(500, { message: "La descripción no puede exceder 500 caracteres." }),

  dosis: z.string()
    .min(1, { message: "La dosis es requerida." })
    .max(50, { message: "La dosis no puede exceder 50 caracteres." }),

  frecuencia: z.string()
    .min(3, { message: "La frecuencia es requerida (ej. 'Cada 8 horas')." })
    .max(100, { message: "La frecuencia no puede exceder 100 caracteres." }),

  id_tratamiento: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un tratamiento." })
    .int()
    .positive({ message: "Debe seleccionar un tratamiento válido." }),
});

// Type for form validation data derived from schema
export type MedicamentoFormValidationData = z.infer<typeof medicamentoFormSchema>;