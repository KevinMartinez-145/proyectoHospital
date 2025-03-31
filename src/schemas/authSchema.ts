// src/schemas/authSchemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(4, { message: 'La contraseña debe tener al menos 4 caracteres.' }),
  // rol: z.enum(['admin', 'doctor', 'enfermera']).optional(), // Add if you have a role selector
});

// Type for form data derived from schema
export type LoginFormData = z.infer<typeof loginSchema>;