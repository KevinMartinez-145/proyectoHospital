// src/components/forms/DoctorForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doctorFormSchema, DoctorFormValidationData } from '@/schemas/doctorSchema';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription, // Keep if needed for optional fields
} from "@/components/ui/form";
import { Loader2, XCircle } from 'lucide-react';

interface DoctorFormProps {
  onSubmit: (data: DoctorFormValidationData) => void;
  initialData?: Partial<DoctorFormValidationData>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

export function DoctorForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = "Guardar",
  onCancel,
}: DoctorFormProps) {

  const form = useForm<DoctorFormValidationData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: initialData || {
      nombre: '',
      apellido: '',
      especialidad: '',
      horario_atencion: '', // <-- ADDED default
      telefono: '',
      correo_electronico: '',
    },
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* --- Adjusted Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del doctor" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido */}
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Apellido del doctor" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Especialidad */}
          <FormField
            control={form.control}
            name="especialidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidad <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Cardiología, Pediatría..." {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- ADDED Horario Atencion --- */}
          <FormField
            control={form.control}
            name="horario_atencion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horario Atención <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="HH:MM-HH:MM (ej. 09:00-17:00)" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* --- END ADDED --- */}


          {/* Teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Número de contacto" {...field} value={field.value ?? ''} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>Opcional.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Correo Electrónico */}
          <FormField
            control={form.control}
            name="correo_electronico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="correo@ejemplo.com" {...field} value={field.value ?? ''} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>Opcional.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> {/* End Grid */}


        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );




  
}