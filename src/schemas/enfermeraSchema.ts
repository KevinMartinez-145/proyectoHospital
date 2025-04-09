// src/schemas/enfermeraSchema.ts
import { z } from 'zod';

// Reusable regex patterns
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const enfermeraFormSchema = z.object({
  nombre: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder 50 caracteres" })
    .regex(NAME_REGEX, { message: "El nombre solo puede contener letras y espacios" }),

  apellido: z.string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede exceder 50 caracteres" })
    .regex(NAME_REGEX, { message: "El apellido solo puede contener letras y espacios" }),

  telefono: z.string()
    .min(7, { message: "El teléfono debe tener al menos 7 dígitos" })
    .max(20, { message: "El teléfono no puede exceder 20 caracteres" })
    .regex(PHONE_REGEX, { message: "Formato de teléfono inválido." }),
    // Making it required based on API example

  correo_electronico: z.string()
    .min(5, { message: "El correo electrónico es requerido" })
    .max(100, { message: "El correo no puede exceder 100 caracteres" })
    .regex(EMAIL_REGEX, { message: "Correo electrónico inválido." }),
    // Making it required based on API example

})



// Type for form validation data derived from schema
export type EnfermeraFormValidationData = z.infer<typeof enfermeraFormSchema>;