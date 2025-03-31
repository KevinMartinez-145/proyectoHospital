// src/components/forms/PacienteForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

// --- Imports ---
import { pacienteFormSchema, PacienteFormValidationData } from '@/schemas/pacienteSchema'; // Adjust path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Calendar } from "@/components/ui/calendar"; // Import Calendar
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Import Popover components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Loader2 } from 'lucide-react'; // Icons

// --- Component Props ---
interface PacienteFormProps {
  // Function to call when the validated form is submitted
  onSubmit: (data: PacienteFormValidationData) => void;
  // Optional initial data for editing
  initialData?: Partial<PacienteFormValidationData>;
  // Flag to disable form during submission
  isSubmitting?: boolean;
  // Text for the submit button (e.g., "Crear", "Actualizar")
  submitButtonText?: string;
}

export function PacienteForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = "Guardar"
}: PacienteFormProps) {

  // --- React Hook Form Setup ---
  const form = useForm<PacienteFormValidationData>({
    resolver: zodResolver(pacienteFormSchema),
    defaultValues: initialData || { // Use initialData or empty defaults
      nombre: '',
      apellido: '',
      fecha_nacimiento: undefined, // Important: Initialize date as undefined or null
      direccion: '',
      telefono: '',
      correo_electronico: '',
      historia_medica: '',
    },
  });

  // --- Form JSX ---
  return (
    // Provide form context to Shadcn components
    <Form {...form}>
      {/* Use form.handleSubmit to trigger validation before calling our onSubmit */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Grid layout for basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormItem className="flex flex-col pt-2"> {/* Added pt-2 for alignment */}
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
                          format(field.value, "PPP", { locale: es }) // Format displayed date
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange} // RHF expects the value directly
                      disabled={(date) => // Disable future dates or very old dates
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      captionLayout="dropdown-buttons" // Easier year/month navigation
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
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
                {/* Use Textarea for multi-line input */}
                <Textarea
                  placeholder="Alergias, condiciones preexistentes, etc."
                  className="resize-y min-h-[100px]" // Allow vertical resize
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

        {/* Submit Button */}
        <div className="flex justify-end">
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