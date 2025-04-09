// src/components/forms/EnfermeraForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enfermeraFormSchema, EnfermeraFormValidationData } from '@/schemas/enfermeraSchema';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, XCircle } from 'lucide-react';

interface EnfermeraFormProps {
  onSubmit: (data: EnfermeraFormValidationData) => void;
  initialData?: Partial<EnfermeraFormValidationData>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
  // isEditMode is no longer strictly needed by the form itself for disabling email
}

export function EnfermeraForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = "Guardar",
  onCancel,
}: EnfermeraFormProps) {

  const form = useForm<EnfermeraFormValidationData>({
    resolver: zodResolver(enfermeraFormSchema),
    defaultValues: initialData || {
      nombre: '',
      apellido: '',
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la enfermera" {...field} disabled={isSubmitting} />
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
                  <Input placeholder="Apellido de la enfermera" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Número de contacto" {...field} disabled={isSubmitting} />
                </FormControl>
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
                <FormLabel>Correo Electrónico <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  {/* --- REMOVED isEditMode from disabled --- */}
                  <Input type="email" placeholder="correo@ejemplo.com" {...field} disabled={isSubmitting} />
                </FormControl>
                {/* --- REMOVED conditional warning message --- */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Optional Password Fields remain commented out unless needed */}

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