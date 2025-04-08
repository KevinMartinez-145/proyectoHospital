// src/schemas/doctorSchema.ts
import { z } from 'zod';

const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const doctorFormSchema = z.object({
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

  especialidad: z.string()
    .min(3, { message: "La especialidad debe tener al menos 3 caracteres" })
    .max(100, { message: "La especialidad no puede exceder 100 caracteres" }),

  telefono: z.string()
    .min(7, { message: "El teléfono debe tener al menos 7 dígitos" })
    .max(20, { message: "El teléfono no puede exceder 20 caracteres" })
    .regex(PHONE_REGEX, {
      message: "Formato de teléfono inválido. Ejemplo: +34 600 123 456"
    })
    .optional()
    .or(z.literal("")),

  correo_electronico: z.string()
    .max(100, { message: "El correo no puede exceder 100 caracteres" })
    .regex(EMAIL_REGEX, {
      message: "Correo electrónico inválido. Ejemplo: usuario@dominio.com"
    })
    .optional()
    .or(z.literal("")),

  descripcion: z.string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres" })
    .max(2000, { message: "La descripción no puede exceder 2000 caracteres" })
    .optional()
    .or(z.literal("")),
});

export type DoctorFormValidationData = z.infer<typeof doctorFormSchema>;
