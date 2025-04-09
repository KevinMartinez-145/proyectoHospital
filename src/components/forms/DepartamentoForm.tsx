// src/components/forms/DepartamentoForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// --- Schemas and Types ---
import { departamentoFormSchema, DepartamentoFormValidationData } from '@/schemas/departamentoSchema';

// --- Shadcn UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2, XCircle } from 'lucide-react';

interface DepartamentoFormProps {
  onSubmit: (data: DepartamentoFormValidationData) => void;
  initialData?: Partial<DepartamentoFormValidationData>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

export function DepartamentoForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = "Guardar Departamento",
  onCancel,
}: DepartamentoFormProps) {

  // --- Form Setup ---
  const form = useForm<DepartamentoFormValidationData>({
    resolver: zodResolver(departamentoFormSchema),
    defaultValues: initialData || {
      nombre: '',
      descripcion: '',
      jefe: undefined, // Use undefined for number input initially
    },
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* --- Nombre Departamento --- */}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Departamento <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Ej. Cardiología" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Descripcion --- */}
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Breve descripción del departamento..."
                  className="resize-y min-h-[100px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Jefe ID --- */}
        <FormField
          control={form.control}
          name="jefe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID del Jefe <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                {/* Use type="number" but remember value might still be string initially */}
                <Input
                    type="number"
                    placeholder="Ingrese el ID numérico del jefe"
                    {...field}
                    // Ensure value is handled correctly if it becomes null/undefined
                    value={field.value ?? ''}
                    onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} // Coerce to number or undefined
                    disabled={isSubmitting}
                 />
              </FormControl>
              <FormDescription>
                Ingrese el ID numérico del jefe asignado (no es una selección).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* --- Action Buttons --- */}
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