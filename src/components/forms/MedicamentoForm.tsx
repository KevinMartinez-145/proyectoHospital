// src/components/forms/MedicamentoForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// --- Schemas and Types ---
import { medicamentoFormSchema, MedicamentoFormValidationData } from '@/schemas/medicamentoSchema';
import type { Tratamiento } from '@/types/tratamiento'; // Need full Tratamiento to get patient/doctor info

// --- Hooks ---
import { useGetTratamientos } from '@/hooks/useTratamientos'; // Fetch tratamientos for select

// --- Shadcn UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, XCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface MedicamentoFormProps {
  onSubmit: (data: MedicamentoFormValidationData) => void;
  initialData?: Partial<MedicamentoFormValidationData>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

export function MedicamentoForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = "Guardar Medicamento",
  onCancel,
}: MedicamentoFormProps) {

  // --- Fetch Tratamientos for Select ---
  const { data: tratamientos, isLoading: isLoadingTratamientos, isError: isErrorTratamientos } = useGetTratamientos();

  // --- Form Setup ---
  const form = useForm<MedicamentoFormValidationData>({
    resolver: zodResolver(medicamentoFormSchema),
    defaultValues: initialData || {
      nombre: '',
      descripcion: '',
      dosis: '',
      frecuencia: '',
      id_tratamiento: undefined,
    },
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  const isLoadingDropdown = isLoadingTratamientos;
  const isErrorDropdown = isErrorTratamientos;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* --- Tratamiento Select --- */}
        <FormField
          control={form.control}
          name="id_tratamiento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tratamiento Asociado <span className="text-red-500">*</span></FormLabel>
              {isLoadingDropdown ? (
                 <Skeleton className="h-10 w-full" />
              ) : isErrorDropdown ? (
                 <div className="text-red-500 text-sm">Error al cargar tratamientos</div>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                  disabled={isSubmitting || !tratamientos}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tratamiento..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tratamientos?.map((t: Tratamiento) => (
                      <SelectItem key={t.id_tratamiento} value={t.id_tratamiento.toString()}>
                        {/* Display useful info like Patient Name + Treatment Desc */}
                        {`ID: ${t.id_tratamiento} - ${t.paciente.nombre} ${t.paciente.apellido} - ${t.descripcion.substring(0, 50)}...`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Nombre Medicamento --- */}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Medicamento <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Ej. Paracetamol 500mg" {...field} disabled={isSubmitting} />
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
                  placeholder="Indicaciones, propósito del medicamento..."
                  className="resize-y min-h-[80px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Dosis y Frecuencia --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dosis */}
            <FormField
              control={form.control}
              name="dosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosis <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. 500mg, 1 comprimido" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Frecuencia */}
            <FormField
              control={form.control}
              name="frecuencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Cada 8 horas, 1 vez al día" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>


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
          <Button type="submit" disabled={isSubmitting || isLoadingDropdown}>
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