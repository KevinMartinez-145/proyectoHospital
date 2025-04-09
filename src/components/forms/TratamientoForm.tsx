// src/components/forms/TratamientoForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

// --- Schemas and Types ---
import { tratamientoFormSchema, TratamientoFormValidationData } from '@/schemas/tratamientoSchema';
import type { Paciente } from '@/types/paciente';
import type { Doctor } from '@/types/doctor';

// --- Hooks ---
import { useGetPacientes } from '@/hooks/usePacientes';
import { useGetDoctores } from '@/hooks/useDoctores';

// --- Shadcn UI Components ---
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Loader2, XCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface TratamientoFormProps {
  onSubmit: (data: TratamientoFormValidationData) => void;
  initialData?: Partial<TratamientoFormValidationData>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

export function TratamientoForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = "Guardar Tratamiento",
  onCancel,
}: TratamientoFormProps) {

  // --- Fetch Pacientes and Doctores ---
  const { data: pacientes, isLoading: isLoadingPacientes, isError: isErrorPacientes } = useGetPacientes();
  const { data: doctores, isLoading: isLoadingDoctores, isError: isErrorDoctores } = useGetDoctores();

  // --- Form Setup ---
  const form = useForm<TratamientoFormValidationData>({
    resolver: zodResolver(tratamientoFormSchema),
    defaultValues: initialData || {
      id_paciente: undefined,
      id_doctor: undefined,
      descripcion: '',
      fecha_inicio: undefined,
      fecha_fin: undefined,
    },
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  const isLoadingDropdowns = isLoadingPacientes || isLoadingDoctores;
  const isErrorDropdowns = isErrorPacientes || isErrorDoctores;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* --- Paciente Select --- */}
        <FormField
          control={form.control}
          name="id_paciente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paciente <span className="text-red-500">*</span></FormLabel>
              {isLoadingDropdowns ? (
                 <Skeleton className="h-10 w-full" />
              ) : isErrorDropdowns ? (
                 <div className="text-red-500 text-sm">Error al cargar pacientes</div>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                  disabled={isSubmitting || !pacientes}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un paciente..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pacientes?.map((p: Paciente) => (
                      <SelectItem key={p.id_paciente} value={p.id_paciente.toString()}>
                        {p.nombre} {p.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Doctor Select --- */}
        <FormField
          control={form.control}
          name="id_doctor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor <span className="text-red-500">*</span></FormLabel>
               {isLoadingDropdowns ? (
                 <Skeleton className="h-10 w-full" />
              ) : isErrorDropdowns ? (
                 <div className="text-red-500 text-sm">Error al cargar doctores</div>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                  disabled={isSubmitting || !doctores}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un doctor..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctores?.map((d: Doctor) => (
                      <SelectItem key={d.id_doctor} value={d.id_doctor.toString()}>
                        {d.nombre} {d.apellido} ({d.especialidad})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
              <FormLabel>Descripción del Tratamiento <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalles del tratamiento, medicación, dosis, etc."
                  className="resize-y min-h-[100px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Fechas Inicio y Fin --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Fecha Inicio */}
           <FormField
              control={form.control}
              name="fecha_inicio"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Inicio <span className="text-red-500">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione fecha inicio</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isSubmitting}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Fecha Fin */}
           <FormField
              control={form.control}
              name="fecha_fin"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Fin <span className="text-red-500">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione fecha fin</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        // Optionally disable dates before fecha_inicio
                        disabled={(date) =>
                            (form.getValues("fecha_inicio") && date < form.getValues("fecha_inicio")) || isSubmitting
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
          <Button type="submit" disabled={isSubmitting || isLoadingDropdowns}>
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