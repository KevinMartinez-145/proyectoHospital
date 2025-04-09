// src/components/forms/CitaForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

// --- Schemas and Types ---
import { citaFormSchema, CitaFormValidationData } from '@/schemas/citaSchema';
import type { Paciente } from '@/types/paciente';
import type { Doctor } from '@/types/doctor';

// --- Hooks ---
import { useGetPacientes } from '@/hooks/usePacientes';
import { useGetDoctores } from '@/hooks/useDoctores';

// --- Shadcn UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Loader2, XCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton'; // Import Skeleton

interface CitaFormProps {
  onSubmit: (data: CitaFormValidationData) => void;
  initialData?: Partial<CitaFormValidationData>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

export function CitaForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = "Guardar Cita",
  onCancel,
}: CitaFormProps) {

  // --- Fetch Pacientes and Doctores for Selects ---
  const { data: pacientes, isLoading: isLoadingPacientes, isError: isErrorPacientes } = useGetPacientes();
  const { data: doctores, isLoading: isLoadingDoctores, isError: isErrorDoctores } = useGetDoctores();

  // --- Form Setup ---
  const form = useForm<CitaFormValidationData>({
    resolver: zodResolver(citaFormSchema),
    defaultValues: initialData || {
      id_paciente: undefined, // Use undefined for selects initially
      id_doctor: undefined,
      fecha_hora: undefined, // Use undefined for date picker
      motivo_cita: '',
      notas_medicas: '',
    },
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  // --- Handle Time Selection ---
  // Separate state for time as Calendar only handles date
  const [selectedHour, setSelectedHour] = useState<string>(() => {
      return initialData?.fecha_hora ? format(initialData.fecha_hora, 'HH') : '09'; // Default to 09 if no initial data
  });
  const [selectedMinute, setSelectedMinute] = useState<string>(() => {
      return initialData?.fecha_hora ? format(initialData.fecha_hora, 'mm') : '00'; // Default to 00
  });

  // Update form's fecha_hora when date, hour, or minute changes
  const handleDateTimeChange = (newDate?: Date, newHour?: string, newMinute?: string) => {
      const currentDate = form.getValues('fecha_hora') || new Date(); // Get current date from form or use now
      const datePart = newDate || currentDate; // Use newly selected date or existing one
      const hour = newHour ?? selectedHour; // Use newly selected hour or existing state
      const minute = newMinute ?? selectedMinute; // Use newly selected minute or existing state

      // Combine date, hour, and minute
      const combinedDateTime = new Date(datePart);
      combinedDateTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0); // Set hours/minutes, reset seconds/ms

      form.setValue('fecha_hora', combinedDateTime, { shouldValidate: true }); // Update RHF state
  };


  // --- Loading/Error state for dropdowns ---
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
                  defaultValue={field.value?.toString()} // RHF value might be number, Select expects string
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

        {/* --- Fecha y Hora --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
           {/* Date Picker */}
           <FormField
              control={form.control}
              name="fecha_hora"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:col-span-2">
                  <FormLabel>Fecha de la Cita <span className="text-red-500">*</span></FormLabel>
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
                            format(field.value, "PPP", { locale: es }) // Only show date part here
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => handleDateTimeChange(date)} // Update combined date/time
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || isSubmitting} // Disable past dates
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Picker (Hour and Minute Selects) */}
            <FormItem>
                 <FormLabel>Hora <span className="text-red-500">*</span></FormLabel>
                 <div className="flex gap-2">
                    {/* Hour Select */}
                    <Select
                        value={selectedHour}
                        onValueChange={(hour) => {
                            setSelectedHour(hour);
                            handleDateTimeChange(undefined, hour); // Update combined date/time
                        }}
                        disabled={isSubmitting}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="HH" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => ( // Example: 8 AM to 7 PM
                                <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                                    {hour.toString().padStart(2, '0')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* Minute Select */}
                     <Select
                        value={selectedMinute}
                        onValueChange={(minute) => {
                            setSelectedMinute(minute);
                            handleDateTimeChange(undefined, undefined, minute); // Update combined date/time
                        }}
                        disabled={isSubmitting}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="MM" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {['00', '15', '30', '45'].map(minute => ( // Example: 15 min intervals
                                <SelectItem key={minute} value={minute}>
                                    {minute}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
                 {/* Display combined error if needed, though schema handles main validation */}
                 {/* <FormMessage /> */}
            </FormItem>
        </div>


        {/* --- Motivo Cita --- */}
        <FormField
          control={form.control}
          name="motivo_cita"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo de la Cita <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Ej. Chequeo general, Dolor de cabeza..." {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Notas Médicas --- */}
        <FormField
          control={form.control}
          name="notas_medicas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas Médicas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observaciones adicionales (opcional)"
                  className="resize-y min-h-[100px]"
                  {...field}
                  value={field.value ?? ''} // Handle null/undefined
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>Opcional.</FormDescription>
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
          <Button type="submit" disabled={isSubmitting || isLoadingDropdowns}> {/* Disable submit if dropdowns loading */}
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