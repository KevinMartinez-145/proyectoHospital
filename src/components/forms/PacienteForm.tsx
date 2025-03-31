// src/components/forms/PacienteForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

// --- Imports ---
import { pacienteFormSchema, PacienteFormValidationData } from '@/schemas/pacienteSchema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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

// --- Component Props ---
interface PacienteFormProps {
  onSubmit: (data: PacienteFormValidationData) => void;
  initialData?: Partial<PacienteFormValidationData>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

export function PacienteForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = "Guardar",
  onCancel,
}: PacienteFormProps) {

  // --- React Hook Form Setup ---
  const form = useForm<PacienteFormValidationData>({
    resolver: zodResolver(pacienteFormSchema),
    defaultValues: initialData || {
      nombre: '',
      apellido: '',
      fecha_nacimiento: undefined,
      direccion: '',
      telefono: '',
      correo_electronico: '',
      historia_medica: '',
    },
    resetOptions: {
        keepDirtyValues: false,
    },
  });

  // --- Form JSX ---
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Grid layout for basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... (Nombre, Apellido fields remain the same) ... */}
           {/* Nombre */}
           <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del paciente" {...field} disabled={isSubmitting} />
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
                  <Input placeholder="Apellido del paciente" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Fecha Nacimiento */}
          <FormField
  control={form.control}
  name="fecha_nacimiento"
  render={({ field }) => (
    <FormItem className="flex flex-col pt-2">
      <FormLabel>Fecha de Nacimiento <span className="text-red-500">*</span></FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
              disabled={isSubmitting}
            >
              {field.value ? (
                format(field.value, "PPP", { locale: es })
              ) : (
                <span>Selecciona una fecha</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* Custom header with separate month/year selectors outside Calendar component */}
          <div className="p-3 flex justify-between items-center space-x-2">
            <select 
              value={field.value ? format(field.value, 'MMMM', { locale: es }) : format(new Date(), 'MMMM', { locale: es })}
              onChange={(e) => {
                const currentDate = field.value || new Date();
                const monthIndex = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'].indexOf(e.target.value);
                
                if (monthIndex !== -1) {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(monthIndex);
                  field.onChange(newDate);
                }
              }}
              className="border rounded p-1 text-sm"
            >
              {['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            
            <select
              value={field.value ? format(field.value, 'yyyy') : format(new Date(), 'yyyy')}
              onChange={(e) => {
                const currentDate = field.value || new Date();
                const newDate = new Date(currentDate);
                newDate.setFullYear(parseInt(e.target.value));
                field.onChange(newDate);
              }}
              className="border rounded p-1 text-sm"
            >
              {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => (
                <option key={1900 + i} value={1900 + i}>{1900 + i}</option>
              ))}
            </select>
          </div>
          
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            // Use buttons only for the built-in calendar navigation
            captionLayout="buttons"
            // Hide the default caption completely since we're using custom selectors
            classNames={{
              caption: "hidden",
              caption_label: "hidden"
            }}
            fromYear={1900}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>
          {/* ... (Correo, Telefono, Direccion fields remain the same) ... */}
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

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Número de teléfono" {...field} value={field.value ?? ''} disabled={isSubmitting} />
                </FormControl>
                 <FormDescription>Opcional.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dirección */}
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección completa" {...field} value={field.value ?? ''} disabled={isSubmitting} />
                </FormControl>
                 <FormDescription>Opcional.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Historia Médica (Full Width) */}
        <FormField
          control={form.control}
          name="historia_medica"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Historia Médica</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alergias, condiciones preexistentes, etc."
                  className="resize-y min-h-[100px]"
                  {...field}
                  value={field.value ?? ''}
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
          {/* Cancel Button */}
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

          {/* Submit Button */}
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