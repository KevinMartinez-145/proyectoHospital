// src/schemas/pacienteSchemas.ts
import { z } from 'zod';

// Common reusable validations
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const pacienteFormSchema = z.object({
  nombre: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder 50 caracteres" })
    .regex(NAME_REGEX, {
      message: "El nombre solo puede contener letras y espacios"
    }),

  apellido: z.string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede exceder 50 caracteres" })
    .regex(NAME_REGEX, {
      message: "El apellido solo puede contener letras y espacios"
    }),

  fecha_nacimiento: z.date()
    .max(new Date(), { message: "La fecha de nacimiento no puede ser futura" })
    .refine(date => {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      return date > minDate;
    }, { message: "La fecha de nacimiento no puede ser hace más de 120 años" }),

  direccion: z.string()
    .min(5, { message: "La dirección debe tener al menos 5 caracteres" })
    .max(100, { message: "La dirección no puede exceder 100 caracteres" }),

  telefono: z.string()
    .min(7, { message: "El teléfono debe tener al menos 7 dígitos" })
    .max(20, { message: "El teléfono no puede exceder 20 caracteres" })
    .regex(PHONE_REGEX, {
      message: "Formato de teléfono inválido. Ejemplo: +34 600 123 456"
    }),

  correo_electronico: z.string()
    .min(5, { message: "El correo electrónico es requerido" })
    .max(100, { message: "El correo no puede exceder 100 caracteres" })
    .regex(EMAIL_REGEX, {
      message: "Correo electrónico inválido. Ejemplo: usuario@dominio.com"
    }),

  historia_medica: z.string()
    .min(5, { message: "La historia médica debe tener al menos 5 caracteres" })
    .max(2000, { message: "La historia médica no puede exceder 2000 caracteres" })
});

export type PacienteFormValidationData = z.infer<typeof pacienteFormSchema>;